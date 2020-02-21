<?php declare(strict_types=1);
namespace LORIS\candidate_profile;

/**
 * A \LORIS\candidate_profile\CandidateWidget is a type of \LORIS\GUI\Widget
 * used by the candidate dashboard.
 *
 * All CandidateWidgets consist of React components which are loaded on the fly.
 * The React component can have arbitrary props sent to it from LORIS.
 *
 * CandidateWidgets also have an optional width/height/order which position
 * it in the CSSGrid.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CandidateWidget implements \LORIS\GUI\Widget
{
    /**
     * Construct a dashboard widget with the specified properties.
     *
     * @param WidgetContent       $content The content to display in a dashboard
     *                                     panel.
     * @param WidgetDisplayProps  $props   Display related properties such as size
     *                                     and order.
     * @param ?WidgetDependencies $deps    Optional dependencies such as CSS or JS
     *                                     for this widget.
     */
    public function __construct(
        string $title,
        string $jsurl,
        string $componentname,
        array $props,
        ?int $width = null,
        ?int $height = null,
        ?int $order = null
    ) {
        $this->title = $title;
        $this->url = $jsurl;
        $this->width = $width;
        $this->height = $height;
        $this->componentname = $componentname;
        $this->props = $props;
        $this->order = $order;
    }


    /**
     * Renders the widget within a dashboard panel and implements
     * the \LORIS\GUI\Widget interface.
     *
     * @return string the HTML content of the widget to be rendered
     */
    public function __toString()
    {
        return $this->url;
    }

    public function getTitle() : string {
        return $this->title;
    }

    public function getWidth() : ?int {
        return $this->width;
    }

    public function getHeight() : ?int {
        return $this->height;
    }

    public function getOrder() : ?int {
        return $this->order;
    }
    public function getJSURL() : string {
        return $this->url;
    }

    public function getComponentName() : string {
        return $this->componentname;
    }

    public function getComponentProps() : array {
        return $this->props;
    }
}
