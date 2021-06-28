<?php
/**
 * File contains the \LORIS\dashboard\TaskWidget class.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
namespace LORIS\dashboard;

/**
 * A TaskWidget is a type of dashboard widget which displays a task in
 * the "My Tasks" widget on the dashboard. It contains a number, a link,
 * and a label describing what the task is.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class TaskWidget implements \LORIS\GUI\Widget
{
    protected $label;
    protected $number;
    protected $link;
    protected $cssclass;

    /**
     * The site label to display beside the widget for which site
     * this task is for.
     *
     * @var string
     */
    protected $sitelabel;

    /**
     * Construct a TaskWidget with the given properties.
     *
     * @param string $label     The label to describe the task.
     * @param int    $number    The number of outstanding items for the task.
     * @param string $link      A URL to go to when the user clicks on the task.
     * @param string $cssclass  A CSS class to add to the element. This is primarily
     *                          used for testing.
     * @param string $siteLabel Site label to display besides the widget.
     */
    public function __construct(
        string $label,
        int $number,
        string $link,
        string $cssclass,
        string $siteLabel=''
    ) {
        $this->label     = $label;
        $this->number    = $number;
        $this->link      = $link;
        $this->cssclass  = $cssclass;
        $this->sitelabel = $siteLabel;
    }

    /**
     * Returns the label for this task.
     *
     * @return string
     */
    public function label() : string
    {
        return $this->label;
    }

    /**
     * Returns the number associated with this task.
     *
     * @return int
     */
    public function number() : int
    {
        return $this->number;
    }

    /**
     * Returns the URL to link the task to.
     *
     * @return string
     */
    public function link() : string
    {
        return $this->link;
    }

    /**
     * If non-empty, return a label to use to describe
     * which sites the number of open task issues is for.
     *
     * @return string
     */
    public function siteLabel() : string
    {
        return $this->sitelabel;
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
