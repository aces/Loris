<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

use \LORIS\server_processes_manager\ServerProcessesMonitor;

/**
 * This is the controler class for an MRIUpload
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class MRIUpload
{
    private $_mriuploadid;

    /**
     * Constructor
     *
     * @param int $mriuploadid The UploadID
     */
    public function __construct(int $mriuploadid)
    {
        $this->_mriuploadid = $mriuploadid;
    }

    /**
     * Accessor for mriuploadid
     *
     * @return int
     */
    public function getUploadID(): int
    {
        return $this->_mriuploadid;
    }

    /**
     * Produces a list of server_processes data related to that mri_upload
     *
     * @return array A list of processes state
     */
    public function getProcesses(): array
    {
        $rows = \NDB_Factory::singleton()->database()->pselectCol(
            'SELECT
               id
             FROM
               server_processes sp
             JOIN
               mri_upload_server_processes_rel muspr
               ON (sp.id = muspr.process_id)
             WHERE
               muspr.mri_upload_id = :v_mri_upload_id
            ',
            array('v_mri_upload_id' => $this->_mriuploadid)
        );

        if (empty($rows)) {
            return [];
        }
        // Instantiate the server process module to autoload
        // its namespace classes
        \Module::factory('server_processes_manager');
        $serverProcessesMonitor = new ServerProcessesMonitor();
        return $serverProcessesMonitor->getProcessesState(
            $rows,
            null,
            null
        );
    }
}
