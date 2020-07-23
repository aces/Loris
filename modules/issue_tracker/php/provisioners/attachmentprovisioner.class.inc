<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Issue Tracker
 * @package  Loris
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\issue_tracker\Provisioners;

/**
 * The AttachmentProvisioner class
 *
 * PHP version 7
 *
 * @category Issue_Tracker
 * @package  Loris
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class AttachmentProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     *
     * @param string $issueID the issue id of the attachment.
     */
    function __construct($issueID)
    {
        parent::__construct(
            "
            SELECT
                ID,
                issueID,
                file_hash,
                date_added,
                file_name,
                deleted,
                user,
                description,
                file_size,
                mime_type
            FROM
                issues_attachments
            WHERE
                issueID = :issueID
            ORDER BY
                date_added
            ",
            ['issueID' => $issueID],
            '\LORIS\issue_tracker\Models\AttachmentDTO'
        );
    }
}
