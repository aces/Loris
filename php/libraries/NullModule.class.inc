<?php
/**
 * This file contains a stub class which extends "Module" to be
 * non-abstract and instantiatable. It's intended for use in
 * places that need a Module argument but have no meaningful
 * "module" to provide.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The NullModule class provides an instantiable but mostly
 * meaningless \Module descriptor.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NullModule extends Module
{
    /**
     * The NullModule takes no arguments
     */
    public function __construct()
    {
        parent::__construct("", "");
    }

    /**
     * The NullModule has an empty long name.
     *
     * @return string The empty string
     */
    public function getLongName() : string
    {
        return "";
    }
}
