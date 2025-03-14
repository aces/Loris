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
    private WidgetContent $_content;
    private WidgetDisplayProps $_displayprops;
    private ?WidgetDependencies $_dependencies;
    private $_template           = 'panel.tpl';
    private $_template_variables = [];

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
        WidgetContent $content,
        WidgetDisplayProps $props,
        ?WidgetDependencies $deps=null
    ) {
        $this->_content      = $content;
        $this->_displayprops = $props;
        $this->_dependencies = $deps;
    }

    /**
     * The setTemplate - change default smarty template
     *
     * @param string $template_file The template file to use.
     *
     * @return void
     */
    public function setTemplate(string $template_file)
    {
        $this->_template = $template_file;
    }

    /**
     * The setTemplateVariables - set additional smarty template variables
     *
     * @param array $template_variables The template variables to use.
     *
     * @return void
     */
    public function setTemplateVariables(array $template_variables)
    {
        $this->_template_variables = $template_variables;
    }

    /**
     * Return the size of this widget.
     *
     * @return string
     */
    public function getSize() : string
    {
        return $this->_displayprops->getSize();
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
        return $this->_displayprops->getOrder();

    }

    /**
     * Return additional CSS dependencies for this widget.
     *
     * @return string[]
     */
    public function getCSSDependencies() : array
    {
        if ($this->_dependencies !== null) {
            return $this->_dependencies->getCSSDependencies();
        }
        return [];
    }

    /**
     * Return additional JS dependencies for this widget.
     *
     * @return string[]
     */
    public function getJSDependencies() : array
    {
        if ($this->_dependencies !== null) {
            return $this->_dependencies->getJSDependencies();
        }
        return [];
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
                'title'  => $this->_content->getTitle(),
                'body'   => $this->_content->getBody(),
                'footer' => $this->_content->getFooter(),
                'menus'  => $this->_displayprops->getMenus(),
                ...$this->_template_variables,
            ]
        );
        return $renderer->fetch($this->_template);
    }
}
