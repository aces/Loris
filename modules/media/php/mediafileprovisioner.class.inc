<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\media;

/**
 * This class implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class MediaFileProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Cache of instrument->getFullname returned value.
     * Initializing empty keys to prevent instanciation of empty testnames.
     */
    private $_instrumentnames = [];

    /**
     * Create a MediaFileProvisioner, which gets files for the meida
     * menu table.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance that the module
     *                                    is serving.
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct(
            "SELECT m.file_name as fileName,
                    m.instrument as testName,
                    c.PSCID as pscid,
                    s.Visit_label as visitLabel,
                    l.language_label as languageLabel,
                    (SELECT Full_name FROM test_names
                      WHERE Test_name=m.instrument) as fullName,
               		s.CenterID as centerId,
               		s.ProjectID as projectId,
               		m.uploaded_by as uploadedBy,
               		m.date_taken as dateTaken,
               		substring(m.comments, 1, 50) as comments,
                    m.last_modified as lastModified,
               		m.file_type as fileType,
               		s.CandID as candidateId,
               		s.ID as sessionId,
                    CASE
                        WHEN m.hide_file = 0 THEN 'visible'
                        WHEN m.hide_file = 1 THEN 'hidden'
                    END AS hideFile,
               		m.id
             FROM media m
             INNER JOIN session s ON m.session_id = s.ID
             INNER JOIN candidate c ON c.CandID=s.CandID
             LEFT JOIN language l USING (language_id)
             WHERE s.Active='Y' and c.Active='Y'",
            []
        );
    }

    /**
     * Returns an instance of a MediaFile object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $testname = $row['testName'] ?? '';
        unset($row['testName']);

        // make sure not to call the factory when $testname is null or ''
        if (!empty($testname) && !isset($this->_instrumentnames[$testname])) {
            try {
                $this->_instrumentnames[$testname] = \NDB_BVL_Instrument::factory(
                    $this->loris,
                    $testname,
                )->getFullname();
            } catch (\Exception $e) {
                error_log(
                    "There was a problem instantiating the instrument ".
                    "'$testname'. Make sure the instrument is valid and ".
                    "functional in order for it to be displayed in the media ".
                    "module."
                );
            }
        }
        $row['fullName'] = $this->_instrumentnames[$testname] ?? null;

        return new MediaFile($row);
    }
}
