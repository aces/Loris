<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Genomics
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\genomic_browser\provisioners;

/**
 * The FilesProvisioner class.
 *
 * PHP version 7
 *
 * @category Genomics
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class FilesProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            "
            SELECT
                GenomicFileID AS _GenomicFileID,
                FileName AS _File_Name,
                Description AS _Description,
                FileType AS _FileType,
                Date_inserted AS _Date_inserted,
                InsertedByUserID AS _InsertedByUserID,
                Caveat AS _Caveat,
                Notes AS _Notes
            FROM
                genomic_files
            ",
            [],
            '\LORIS\genomic_browser\Models\FilesDTO'
        );
    }
}
