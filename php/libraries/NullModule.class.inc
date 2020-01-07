<?php declare(strict_types=1);
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
    protected $longname;
    /**
     * The NullModule is used in cases where there is no
     * directory to pass (such as unit tests) and as such
     * only takes an (optional) name as an argument.
     *
     * @param string $name An optional name to use for this module.
     */
    public function __construct(string $name='')
    {
        $this->longname = $name;
        parent::__construct($name, "");
    }

    /**
     * The NullModule has an empty long name.
     *
     * @return string The empty string
     */
    public function getLongName() : string
    {
        return $this->longname;
    }
}
