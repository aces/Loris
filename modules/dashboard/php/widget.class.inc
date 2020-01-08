<?php declare(strict_types=1);
/**
 * File contains the \LORIS\dashboard\Widget class.
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
 * A \LORIS\dashboard\Widget is a type of \LORIS\GUI\Widget which has some additional
 * properties to make it more consistent across widgets that appear on the dashboard.
 *
 * Dashboard Widgets have a size ("small" things going on the right column, and
 * "normal" on the main dashboard area.), a relative ordering (ordering is
 * unspecified within widgets that have the same order), a title, footer, and may
 * optionally register extra CSS or JS to be loaded for the widget to function
 * correctly.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class Widget implements \LORIS\GUI\Widget
{
    /**
     * Construct a dashboard widget with the specified properties.
     *
     * @param string $title    The title of the widget
     * @param string $body     The content for the body of the widget
     * @param string $size     The approximate size of the widget. Either
     *                         "small" or "normal".
     * @param int    $order    The ordering priority of this widget relative
     *                         to other widgets on the dashboard.
     * @param string $footer   The content of the footer of the dashboard panel.
     * @param array  $extracss CSS requirements for this widget
     * @param array  $extrajs  JS requirements for this widget
     * @param array  $menus    Menus to display in the header of this widget.
     */
    public function __construct(
        WidgetContent $content,
        string $size,
        int $order=10,
        array $extracss = [],
        array $extrajs = [],
        array $menus = []
    ) {
        if (!in_array($size, ["small", "normal", "huge"])) {
            throw new \DomainException("Invalid value for size");
        }
        $this->content = $content;
        $this->size   = $size;
        $this->order  = $order;
        $this->css    = $extracss;
        $this->js     = $extrajs;
        $this->menus  = $menus;
    }

    /**
     * Return the size of this widget.
     *
     * @return string
     */
    public function getSize() : string
    {
        return $this->size;
    }

    /**
     * Return the relative ordering of this widget.
     *
     * A default widget is in order "10". Lower will
     * appear before on the dashboard, and higher after.
     *
     * @return int
     */
    public function getOrder() : int
    {
        return $this->order;

    }

    /**
     * Return additional CSS dependencies for this widget.
     *
     * @return string[]
     */
    public function getCSSDependencies() : array
    {
        return $this->css;
    }

    /**
     * Return additional JS dependencies for this widget.
     *
     * @return string[]
     */
    public function getJSDependencies() : array
    {
        return $this->js;
    }

    /**
     * Renders the widget within a dashboard panel and implements
     * the \LORIS\GUI\Widget interface.
     *
     * @return string the HTML content of the widget to be rendered
     */
    public function __toString()
    {
        $renderer = new \Smarty_NeuroDB("dashboard");
        $renderer->assign(
            [
                'title'  => $this->content->getTitle(),
                'body'   => $this->content->getBody(),
                'footer' => $this->content->getFooter(),
                'menus'  => $this->menus
            ]
        );
        return $renderer->fetch("panel.tpl");
    }
}
