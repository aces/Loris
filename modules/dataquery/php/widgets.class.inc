<?php declare(strict_types=1);

namespace LORIS\dataquery;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles requests to queries under the /widgets endpoint of
 * the dataquery module to return a list of widgets requested
 * by other modules.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Widgets extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Access permissions checked by Module class. Return true
     * if we got to this point.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");

        $widgets = [];

        foreach ($this->loris->getActiveModules() as $module) {
            if (!$module->hasAccess($user)) {
                continue;
            }

            $mwidgets = $module->getWidgets(
                'dataquery:action',
                $user,
                [],
            );
            foreach ($mwidgets as $widget) {
                assert($widget instanceof ActionWidget);
                $widgets[] = [
                    "label"    => $widget->label,
                    "tab"      => $widget->tab,
                    "callback" => $widget->jscallback,
                ];
            }
        }

        return new \LORIS\Http\Response\JSON\OK($widgets);
    }
}
