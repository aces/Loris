#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This tool verifies that the language po file and language template pot file are
 * kept in sync for languages that are supported by LORIS.
 *
 * It can be used to either look for strings that are in a language's po
 * file that are missing from the pot by passing the "--extra" flag or
 * to look for strings in the template that are missing from a language
 * by passing the "--missing" flag. (You can also pass both to flag
 * all errors.)
 *
 * The --lang=XX parameter can be used to restrict the script to checking
 * one specific language.
 *
 * The script exits with a "1" if errors are found or "0" if there are
 * no errors present, so that it can be integrated into our testing pipeline.
 */
require_once 'generic_includes.php';

$patterns = [
    __DIR__ . "/../locale/*.pot",
    __DIR__ . "/../modules/*/locale/*.pot"
];

$languages = [
    'en',
    'fr',
    'es',
    'ja',
    'hi',
    'zh'

];

$options = getopt("v", ['missing', 'extra', 'lang:']);
$missing = isset($options['missing']);
$extra   = isset($options['extra']);
$verbose = isset($options['v']);
if (isset($options['lang'])) {
    $languages = [$options['lang']];
}

if ($missing === false && $extra === false) {
    fprintf(STDERR, "usage: %s [-v] [--lang=..] --missing | --extra\n", $argv[0]);
    exit(1);
}

$founderrors = false;
foreach ($languages as $lang) {
    if ($verbose) {
        fwrite(STDERR, "Validating $lang:\n");
    }

    foreach ($patterns as $pattern) {
        foreach (glob($pattern) as $filename) {
            $finfo = pathinfo(realpath($filename));
            if ($verbose) {
                fprintf(STDERR, "Validating $finfo[filename]\n");
            }
            if ($missing) {
                validatemissing($finfo['dirname'], $finfo['filename'], $lang);

            }
            if ($extra) {
                validateextra($finfo['dirname'], $finfo['filename'], $lang);
            }
        }
    }
}

/**
 * Validate that there are no po strings missing that are present in the pot
 * file. Returns true on success, false on error.
 *
 * @param string $dir       The base of the locale directory (LORIS's or the
 *                          module's)
 * @param string $namespace The namespace being verified
 * @param string $language  The language being verified
 *
 * @return bool
 */
function validatemissing(string $dir, string $namespace, string $language) : bool
{
    $transfile = $dir . "/" . $language . "/LC_MESSAGES/" . $namespace . ".po";
    $potfile   = $dir . "/" . $namespace . ".pot";

    if (file_exists($transfile) === false ) {
        fprintf(STDERR, "$namespace translations do not exist for $language\n");
        return false;
    }
    $results = compare($potfile, $transfile);
    if (!empty($results['mismatch'])) {
        foreach ($results['mismatch'] as $result) {
            print("$language\t$namespace\tMissing\t$result\n");
        }
    }
    return true;
}

/**
 * Validate that there are no pot strings missing that are present in the po
 * file. Returns true on success, false on error.
 *
 * @param string $dir       The base of the locale directory (LORIS's or the
 *                          module's)
 * @param string $namespace The namespace being verified
 * @param string $language  The language being verified
 *
 * @return bool
 */
function validateextra(string $dir, string $namespace, string $language)
{
    $transfile = $dir . "/" . $language . "/LC_MESSAGES/" . $namespace . ".po";
    $potfile   = $dir . "/" . $namespace . ".pot";

    if (file_exists($transfile) === false ) {
        return false;
    }

    $results = compare($transfile, $potfile);
    if (!empty($results['mismatch'])) {
        foreach ($results['mismatch'] as $result) {
            print("$language\t$namespace\tExtra\t$result\n");
        }
    }
    return true;

}

/**
 * Compare file1 to file2. file1 and file2 must be filenames.
 *
 * Returns an array containing a 'total' key with all msgids that
 * were present in file1, and a "mismatch" line containing all
 * that were not present in file2.
 *
 * @param string $file1 The first file to compare
 * @param string $file2 The file to compare against
 *
 * @return array
 */
function compare(string $file1, string $file2) : array
{
    global $founderrors;
    $content = file_get_contents($file1);
    $matches = [];
    preg_match_all("/msgid \"(.*)\"/", $content, $matches);
    $strings = $matches[1];

    $mismatch         = [];
    $language_content = file_get_contents($file2);

    foreach ($strings as $str) {
        $mstr = 'msgid "' . $str . '"';
        if (strpos($language_content, $mstr) === false) {
            $founderrors = true;
            $mismatch[]  = $str;
        }
    }
    return ['total' => $matches[1], 'mismatch' => $mismatch];
}

exit($founderrors === false ? 0 : 1);
