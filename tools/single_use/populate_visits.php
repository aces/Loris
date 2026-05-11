<?php declare(strict_types=1);

/**
 * This script populates the visits table based on the config.xml.
 * This should usually be run on a one time basis, and then the visits
 * table should be kept up to date manually, though the script will only
 * insert new visits, so it can be run multiple times if need be.
 *
 * The script also populates the visits_cohort_project_rel table.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__.'/../generic_includes.php';

/**
 * Class to implement logic which populates table.
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class VisitsPopulator
{
    var $DB;
    var $Config;

    /**
     * Constructor function. Instantiates references to database and
     * config class.
     *
     * @param \Database $DB The database to populate visits on
     *
     * @return VisitsPopulator
     */
    function __construct(\Database $DB)
    {
        $this->DB     = $DB;
        $this->Config = \NDB_Config::singleton();

    }

    /**
     * Checks if a Visit_label is already in the visits table and
     * if not, it inserts it.
     *
     * @param string $visit     The Visit name to insert
     * @param string $new_label The new visit_label for the front end.
     * @param int    $cohortID  The ID of the Cohort for this visit
     *
     * @return none, but as a side-effect potentially inserts into database
     */
    function insertVisitIfMissing($visit, $new_label, $cohortID)
    {
        $vid = $this->DB->pselectOne(
            "SELECT VisitID FROM visit WHERE VisitName=:VN",
            ['VN' => $visit]
        );

        if (empty($vid)) {
            print "\t->Inserting $visit --> $new_label\n";
            $x   = $this->DB->insert(
                "visit",
                ['VisitName' => $visit, 'VisitLabel'=>$new_label]
            );
            $vid = $this->DB->pselectOne(
                "SELECT VisitID FROM visit WHERE VisitName=:VN",
                ['VN' => $visit]
            );
        }

        if (!empty($cohortID)) {
            $this->insertRelIfMissing($vid, $cohortID);
        }
    }

    /**
     * Checks if a visit is already associated with a project-cohort tuple.
     * If not, it inserts it into the relational table
     *
     * @param string $vid The Visit ID to insert
     * @param string $sid The cohort ID the visit is associated to
     *
     * @return none, but as a side-effect potentially inserts into database
     */
    function insertRelIfMissing($vid, $sid)
    {
        // Get all ProjectCohortRelIDs associated with the concerned cohort
        $psrids = $this->DB->pselectCol(
            "SELECT ProjectCohortRelID
		FROM project_cohort_rel
		WHERE CohortID=:sid",
            ['sid' => $sid],
            "ProjectCohortRelID"
        );
        // For Every ProjectCohortRelID check if it already exists
        // if not, insert it
        foreach ($psrids as $psrid) {
            $verify = $this->DB->pselectOne(
                "SELECT 'x'
		    FROM visit_project_cohort_rel
		    WHERE VisitID=:vid AND ProjectCohortRelID=:psrid",
                ['vid' => $vid, 'psrid' => $psrid]
            );
            if (empty($verify)) {
                print "\t\t->Inserting Visit: $vid for Cohort: $sid".
                " and ProjectCohortRel: $psrid\n";
                $x = $this->DB->insert(
                    "visit_project_cohort_rel",
                    ['VisitID' => $vid, 'ProjectCohortRelID'=>$psrid]
                );
            }
        }
    }

    /**
     * Runs the logic of the script.
     *
     * @return none
     */
    function run()
    {
        // populate from config tables for preset visits
        // Can't use Utility::getVisits() because that uses the session table..
        print "Populating from Config.xml\n";
        $vls = $this->Config->getSetting("visitLabel");
        foreach ($vls as $cohort) {
            $sid = $cohort['@']['cohortID'];
            foreach ($cohort['labelSet']['item'] as $item) {
                $visit = $item['@']['value'];
                $label = $item['#'];
                if (!empty($visit)) {
                    $this->insertVisitIfMissing($visit, $label, $sid);
                }
            }
        }
        print "Populating from SESSION table\n";
        // populate from session table for custom visit labels
        $query         ="SELECT DISTINCT Visit_label, CohortID FROM session";
        $sessionLabels = $this->DB->pselect($query, []);
        foreach ($sessionLabels as $k=>$row) {
            $visit =$row['Visit_label'];
            $label =$row['Visit_label'];
            $sid   =$row['CohortID'];
            $this->insertVisitIfMissing($visit, $label, $sid);
        }
        print "Populating from VISIT_WINDOWS table\n";
        //populate from Visit_Windows in case of discrepencies
        $query ="SELECT DISTINCT Visit_label FROM Visit_Windows";
        $Visit_Windows_Labels = $this->DB->pselect($query, []);
        foreach ($Visit_Windows_Labels as $k=>$row) {
            $visit =$row['Visit_label'];
            $label =$row['Visit_label'];
            $this->insertVisitIfMissing($visit, $label, null);
        }
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new VisitsPopulator($lorisInstance->getDatabaseConnection());
    $Runner->run();
}

