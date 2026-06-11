<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views\Project;

use \LORIS\api\Models\ProjectInstrumentsRow;
/**
 * Creates a representation of a project instrument following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Instruments
{
    /**
     * The project
     *
     * @var \Project
     */
    private $_project;

    /**
     * The project instruments datainstance.
     *
     * @var ProjectInstrumentsRow[]
     */
    private $_instruments;

    /**
     * Contructor that initialize this instance variables
     *
     * @param \Project                $project     The requested project
     * @param ProjectInstrumentsRow[] $instruments An array of ProjectInstrumentsRow
     * @param string                  $apiversion  The version of the API being used
     */
    public function __construct(
        \Project $project,
        array $instruments,
        private string $apiversion = 'v0.0.3'
    ) {
        $this->_project     = $project;
        $this->_instruments = $instruments;
    }

    /**
     * Returns this view as an array
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = ['Project' => $this->_project->getName()];

        $instruments = [];

        foreach ($this->_instruments as $instrument) {
            $shortname = $instrument->getShortname();
            $item      = [
                'Fullname'               => $instrument->getFullname(),
                'Subgroup'               => $instrument->getSubgroupname(),
                'DoubleDataEntryEnabled' => $instrument->isDDE(),
            ];
            if ($this->apiversion != 'v0.0.3') {
                // >= v0.0.4
                $item['DoubleDataEntryVisits'] = $instrument->getddeVisits();
            }

            if (!is_null($shortname)) {
                $instruments[$shortname] = $item;
            }
        }

        return [
            'Meta'        => $meta,
            'Instruments' => $instruments,
        ];
    }
}
