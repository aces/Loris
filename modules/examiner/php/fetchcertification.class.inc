<?php
/**
 * Examiner module: Form used to update examiner certification status
 *
 * Fetches default certification form values from the database.
 * Creates the certification history table ("Change Log").
 *
 * @return array of default form values
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 *           Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\examiner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class FetchCertification extends \NDB_Page
{
    public $skipTemplate = true;

    function _hasAccess()
    {
        $DB     = \NDB_Factory::singleton()->database();
        $config = \NDB_Config::singleton();
        $user   = \User::singleton();

        $certification = $config->getSetting('Certification');

        if ($certification['EnableCertification'] ?? false) {
            $cids      = $DB->pselect(
                "SELECT epr.centerID 
                 FROM examiners e 
                  LEFT JOIN examiners_psc_rel epr ON (e.examinerID=epr.examinerID)
                 WHERE e.examinerID=:EID",
                array('EID' => $this->identifier)
            );
            $centerIDs =array();
            foreach ($cids as $k=>$row) {
                $centerIDs[] = $row['centerID'];
            }

            // Access is only granted if user sites are a superset of examiner sites
            // considering that certification changes affect all sites
            $permitted         = $user->hasPermission('examiner_view')
                && empty(array_diff($centerIDs, $user->getData('CenterIDs')));
            $permittedAllSites
                = $user->hasPermission('examiner_multisite');
            return $permitted || $permittedAllSites;
        }
        return false; 
    }

    /**
     * This acts as an AJAX endpoint that only returns a "0" or "1" depending
     * on whether the candidate passed exists.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // The parent handles things like hasAccess checks.
        $resp = parent::handle($request);
        switch ($resp->getStatusCode()) {
        case 200:
            // If it was a 200 code, it just means display was called and
            // access validated. We still need to do other validations
            // and add the result body.
            break;
        default:
            return $resp;
        }

        // Ensure it's a GET request.
        if ($request->getMethod() != "GET") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Only GET requests are allowed"
                    )
                );
        }

        // Ensure CandID and PSCID are both passed.
        $gets = $request->getQueryParams();
        if (!isset($gets['identifier'])) {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(400)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Must provide identifier to validate"
                    )
                );
        }

        // Fetch data.
        $examinerID = $gets['identifier'];
        $results = json_encode($this->fetchData($examinerID));
        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200)
            ->withBody(new \LORIS\Http\StringStream($results));

    }

    function fetchData($identifier)
    {
        // Get examiner ID
        $examinerID = $identifier;
        $config  = \NDB_Config::singleton();
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        
        // Get the examiner name and site name, to be added to the form panel header
        $nameResult = $DB->pselectRow(
            "SELECT e.full_name
             FROM examiners e
             WHERE e.examinerID=:EID",
            array('EID' => $examinerID)
        );
        $examinerName = $nameResult['full_name'];
        // Create values array that will eventually be returned
        $values['examinerName'] = $examinerName;
        
        // Get min and max year for date field
        $values['minYear'] = $config->getSetting('startYear');
        $values['maxYear'] = $config->getSetting('endYear');
        
        // Get the list of certification instruments
        $instruments = EditExaminer::getCertificationInstruments();
        
        // For each instrument listed in Config, get certification data
        foreach($instruments as $key=>$row) {
            $cert[$key] = $DB->pselectRow(
                "SELECT pass, date_cert, comment 
                 FROM certification
                 WHERE examinerID=:EID
                 AND testID=:TID",
                array('EID' => $examinerID,
                      'TID' => $key,
                )
            );
            $cert[$key]['name'] = $row;
        }
        $values['instruments'] = $cert;
        // Get the certification history from the database
        $certification_history = $DB->pselect(
            "SELECT ch.userID, ch.changeDate, ch.old, ch.old_date,
             tn.Full_name as Measure, ch.primaryVals, ch.new, ch.new_date
             FROM certification_history ch
             LEFT JOIN test_names tn ON (ch.testID=tn.ID)
             LEFT JOIN certification c ON (c.certID=ch.primaryVals)
             WHERE c.examinerID=:EID
             ORDER BY changeDate DESC",
            array('EID' => $examinerID)
        );
        $values['certification_history'] = $certification_history;
        
        return $values;
    }
}
