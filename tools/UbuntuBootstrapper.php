<?php declare(strict_types=1);
/* This script verifies a development installation of LORIS by ensuring that
 * the system has all of the required dependencies such as the correct PHP and
 * Apache versions as well as other miscellaneous extensions and system tools.
 *
 * Production environments should not run this tool as their dependency 
 * management should be performed by a proper package such as a .deb file.
 *
 * Currently only Ubuntu environments are supported by this script.
 *
 * @author John Saigle <john.saigle@mcin.ca>
 */
require_once('CLI_Helper.class.inc');
require_once('Bootstrapper.class.inc');
error_reporting(E_ALL);
/**
 *
 * @author John Saigle <john.saigle@mcin.ca>
 */
class UbuntuBootstrapper extends CLI_Helper implements Bootstrapper {

    var $requirements = array();

    public function __construct(array $args) {
        parent::__construct();
        $required_php = self::PHP_MAJOR_VERSION_REQUIRED 
            . '.' 
            . self::PHP_MINOR_VERSION_REQUIRED;
        $this->requirements = array(
            "wget",
            "zip",
            "unzip",
            "php-json",
            "npm",
            "software-properties-common",
            "php-ast",
            "php$required_php",
            "php$required_php-mysql",
            "php$required_php-xml",
            "php$required_php-json",
            "php$required_php-mbstring",
            "php$required_php-gd",
            "libapache2-mod-php$required_php",
        );
    }
    // Dependencies last updated for version: 20.0.1
    // This list should consist only of packages that can be installed via apt on
    // Ubuntu environments and must not include libraries that should be installed
    // via tools such as npm and composer.

    public function phpRequirementSatisfied(): bool {
        return PHP_MAJOR_VERSION >= self::PHP_MAJOR_VERSION_REQUIRED
            && PHP_MINOR_VERSION >= self::PHP_MINOR_VERSION_REQUIRED;
    }
    

    public function apacheRequirementSatisfied(): bool {
        // Get string representation of apache version number
        $apache_parts = explode(
            '/', 
            // this command yields e.g. Apache/2.4.34
            shell_exec(
                "apache2 -v | " . 
                "head -n 1 | " .
                "cut -d ' ' -f 3"
            )
        );
        $apache_version = end($apache_parts);

        // Look for the string "$major.$minor" in info string. Also match on versions
        // higher than minor version because we want AT LEAST that version.
        $pattern = sprintf(
            "/%s\.[%s-9].[0-9]/",
            self::APACHE_MAJOR_VERSION_REQUIRED,
            self::APACHE_MINOR_VERSION_REQUIRED
        );

        // When preg_match returns 0 it means no match was found.
        return preg_match($pattern, $apache_version) !== 0;
    }

    public function installPackages(array $packages): bool
    {
        if (count($packages) === 0) {
            return true;
        }
        echo '[*] Installing requirements...' . PHP_EOL;
        foreach ($packages as $p) {
            if ($this->installPackage($p) === false) {
                return false;
            }
        }
        return true;
    }

    function installed(string $tool) : bool
    {
        return $this->doExec("which $tool") || $this->doExec("dpkg -s $tool");
    }


    function installPackage(string $name): bool
    {
        $cmd = "sudo apt-get install ";
        $cmd .= escapeshellarg($name);
        return $this->doExec($cmd);
    }

    function getMissingPackages(): array
    {
        $missing = array();
        foreach ($this->requirements as $tool) {
            if (!$this->installed($tool)) {
                $missing[] = $tool;
            }
        }

        return $missing;
    }
}
