<?php declare(strict_types=1);
/**
 * File contains the \LORIS\dashboard\WidgetDependencies class.
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
 * A WidgetDependencies is an object which contains the external
 * dependency related properties for a dashboard widget to render
 * properly.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class WidgetDependencies
{
    /**
     * Construct a WidgetDependencies object with the specified properties.
     *
     * @param array $css An array of CSS requirements that must be loaded for
     *                   the widget
     * @param array $js  An array of JS requirements that must be loaded for
     *                   the widget
     */
    public function __construct(
        array $css,
        array $js
    ) {
        $this->css = $css;
        $this->js  = $js;
    }

    /**
     * Return a list of javascript dependencies URLs which are required for the
     * widget to load.
     *
     * @return string[]
     */
    public function getJSDependencies() : array
    {
        return $this->js;
    }

    /**
     * Return a list of CSS dependencies which are required for the
     * widget to display correctly.
     *
     * @return string[]
     */
    public function getCSSDependencies() : array
    {
        return $this->css;
    }
}
