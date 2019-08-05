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

namespace LORIS\Api\Views\Project;

use \LORIS\api\ProjectInstrumentsRow;
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
     */
    public function __construct(\Project $project, array $instruments)
    {
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
        $meta = array('Project' => $this->_project->getName());

        $instruments = array();

        foreach ($this->_instruments as $instrument) {
            $shortname = $instrument['shortname'];
            $item      = array(
                          'Fullname'               => $instrument['fullname'],
                          'Subgroup'               => $instrument['subgroup'],
                          'DoubleDataEntryEnabled' => $instrument['ddeenable'],
                         );
            $instruments[$shortname] = $item;
        }

        return array(
                'Meta'        => $meta,
                'Instruments' => $instruments,
               );
    }
}
