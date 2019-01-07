<?php declare(strict_types=1);
/**
 * This file represents a BreadcrumbTrail object that can be printed as a string
 * that contains all its breadcrumbs.
 *
 * PHP Version 7
 *
 * @category Breadcrumbs
 * @package  User_Interface
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * A BreadcrumbTrail is a list of breadcrumbs to provide to the front-end
 *
 * @category Breadcrumbs
 * @package  User_Interface
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class BreadcrumbTrail
{
    /**
     * A list of breadcrumbs.
     *
     * @var Breadcrumb[]
     */
    protected $breadcrumbs;

    /**
     * The constructor
     *
     * @param Breadcrumb ...$crumbs A list of breadcrumbs
     */
    public function __construct(Breadcrumb ...$crumbs)
    {
        $this->breadcrumbs = $crumbs ?? array();
    }

    /**
     * Returns a string representation of that object.
     *
     * @return string The string
     */
    public function __toString(): string
    {
        return implode(',', $this->breadcrumbs);
    }
}
