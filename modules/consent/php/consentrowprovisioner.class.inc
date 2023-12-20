<?php
/**
 * This file implements a data provisioner to get all possible rows
 * for the consent menu page.
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\consent;

/**
 * This class implements a data provisioner to get all possible rows
 * for the consent menu page.
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ConsentRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ConsentRowProvisioner, which gets rows for the consent
     * menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT ca.PSCID AS PSCID,
	            ca.CandID AS CandID,
	            cg.Label AS Consent_group,
	            c.Label AS Consent_code,
	            COALESCE(REPLACE(dc.Request_status,'_',' '), 'NA') AS Request_status,
	            REPLACE(ccr.Status,'_',' ') AS Consent_status,
	            ccr.DateGiven,
	            ccr.DateWithdrawn,
	            dc.Date_sent,
	            'Action',
	            cg.Name AS consent_group_name,
	            COALESCE(dc.OneTimeKey, 'NA') AS OneTimeKey,
	            c.ConsentID AS consentID,
	            ca.RegistrationCenterID,
	            ca.RegistrationProjectID
			FROM candidate_consent_rel ccr 
	            JOIN consent c ON ccr.ConsentID=c.ConsentID 
	            JOIN consent_group cg ON c.ConsentGroupID=cg.ConsentGroupID
	            JOIN candidate ca ON ccr.CandidateID=ca.CandID
	            LEFT JOIN direct_consent dc ON dc.ConsentGroupID=c.ConsentGroupID
            WHERE (dc.CandidateID=ccr.CandidateID OR dc.CandidateID IS NULL)
            	AND ca.Active='Y'
            ORDER BY ca.PSCID, cg.Label, c.Label",
            []
        );
    }

    /**
     * Returns an instance of a ConsentRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new ConsentRow($row);
    }
}