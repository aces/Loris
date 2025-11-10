<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all modules
 * for the Module Manager menu page.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\document_repository;

/**
 * This class implements a data provisioner to get all modules
 * for the module manager menu page.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DocRepoProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a DocPepoProvisioner, which gets documents for the
     * document repository menu table.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     */
    function __construct(\LORIS\LorisInstance $loris)
    {
        parent::__construct(
            $loris,
            "
SELECT
    v.File_name,
    v.version,
    v.File_type,
    v.Instrument,
    v.uploaded_by,
    (SELECT name FROM psc WHERE CenterID = v.For_site) as site,
    v.comments,
    v.Date_uploaded,
    v.record_id as Edit,
    v.record_id as Delete_File,
    v.File_category as category,
    v.Data_dir,
    v.For_site
FROM
    document_repository v
WHERE
    COALESCE(v.hide_video, false) = false
ORDER BY
    v.File_name;
	    ",
            [],
        );
    }

    /**
     * Returns an instance of a HelpRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $cid = \CenterID::singleton(intval($row['For_site']));
        return new DocRepoRow($row, $cid);
    }
}
