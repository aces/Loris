<?php declare(strict_types=1);

/**
 * This class implements a data provisioner to get all possible rows
 * for the REDCap menu page.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

/**
 * This class implements a data provisioner to get all possible rows
 * for the REDCap menu page.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class REDCapProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a REDCapProvisioner.
     *
     * @param \LORIS\LorisInstance $loris the loris instance
     */
    public function __construct(\LORIS\LorisInstance $loris)
    {
        // note: that this needs to be in the same order as the headers array
        parent::__construct(
            $loris,
            "SELECT
                id as notificationID,
                complete,
                record as recordID,
                redcap_event_name as eventName,
                instrument,
                redcap_url as redcapURL,
                project_id as projectID,
                received_dt,
                handled_dt
            FROM redcap_notification
            ORDER BY received_dt DESC
            LIMIT 10000
            ",
            []
        );
    }

    /**
     * Returns an instance of an REDCap notification object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new RedcapRow($row);
    }
}
