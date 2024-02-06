<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser\Models;

/**
 * This object contains the methods to get
 * Electrophysiology events from the DB
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ElectrophysioEvents
{
    private int $_physioFileID;
    private array $_data;

    /**
     * Construct an Event object
     *
     * @param integer $physioFileID Electrophysiological file ID
     *                              to collect annotation data from
     */
    function __construct(int $physioFileID)
    {
        $this->_physioFileID = $physioFileID;
        $db = \NDB_Factory::singleton()->database();

        $taskEvents = $db->pselect(
            'SELECT te.* 
                FROM physiological_task_event AS te
                JOIN physiological_event_file AS f
                ON f.EventFileID = te.EventFileID 
                WHERE f.PhysiologicalFileID=:PFID AND f.FileType="tsv"',
            ['PFID' => $this->_physioFileID]
        );

        /**
         * TODO: Get event params and metadata.
         *       NOT in the scope of current task
         **/

        $this->_data = [
            'instances' => $taskEvents,
        ];
    }

    /**
     * Get data for the Electrophysiological file annotations
     *
     * @return array The data array
     */
    function getData(): array
    {
        return $this->_data;
    }

    /**
     * TODO: Add other features such as add, update, delete
     *       NOT in the scope of current task
     **/
}
