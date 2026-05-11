<?php declare(strict_types=1);

/**
 * File contains the \LORIS\dashboard\DataWidget class.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Saagar Arya <saagar.arya@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
namespace LORIS\dashboard;
use \LORIS\GUI\LocalizableString;

/**
 * A DataWidget is a type of dashboard widget which contains data from
 * a database query, a label, and a link to go to when the user clicks on it.
 *
 * @category Main
 * @package  Loris
 * @author   Saagar Arya <saagar.arya@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class DataWidget implements \LORIS\GUI\Widget
{
    protected $label;
    protected $data;
    protected $cssclass;
    protected $colour;

    /**
     * Construct a DataWidget with the given properties.
     *
     * @param LocalizableString $label    The label to describe the data.
     * @param array             $data     The array data.
     * @param string            $cssclass A CSS class to add to the element.
     * @param string            $colour   The colour to use for the element.
     */
    public function __construct(
        \LORIS\GUI\LocalizableString $label,
        array $data,
        string $cssclass,
        string $colour,
    ) {
        $this->label    = $label;
        $this->data     = $data;
        $this->cssclass = $cssclass;
        $this->colour   = $colour;
    }

    /**
     * Returns the label for this task.
     *
     * @return LocalizableString
     */
    public function label() : LocalizableString
    {
        return $this->label;
    }

    /**
     * Returns the number associated with this task.
     *
     * @return array
     */
    public function data() : array
    {
        return $this->data;
    }

    /**
     * If non-empty, add this class name to the task item.
     *
     * @return string
     */
    public function CSSClass() : string
    {
        return $this->cssclass;
    }

    /**
     * Returns the colour
     *
     * @return string
     */
    public function colour() : string
    {
        return $this->colour;
    }

    /**
     * TaskWidgets get serialized to a string by the MyTasks panel.
     *
     * @return string
     */
    public function __toString()
    {
        // The dashboard module just uses the methods on this
        // to get metadata, it handles the rendering itself.
        return "";
    }
}
