<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Issue_Tracker
 * @package  Loris
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\issue_tracker\Models;

/**
 * AttachmentDTO represents a attachment in the Issue Tracker module.
 * It is doing the mapping between the issues_attachments table columns
 * and the JSON object properties returned to the frontend.
 *
 * Additionally, it implements the DataInstance interface
 * so it can be used by a Database Provisioner.
 *
 * @category Issue_Tracker
 * @package  Loris
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class AttachmentDTO implements \LORIS\Data\DataInstance
{
    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return [
            'ID'          => $this->ID,
            'issueID'     => $this->issueID,
            'file_hash'   => $this->file_hash,
            'date_added'  => $this->date_added,
            'file_name'   => $this->file_name,
            'deleted'     => $this->deleted,
            'user'        => $this->user,
            'description' => $this->description,
            'file_size'   => $this->file_size,
            'mime_type'   => $this->mime_type,
        ];
    }
}
