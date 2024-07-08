<?php
/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Jessica Callegaro <jessica.callegaro@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\configuration;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Admin_Config Class
 *
 * This class is to configure the system settings
 *
 * @category Behavioural
 * @package  Main
 * @author   Jessica Callegaro <jessica.callegaro@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class Diagnosis extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * This function will return a json object for diagnosis evolution.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET();
        case 'POST':
            return $this->_handlePOST($request);
        case 'DELETE':
            return $this->_handleDELETE($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }

    }

    /**
     * Initialize setup of the login module.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET() : ResponseInterface
    {
        $response = $this->initializeSetup();
        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }

    /**
     * Loads the project page.
     *
     * @return array
     */
    function initializeSetup() : array
    {
        $DB = $this->loris->getDatabaseConnection();

        $projects    = \Utility::getProjectList();
        $visits      = \Utility::getVisitList();
        $instruments = \NDB_BVL_Instrument::getInstrumentNamesList($this->loris);

        $parameterType = $DB->pselectCol(
            "SELECT DISTINCT SourceField FROM parameter_type
            WHERE Queryable='1'
            ORDER BY SourceField",
            []
        );

        $sourceFields = array_combine($parameterType, $parameterType);

        $diagnosisTracks = $DB->pselectWithIndexKey(
            "SELECT * FROM diagnosis_evolution
            ORDER BY orderNumber",
            [],
            'DxEvolutionID'
        );

        foreach ($diagnosisTracks as $key => $data) {
            $diagnosisTracks[$key]['sourceField']
                = explode(",", $diagnosisTracks[$key]['sourceField']);
        }

        $values['projects']        = $projects;
        $values['visits']          = $visits;
        $values['instruments']     = $instruments;
        $values['sourceFields']    = $sourceFields;
        $values['diagnosisTracks'] = $diagnosisTracks;

        return $values;
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request)
        : ResponseInterface
    {
        $DB     = \NDB_Factory::singleton()->database();
        $values = $request->getParsedBody();

        $dxEvolutionID  = $values['DxEvolutionID'] ?? null;
        $name           = $values['Name'] ?? null;
        $projectID      = $values['ProjectID'] ?? null;
        $visit          = $values['visitLabel'] ?? null;
        $instrumentName = $values['instrumentName'] ?? null;
        $sourceFields   = isset($values['sourceField'])
            && $values['sourceField'] != 'null' ?
            explode(',', $values['sourceField']) : [];
        $orderNumber    = $values['orderNumber'] ?? null;

        /**
        * VALIDATE THE FORM
        */
        // Validation: Form is complete
        if (!($dxEvolutionID && $name && $visit
            && $instrumentName && $sourceFields && $orderNumber)
        ) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Please fill out all fields!'
            );
        }

        // Validation: Visit is part of Project's config
        $projectVisits = $DB->pselectCol(
            "SELECT DISTINCT Visit_label FROM test_battery tb
            JOIN project_cohort_rel psr ON (psr.CohortID=tb.CohortID)
            WHERE psr.ProjectID=:projID
            ORDER BY Visit_label",
            ['projID' => $projectID]
        );

        if (!in_array($visit, $projectVisits)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Visit is not defined for selected Project.'
            );
        }

        // Validation: Instrument is part of Visit's test battery
        $visitInstruments = $DB->pselectCol(
            "SELECT DISTINCT test_name FROM test_battery
            WHERE Visit_label=:visit
            ORDER BY test_name",
            ['visit' => $visit]
        );

        if (!in_array($instrumentName, $visitInstruments)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Instrument does not exist in selected visit.'
            );
        }

        // Validation: Source Field belongs to Instrument
        $instrumentFields = array_column(
            \Utility::getSourcefields($instrumentName),
            'SourceField'
        );
        $matches          = array_intersect($sourceFields, $instrumentFields);
        if (count($matches) !== count($sourceFields)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Source Field does not exist in instrument.'
            );
        }

        // Validation: Order Number should be unique for specified project
        $match = $DB->pselectOne(
            "SELECT Name
            FROM diagnosis_evolution
            WHERE ProjectID=:projID
            AND orderNumber=:ord
            AND NOT FIND_IN_SET(DxEvolutionID, :dxEvoID)",
            [
                'projID'  => $projectID,
                'ord'     => $orderNumber,
                'dxEvoID' => $dxEvolutionID
            ]
        );
        if (!is_null($match)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                "Order Number not unique for this Project! 
                Already used in Trajectory: $match."
            );
        }

        $set = [
            "Name"           => $name,
            "ProjectID"      => $projectID,
            "visitLabel"     => $visit,
            "instrumentName" => $instrumentName,
            "sourceField"    => implode(',', $sourceFields),
            "orderNumber"    => $orderNumber
        ];

        return $this->updateDiagnosisTrajectory($dxEvolutionID, $set);
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleDELETE(ServerRequestInterface $request)
        : ResponseInterface
    {
        $DB     = \NDB_Factory::singleton()->database();
        $values = $request->getQueryParams();
        $ID     = $values['ID'];

        if (!is_null($ID)) {
            $DB->delete(
                'candidate_diagnosis_evolution_rel',
                ['DxEvolutionID' => $ID]
            );
            $DB->delete('diagnosis_evolution', ['DxEvolutionID' => $ID]);
        }

        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Processes trajectory data submitted via diagnosis evolution form.
     *
     * @param string $dxEvolutionID The Diagnosis Track ID
     * @param array  $set           The data to insert oir update in the DB
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    function updateDiagnosisTrajectory(
        string $dxEvolutionID,
        array $set
    ) : ResponseInterface {
        $DB = \NDB_Factory::singleton()->database();

        // Create or update a Diagnosis Trajectory
        if ($dxEvolutionID == 'new') {
            // Validation: Name does not already exist
            $dxNames = $DB->pselectCol(
                "SELECT LOWER(Name) FROM diagnosis_evolution",
                []
            );
            if (in_array(strtolower($set['Name']), $dxNames)) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'Trajectory Name already exists.'
                );
            }

            $DB->insert(
                'diagnosis_evolution',
                $set
            );
            return new \LORIS\Http\Response\JSON\OK();
        } else {
            // Validation: Name does not already exist
            $dxNames = $DB->pselectCol(
                "SELECT LOWER(Name) FROM diagnosis_evolution
                WHERE DxEvolutionID NOT IN ($dxEvolutionID)",
                []
            );
            if (in_array(strtolower($set['Name']), $dxNames)) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'Trajectory Name already exists.'
                );
            }

            // Update Diagnosis Trajectory
            $DB->update(
                'diagnosis_evolution',
                $set,
                ['DxEvolutionID' => $dxEvolutionID]
            );
            return new \LORIS\Http\Response\JSON\OK();
        }
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
        ];
    }
}
