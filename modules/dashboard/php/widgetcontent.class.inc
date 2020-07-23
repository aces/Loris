<?php declare(strict_types=1);
/**
 * File contains the \LORIS\dashboard\WidgetContent class.
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
 * A WidgetContent is an object which contains the content of
 * properties for a dashboard panel.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class WidgetContent
{
    /**
     * Construct a WidgetContent with the specified properties.
     *
     * @param string $title  The title of the widget
     * @param string $body   The content for the body of the widget
     * @param string $footer The content of the footer of the dashboard panel.
     */
    public function __construct(
        string $title,
        string $body,
        string $footer=""
    ) {
        $this->title  = $title;
        $this->body   = $body;
        $this->footer = $footer;
    }
    /**
     * Return the content for the title of the widget.
     *
     * @return string
     */
    public function getTitle() : string
    {
        return $this->title;
    }

    /**
     * Return the content for the body of the widget.
     *
     * @return string
     */
    public function getBody() : string
    {
        return $this->body;
    }
    /**
     * Return the content for the title of the widget.
     *
     * @return string
     */
    public function getFooter() : string
    {
        return $this->footer;
    }
}
