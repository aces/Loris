<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Models;

/**
 * A ProjectElectrophysiologyRow contains values from a recording of a project.
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class ProjectElectrophysiologyRow implements \LORIS\Data\DataInstance
{
    private $_candid;
    private $_pscid;
    private $_entitytype;
    private $_visitlabel;
    private $_visitdate;
    private $_centerid;
    private $_centername;
    private $_filename;
    private $_inserttime;

    /**
     * Create a new ProjectElectrophysiologyRow
     *
     * @param array $row An array of image properties
     */
    public function __construct(array $row)
    {
        $this->_candid     = $row['Candidate'] ?? null;
        $this->_pscid      = $row['PSCID'] ?? null;
        $this->_entitytype = $row['Entity_type'] ?? null;
        $this->_visitlabel = $row['Visit'] ?? null;
        $this->_visitdate  = $row['Visit_date'] ?? null;
        $this->_centerid   = $row['CenterID'] ?? null;
        $this->_centername = $row['Site'] ?? null;
        $this->_filename   = $row['File'] ?? null;
        $this->_inserttime = $row['InsertTime'] ?? null;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        $obj = array(
            'Candidate'  => $this->_candid,
            'PSCID'      => $this->_pscid,
            'Visit'      => $this->_visitlabel,
            'Visit_date' => $this->_visitdate,
            'Site'       => $this->_centername,
            'File'       => $this->_filename,
            'InsertTime' => $this->_inserttime,
        );

        $filename = basename($obj['File']);
        $candid   = $obj['Candidate'];
        $visit    = $obj['Visit'];

        $obj['Link']       = "/candidates/$candid/$visit/electrophysiology/$filename";
        $obj['InsertTime'] = date('c', (int) $obj['InsertTime']);

        return json_encode($obj);
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return intval($this->_centerid);
    }
}