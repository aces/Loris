<?php declare(strict_types=1);

interface Bootstrapper {

    /* Declare constants used in the script to represent the minimum versions of 
     * PHP and Apache as well as the names of required system packages needed to
     * set-up a development environment for LORIS.
     * TODO: These values must be updated as time goes on.
     *
     * Last updated for version: 20.2.0
     */
    const PHP_MAJOR_VERSION_REQUIRED = 7;
    const PHP_MINOR_VERSION_REQUIRED = 2;
    const APACHE_MAJOR_VERSION_REQUIRED = 2;
    const APACHE_MINOR_VERSION_REQUIRED = 4;

    /**
     * Make sure that the installed version of PHP is sufficient.
     *
     * @return bool Whether the requirement is met.
     */
    function phpRequirementSatisfied(): bool;

    /**
     * Returns whether the installed version of Apache is sufficient.
     *
     * @return bool Whether the requirement is met.
     */
    function apacheRequirementSatisfied(): bool;

    /**
     * Returns whether a given package is installed,
     *
     * @param string $tool Name of tool
     *
     * @return bool representing if tool is installed
     */
    function installed(string $name): bool;

    /**
     * Installs or upgrades an individual package.
     *
     * @param string $name         Name of package to install
     *
     * @return bool True if package installed/upgraded successfull. Otherwise false
     */
    function installPackage(string $name): bool;

    /**
     * Installs a group of packages.
     *
     * @param array $packages     List of apt packages to install.
     *
     * @return bool true if all packages installed properly. False otherwise.
     */
    function installPackages(array $packages): bool;

    /**
     * Return a list of the packages that are not installed but are required.
     *
     * @param array $required Packages required by LORIS
     *
     * @return array of names of missing requirements
     */
    function getMissingPackages(): array;
}
