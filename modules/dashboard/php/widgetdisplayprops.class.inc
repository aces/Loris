<?php declare(strict_types=1);
/**
 * File contains the \LORIS\dashboard\WidgetDisplayProps class.
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
 * A WidgetDisplayProps is a value object which contains the display
 * related properties for a dashboard widget.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class WidgetDisplayProps
{
    /**
     * Construct a WidgetDisplay object with the specified properties.
     *
     * @param string $size  The size of the widget, which affects if it goes
     *                      on the left or right side of the grid.
     * @param int    $order The relative ordering of the widget. Lower order
     *                      number goes before higher.
     * @param array  $menus A list of menu items to add as a dropdown to the
     *                      widget title bar. This only adds the menu to the
     *                      GUI, it's the widget's responsibility to react
     *                      to interactions with it.
     */
    public function __construct(
        string $size = "normal",
        int $order = 10,
        array $menus = []
    ) {
        if (!in_array($size, ["small", "normal"])) {
            throw new \DomainException("Invalid value for widget size");
        }

        $this->size  = $size;
        $this->order = $order;
        $this->menus = $menus;
    }

    /**
     * Get the size of the widget. It should be either "small" (takes up
     * approximately 1/3 of the width of the dashboard and appears on the
     * right) or "normal" (takes up 2/3 of the width of the dashboard and
     * appears on the left.)
     *
     * @return string
     */
    public function getSize() : string
    {
        return $this->size;
    }

    /**
     * Gets the relative ordering of the widget. Widgets with a lower
     * order number appear before widgets with a higher order number
     * in their respective columns. Ordering within lists of different
     * widgets which declare the same order is undefined.
     *
     * @return int
     */
    public function getOrder() : int
    {
        return $this->order;
    }

    /**
     * Return a list of "menus" for the widget. Menus are dropdowns
     * that appear in the title of the widget on the right. The widget
     * itself must define interactions when the menu is interacted with.
     *
     * Return is an associative array where the key is used as the HTML
     * id of the menu item, and the value is the label to display for it.
     *
     * @return array
     */
    public function getMenus() : array
    {
        return $this->menus;
    }
}
