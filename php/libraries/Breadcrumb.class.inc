<?php declare(strict_types=1);
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
 * A Breadcrumb consists of a label and an hyperlink.
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
     * The label to display to the frontend user
     *
     * @var string
     */
    protected $label;

    /**
     * The hyperlink for this breadcrumb
     *
     * @var string
     */
    protected $link;

    /**
     * The contructor
     *
     * @param string $label The label to display
     * @param string $link  The hyperlink for that breadcrumb
     */
    public function __construct(string $label = '', string $link = '')
    {
        $this->label = $label;
        $this->link  = $link;
    }

    /**
     * Returns a string representation of this object by using json
     * serialization of its attributes in a object with a text and a query
     * properties.
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

