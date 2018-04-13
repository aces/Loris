<?php
/**
 * This file defines a Breadcrumb element.
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
 * A Breadcrumb consist of a label and an hyperlink.
 *
 * PHP Version 7
 *
 * @category Breadcrumbs
 * @package  User_Interface
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Breadcrumb
{
    /**
     * The label to display
     *
     * @var string
     */
    protected $label;

    /**
     * The hyperlink for that breadcrumb
     *
     * @var string
     */
    protected $link;

    /**
     * The contructor
     *
     * @param string $label The label to display
     * @param string $link  The hyperlink for that breadcrumb
     *
     * @return Breadcrumb
     */
    public function __construct(string $label = '', string $link = '')
    {
        $this->label = $label;
        $this->link  = $link;
    }

    /**
     * Returns a string representation of that object.
     *
     * @return string The string
     */
    public function __toString() : string
    {
        return json_encode(
            array(
             'text'  => $this->label,
             'query' => $this->link,
            ),
            JSON_FORCE_OBJECT
        );
    }
}

