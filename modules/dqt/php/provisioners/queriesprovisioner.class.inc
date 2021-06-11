<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\dqt\Provisioners;

use \LORIS\Data\Provisioners\DBObjectProvisioner;

/**
 * Data provisioner for a Category visit
 *
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class QueriesProvisioner extends DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    public function __construct()
    {
        parent::__construct(
            'SELECT
               q.id as _id,
               u.UserID as _creator_username,
               q.creation_timestamp as _creation_timestamp,
               q.content as _content,
               saved.name as _name,
               shared.shared_id as _shared_id
             FROM
               dqt_queries q
             LEFT JOIN 
               dqt_shared_queries shared
               ON (q.id = shared.shared_id)
             LEFT JOIN
               dqt_saved_queries saved
               ON (q.id = saved.saved_id)
             LEFT JOIN users u
               ON (u.ID = q.creator)
            ',
            [],
            '\LORIS\dqt\Models\DataInstances\QueryItem'
        );
    }
}
