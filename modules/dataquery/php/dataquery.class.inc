<?php declare(strict_types=1);

/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Loris
 * @subpackage DQT
 * @author     Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\dataquery;
use \Psr\Http\Message\ServerRequestInterface;

/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Loris
 * @subpackage DQT
 * @author     Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Dataquery extends \NDB_Page
{
    public $skipTemplate = true;
    private \User $user;

    /**
     * Check user access permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * {@inheritDoc}
     *
     * @param \User                  $user    - The user loading the page
     * @param ServerRequestInterface $request - The page to load resources for
     *
     * @return void
     */
    public function loadResources(
        \User $user,
        ServerRequestInterface $request,
    ) : void {
        $this->user = $user;
    }
    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $widgetsJS = [];

        foreach ($this->loris->getActiveModules() as $module) {
            if (!$module->hasAccess($this->user)) {
                continue;
            }

            $widgets = $module->getWidgets(
                'dataquery:action',
                $this->user,
                [],
            );
            foreach ($widgets as $widget) {
                assert($widget instanceof ActionWidget);
                // de-duplicate widgets from the same javascript source
                $widgetsJS[$widget->jsurl] = 1;
            }
        }
        $widgetsJS = array_keys($widgetsJS);

        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            $widgetsJS,
            [
                $baseURL . "/dataquery/js/index.js",
            ]
        );
    }
}
