<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Api\Views;

/**
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Projects
{
    protected $projects = array();

    public function __construct()
    {
        $this->projects = \Utility::getProjectList();
    }

    public function toArray(): array
    {
        $config      = \NDB_Factory::singleton()->config();
        $useEDC      = $config->getSetting("useEDC");
        $PSCID       = $config->getSetting("PSCID");
        $PSCIDFormat = \Utility::structureToPCRE($PSCID['structure'], "SITE");
        $type        = $PSCID['generation'] == 'sequential' ? 'auto' : 'prompt';

        $settings = array(
                     "useEDC" => $useEDC,
                     "PSCID"  => array(
                                  "Type"  => $type,
                                  "Regex" => $PSCIDFormat,
                                 ),
                    );

        $projects = array();
        foreach ($this->projects as $project) {
            $projects[$project] = $settings;
        }
        return array('Projects' => $projects);
    }
}
