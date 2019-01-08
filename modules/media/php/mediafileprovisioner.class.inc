<?php
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
     * Create a MediaFileProvisioner, which gets files for the meida
     * menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT m.file_name,                                                   
                    (SELECT PSCID from candidate WHERE CandID=s.CandID) as pscid,
                    s.Visit_label as visit_label,
                    l.language_label,
               			(SELECT Full_name FROM test_names WHERE Test_name=m.instrument),
               			s.CenterID as site,
               			m.uploaded_by,
               			m.date_taken,
               			substring(m.comments, 1, 50) as comments,
               			m.date_uploaded,
               			m.file_type,
               			s.CandID as cand_id,
               			s.ID as session_id,
               			m.hide_file,
               			m.id
             FROM media m
             LEFT JOIN session s ON m.session_id = s.ID
             LEFT JOIN candidate c ON c.CandID=s.CandID
             LEFT JOIN language l USING (language_id)",
            array()
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
            $cid      = $row['site'];
            $hidefile = $row['hide_file'];
            return new MediaFile($row, $cid, $hidefile);
    }
}
