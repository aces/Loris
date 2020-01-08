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
     */
    public function __construct(
        string $size = "normal",
        int $order = 10,
        array $menus = []
    ) {
        if (!in_array($size, ["small", "normal"])) {
            throw new \DomainException("Invalid value for widget size");
        }

        $this->size = $size;
        $this->order = $order;
        $this->menus = $menus;
    }

    public function getSize() : string {
        return $this->size;
    }

    public function getOrder() : int {
        return $this->order;
    }

    public function getMenus() : array {
        return $this->menus;
    }
}
