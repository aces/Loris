<?php declare(strict_types=1);
/**
 * This class implements a data Instance for visit imaging qc
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api;

/**
 * A VisitImagingQcRow represents a visit imaging qc status for the
 * /candidates/$candid/$visit_label/qc/imaging endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitImagingQcRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new CandidatesRow
     *
     * @param array $row An array of candidate's properties
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        return json_encode($this->DBRow);
    }
}
