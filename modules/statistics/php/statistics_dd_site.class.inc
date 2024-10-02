<?php
/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\statistics;

/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Statistics_DD_Site extends statistics_site
{

    var $query_criteria = '';
    var $query_vars     = [];

    /**
     * Notexcluded function
     *
     * @param string $var the value of var
     *
     * @return bool
     */
    function notexcluded($var)
    {
        $config            =& \NDB_Config::singleton();
        $excluded_measures = $config->getSetting('excludedMeasures');

        return !in_array($var, $excluded_measures);
    }

    /**
     * Construct function
     *
     * @return void
     */
    function _setInstrumentName()
    {
        $this->instruments = \Utility::getAllInstruments();
        foreach (array_keys($this->instruments) as $k) {
            $this->instruments[$k] = $k;
        }

        $this->instruments = array_filter(
            $this->instruments,
            [
                &$this,
                'notexcluded',
            ]
        );
    }

    /**
     * CompleteCount function
     *
     * @param ?\CenterID  $centerID   the value of centerID
     * @param ?\ProjectID $projectID  the value of projectID
     * @param string      $instrument the value of instrument
     *
     * @return ?string
     */
    function _completeCount(
        ?\CenterID $centerID,
        ?\ProjectID $projectID,
        string $instrument
    ): ?string {
        $this->_checkCriteria($centerID, $projectID);
        $DB = $this->loris->getDatabaseConnection();

        $safe_instrument = $DB->escape($instrument);

        return $DB->pselectOne(
            "SELECT count(s.CandID)  FROM session s, candidate c,
                flag f, $safe_instrument i
             WHERE
                s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.CenterID <> '1'
                AND s.Current_stage <> 'Recycling Bin'
                $this->query_criteria
                AND f.Data_entry='Complete' AND f.Administration='All' 
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID",
            $this->query_vars
        );
    }
    /**
     * GetResults function
     *
     * @param ?\CenterID  $centerID   the value of centerID
     * @param ?\ProjectID $projectID  the value of projectID
     * @param string      $instrument the value of instrument
     *
     * @return array
     */
    function _getResults(
        ?\CenterID $centerID,
        ?\ProjectID $projectID,
        $instrument
    ) {
        $this->_checkCriteria($centerID, $projectID);
        $DB = $this->loris->getDatabaseConnection();
        $safe_instrument = $DB->escape($instrument);
        $result          = $DB->pselect(
            "SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID,
                lower(s.Visit_label) as Visit_label 
                FROM session s, candidate c, flag f, $safe_instrument i
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID AND 
                s.CandID=c.CandID  AND s.Active='Y' 
                AND s.CenterID <> '1'
                $this->query_criteria
                AND s.Current_stage <> 'Recycling Bin'
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete')
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID",
            $this->query_vars
        );
        return iterator_to_array($result);
    }
}

