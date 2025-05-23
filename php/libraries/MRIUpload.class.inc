<?php declare(strict_types=1);

/**
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

use \LORIS\server_processes_manager\ServerProcessesMonitor;

/**
 * This is the controler class for an MRIUpload
 *
 * @category Imaging
 * @package  Main
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class MRIUpload
{
    private \LORIS\LorisInstance $loris;
    private $_mriuploadid;

    /**
     * Constructor
     *
     * @param \LORIS\LorisInstance $loris       The LORIS instance
     * @param int                  $mriuploadid The UploadID
     */
    public function __construct(\LORIS\LorisInstance $loris, int $mriuploadid)
    {
        $this->loris        = $loris;
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
        $rows = $this->loris->getDatabaseConnection()->pselectCol(
            'SELECT
               id
             FROM
               server_processes sp
             JOIN
               mri_upload_server_processes_rel muspr
               ON (sp.id = muspr.ProcessID)
             WHERE
               muspr.UploadID = :UploadID
            ',
            ['UploadID' => $this->_mriuploadid]
        );

        if (empty($rows)) {
            return [];
        }

        $serverProcessesMonitor = new ServerProcessesMonitor();
        return $serverProcessesMonitor->getProcessesState(
            $rows,
            null,
            null
        );
    }
}
