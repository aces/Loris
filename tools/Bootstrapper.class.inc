<?php declare(strict_types=1);
/**
 * This file contains an interface that defines functions used to bootstrap a
 * system to be ready to use LORIS. It also includes constants used to determine
 * minimum software requirements. 
 */

/**
 * Defines an interface to be extended by classes corresponding to different
 * UNIX-like distributions. LORIS requires a minimum PHP and Apache version as
 * well as various system tools and PHP extensions in order to function. As
 * different systems will have differnt package managers and other programs used
 * to manage software, this cannot be done in a generic way. The classes
 * implementing this interface are responsible for using the appropriate OS tools
 * to satisfy
 */
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
     * Whether the PHP version used by the system is sufficient to run LORIS.
     * Should check both the major and minor versions of PHP using the built-in
     * PHP constants PHP_MAJOR_VERSION and PHP_MINOR_VERSION.
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
     * Returns whether a given package is installed on the system. Examples
     * include the zip tool or the php-ast extension.
     *
     * @param string $tool Name of tool
     *
     * @return bool representing if tool is installed
     */
    function installed(string $name): bool;

    /**
     * Installs or upgrades an individual package. Should use a system package
     * manager such as apt, yum, etc.
     *
     * @param string $name         Name of package to install
     *
     * @return bool True if package installed/upgraded successfull. Otherwise false
     */
    function installPackage(string $name): bool;

    /**
     * Installs a group of packages by calling the installPackage function
     * using a loop structure. Should use the output of getMissingPackages()
     * as its argument.
     *
     * @param array $packages     List of packages to install.
     *
     * @return bool true if all packages installed properly. False otherwise.
     */
    function installPackages(array $packages): bool;

    /**
     * Return a list of the packages that are not installed but are required.
     * This should be done by checking a class variable containing the list of
     * names of packages to install. This function should iterate over this list
     * using the installed() function.
     *
     * @param array $required Packages required by LORIS
     *
     * @return array of names of missing requirements
     */
    function getMissingPackages(): array;
}
