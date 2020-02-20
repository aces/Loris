<?php declare(strict_types=1);
namespace LORIS\candidate_profile;

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
