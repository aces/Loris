#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * PHP Version 8
 *
 * @author  Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */

require_once 'generic_includes.php';

$flagsEnd = 0;
$flags    = getopt("hj", ['jsx', 'help'], $flagsEnd);


$jsx  = isset($flags['j']) || isset($flags['jsx']);
$help = isset($flags['h']) || isset($flags['help']);

if ($help) {
    usage();
    exit(0);
}
if ($argc !== $flagsEnd+1) {
    usage();
    exit(1);
}
$mdir = $argv[$flagsEnd];

if (file_exists($mdir)) {
    fwrite(STDERR, "$mdir already exists, can not create new module.");
    exit(2);
}

$path = pathinfo($mdir);
if (!empty($path['extension'])) {
    fwrite(STDERR, "$mdir should not have a file extension");
    exit(2);
}

$mname = $path['filename'];
if (!is_writable($path['dirname'])) {
    fwrite(STDERR, "Can not create $mname, $path[dirname] is not writeable.");
    exit(2);
}

if (mkdir($mdir) === false) {
    fwrite(STDERR, "Can not create directory $mdir");
    exit(2);

}
if (mkdir($mdir . DIRECTORY_SEPARATOR . "SQL") === false) {
    fwrite(STDERR, "Can not create directory $mdir/SQL");
    exit(2);

}
if (mkdir($mdir . DIRECTORY_SEPARATOR . "php") === false) {
    fwrite(STDERR, "Can not create directory $mdir/php");
    exit(2);

}

if (mkdir($mdir . DIRECTORY_SEPARATOR . "test") === false) {
    fwrite(STDERR, "Can not create directory $mdir/test");
    exit(2);
}

if (mkdir($mdir . DIRECTORY_SEPARATOR . "help") === false) {
    fwrite(STDERR, "Can not create directory $mdir/help");
    exit(2);
}


writeFile(
    $mdir . DIRECTORY_SEPARATOR . "README.md",
<<<EOF
# $mname

## Purpose

[Short Module purpose description goes here]

## Intended Users

[List intended users of module]

## Scope

[List intended scope of the module]

NOT in scope:

[List possible misinterpretations of scope of module that
 are not intended]

## Permissions

The $mname module uses the following permissions. Any one of them
is sufficient to have access to the module.

[List module permissions with a brief description of what each does.]

## Configurations

[List configurations that affect the behaviour of the module.
 If necessary, include subheadings for things like database configurations,
 filesystem configurations, etc]

## Interactions with LORIS

[List ways that this module interacts with other modules in LORIS if applicable.
 If there are no interactions, delete this section]

EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR . "SQL"
          . DIRECTORY_SEPARATOR . date("Y-m-d-") . $mname . '.sql',
<<<EOF
INSERT INTO modules (Name, Active) VALUES ('$mname', 'Y');

/*
 INSERT INTO permissions (code, description, moduleID, action)
     SELECT '$mname','Access module $mname', m.ID, 'View'
        FROM modules m WHERE Name='$mname';
*/

/*
CREATE TABLE $mname (
 ...
);
*/
EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR . "php"
          . DIRECTORY_SEPARATOR . "module.class.inc",
<<<EOF
<?php declare(strict_types=1);
namespace LORIS\\$mname;

/**
 * Module descriptor class for the $mname module.
 */
class Module extends \Module {
    public function getLongName() : string {
        // XXX: Return the long, human-readable name of the module here
        return "$mname";
    }
}
EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR . "php"
          . DIRECTORY_SEPARATOR . "$mname.class.inc",
<<<EOF
<?php declare(strict_types=1);
namespace LORIS\\$mname;

/**
 * This class is the main entry point for the module $mname.
 * It handles incoming requests to the root page of the module.
 */
class $mname extends \NDB_Page {
    public \$skipTemplate = true;

}

EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR. "php"
          . DIRECTORY_SEPARATOR . "some_api.class.inc",
<<<EOF
<?php declare(strict_types=1);
namespace LORIS\\$mname;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This class is an example API endpoint for the module. It
 * handles incoming requests to the module url LORIS/$mname/some_api
 * and returns JSON.
 *
 * You may copy/rename it as necessary, or if not required delete
 * it.
 */
class some_api extends \LORIS\Http\Endpoint {
    public function _hasAccess(\User \$user) : bool {
        // XXX: Add permission checks here if necessary.
        return true;
    }
    public function handle(ServerRequestInterface \$request) : ResponseInterface
    {
        // XXX: Do something with the incoming request here.
        return new \LORIS\Http\Response\JSON\OK(["success" => "Alright."]);
    }
}
EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR. "help"
          . DIRECTORY_SEPARATOR . "$mname.md",
<<<EOF
# $mname Help

User help text goes here.
EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR. "test"
          . DIRECTORY_SEPARATOR . "TestPlan.md",
<<<EOF
## $mname test plan

[List of steps to be taken to test the module. If necessary, split
 into subsections for different features]
EOF
);

writeFile(
    $mdir . DIRECTORY_SEPARATOR. "test"
          . DIRECTORY_SEPARATOR . "{$mname}Test.php",
<<<EOF
<?php

// XXX This should be made relative to __DIR__
require_once "test/integrationtests/LorisIntegrationTest.class.inc";

class {$mname}Test extends LorisIntegrationTest {
    function testPageDoesLoad()
    {
        \$this->safeGet(\$this->url . "/$mname/");
        \$bodyText = \$this->safeFindElement(
                WebDriverBy::cssSelector("#breadcrumbs")
        )->getText();
        \$this->assertStringContainsString("$mname", \$bodyText);
        \$this->assertStringNotContainsString(
                "You do not have access to this page.",
                \$bodyText
        );
        \$this->assertStringNotContainsString(
            "An error occured while loading the page.",
            \$bodyText
        );
    }

    function testPageDoesNotLoadWithoutPermissions()
    {
        // Without permissions
        \$this->setupPermissions(array(''));
        \$this->safeGet(
            \$this->url . "/$mname/"
        );

        \$errorText = \$this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        \$this->assertStringContainsString(
            "You do not have access to this page.",
            \$errorText
        );
    }
}
EOF
);

if ($jsx) {
    if (mkdir($mdir . DIRECTORY_SEPARATOR . "jsx") === false) {
        fwrite(STDERR, "Can not create directory $mdir/help");
        exit(2);
    }
    writeFile(
        $mdir . DIRECTORY_SEPARATOR. "jsx"
              . DIRECTORY_SEPARATOR . "index.tsx",
        <<<EOF
import {createRoot} from 'react-dom/client';

function Index({}) : React.ReactElement {
    return <div>Welcome to $mname!</div>;
}
declare const loris: any;
window.addEventListener('load', () => {
    const element = document.getElementById('lorisworkspace');
    if (!element) {
        throw new Error('Missing lorisworkspace');
    }
    const root = createRoot(element);

    root.render(
      <Index BaseURL={loris.BaseURL} />
    );
});
EOF
    );
}


print <<<EOF
Successfully created stub for module $mname in $mdir.

Next steps:
- Adjust permissions in SQL patch in $mname/SQL directory
- Add any necessary CREATE TABLE or other SQL statements to SQL patch
- Source SQL patch into your development database
- Update documentation in README.md
- Update module long name in $mname/php/module.class.inc
- Write test plan for module in $mname/test/TestPlan.md
- Write automated tests for module in $mname/test
- Adjust module as needed (create new endpoints, modify JSX, etc)
- Write user help content for module in $mname/help.
- If dealing with candidate data, add candidate profile widget
  in module getWidgets function
EOF;
if ($jsx) {
    print "\n- Update webpack.config.ts to ensure module entrypoint is compiled";
}

/**
 * Prints help text for this tool.
 *
 * @return void
 */
function usage(): void
{
    global $argv;
    print <<<ENDHELP
usage: $argv[0] [--jsx] moduledirectory

Options:
    --jsx         Add stub jsx file
    -h/--help     Show this screen

ENDHELP;

}

/**
 * Writes a file to the filesystem and exits if there is an error

 * @param string $filename - The filename to write
 * @param string $content  - The content to put into the file
 *
 * @return void
 */
function writeFile(string $filename, string $content)
{
    if (file_put_contents($filename, $content) === false) {
        fwrite(STDERR, "Could not write $filename");
        exit(2);
    }
}

