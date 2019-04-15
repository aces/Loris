<?php declare(strict_types=1);
/**
 * This file contains functions used to satisfy LORIS system requirements on
 * Ubuntu environments.
 *
 * Production environments should not use this tool as their dependency
 * management should be performed by a proper package such as a .deb file.
 *
 * PHP Version 7
 *
 * @category Set-up
 * @package  Tools
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once 'CLI_Helper.class.inc';
require_once 'Bootstrapper.class.inc';
error_reporting(E_ALL);
/**
 * This class contains an implementation of the Bootstrapper interface and
 * provides functionality that can satisfy system requirements on developer
 * environments in order to successfully run the LORIS software.
 *
 * @category Set-up
 * @package  Tools
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UbuntuBootstrapper extends CLI_Helper implements Bootstrapper
{

    /* @var array $requirements An array of names of packages that can be
     * installed via apt on Ubuntu environments.
     */
    var $requirements = array();

    /**
     * Creates a new object from the class.
     *
     * @param array $args A copy of the command-line arguments used to run a
     * calling script.
     *
     * @return void
     */
    public function __construct(array $args = array())
    {
        parent::__construct($args);
        $required_php = self::PHP_MAJOR_VERSION_REQUIRED
            . '.'
            . self::PHP_MINOR_VERSION_REQUIRED;

        // Dependencies last updated for version: 20.2.0
        // This list should consist only of packages that can be installed
        // via apt on Ubuntu environments and must not include libraries that
        // should be installed via tools such as npm and composer.
        $this->requirements = array(
                               "curl",
                               "wget",
                               "zip",
                               "unzip",
                               "php-json",
                               "make",
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

    /**
     * {@inheritDoc}
     *
     * @return bool Whether the requirement is met.
     */
    public function phpRequirementSatisfied(): bool
    {
        return PHP_MAJOR_VERSION >= self::PHP_MAJOR_VERSION_REQUIRED
            && PHP_MINOR_VERSION >= self::PHP_MINOR_VERSION_REQUIRED;
    }


    /**
     * {@inheritDoc}
     *
     * @return bool Whether the requirement is met.
     */
    public function apacheRequirementSatisfied(): bool
    {
        // Get string representation of apache version number.
        // This command yields e.g. Apache/2.4.34
        $cmdOutput = shell_exec(
            "apache2 -v | " .
            "head -n 1 | " .
            "cut -d ' ' -f 3"
        );
        if (is_null($cmdOutput)) {
            // Apache2 is not installed.
            return false;
        }
        $apacheParts   = explode(
            '/',
            $cmdOutput
        );
        $apacheVersion = end($apacheParts);

        // Look for the string "$major.$minor" in info string. Also match on versions
        // higher than minor version because we want AT LEAST that version.
        $pattern = sprintf(
            "/%s\.[%s-9].[0-9]/",
            self::APACHE_MAJOR_VERSION_REQUIRED,
            self::APACHE_MINOR_VERSION_REQUIRED
        );

        // When preg_match returns 0 it means no match was found.
        return preg_match($pattern, $apacheVersion) !== 0;
    }


    /**
     * {@inheritDoc}
     *
     * @param string $name Name of package to install
     *
     * @return bool True if package installed/upgraded successfull. Otherwise false
     */
    function installed(string $name) : bool
    {
        return $this->doExec("dpkg -s $name");
    }

    /**
     * {@inheritDoc}
     *
     * @param array $packages List of packages to install.
     *
     * @return bool true if all packages installed properly. False otherwise.
     */
    public function installPackages(array $packages): bool
    {
        if (count($packages) === 0) {
            return true;
        }
        foreach ($packages as $p) {
            if ($this->installPackage($p) === false) {
                return false;
            }
        }
        return true;
    }


    /**
     * {@inheritDoc}
     *
     * @param string $name Name of package to install
     *
     * @return bool True if package installed/upgraded successfull. Otherwise false
     */
    function installPackage(string $name): bool
    {
        // Use -f flag to fix broken dependencies. Show help resolve package
        // dependencies.
        $cmd  = "sudo apt-get -f install ";
        $cmd .= escapeshellarg($name);
        return $this->doExec($cmd);
    }

    /**
     * {@inheritDoc}
     *
     * @return array of names of missing requirements
     */
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
