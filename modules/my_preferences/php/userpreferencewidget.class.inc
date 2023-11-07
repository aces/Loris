<?php declare(strict_types=1);
namespace LORIS\my_preferences;

/**
 * A \LORIS\candidate_profile\UserPreferenceWidget is a type of \LORIS\GUI\Widget
 * used by the my preference page to register extra preference types.
 *
 * All UserPreferenceWidgets consist of React components which are loaded on the fly.
 * The React component can have arbitrary props sent to it from LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserPreferenceWidget implements \LORIS\GUI\Widget
{
    /**
     * Construct a dashboard widget with the specified properties.
     *
     * @param string $title         The title of the card to display.
     * @param string $jsurl         The URL containing the React component.
     * @param string $componentname The React component name for this widget.
     * @param array  $props         Additional React props to pass to the React
     *                              component.
     * @param ?int   $width         The width in the CSS grid.
     * @param ?int   $height        The height in the CSS grid.
     * @param ?int   $order         The order in the CSS grid.
     */
    public function __construct(
        public string $title,
        public string $jsurl,
        public string $componentname,
        public array $props,
    ) { }

    /**
     * Renders the widget within a preference panel and implements
     * the \LORIS\GUI\Widget interface.
     *
     * @return string the HTML content of the widget to be rendered
     */
    public function __toString()
    {
        return $this->jsurl;
    }
}
