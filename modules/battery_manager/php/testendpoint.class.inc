<?php
/**
 * This file contains the Test Endpoint.
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\battery_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Main class for managing Test Instances
 *
 * Handles requests for retrieving and saving Test Instances.
 * Allows users to add, activate, and deactivate entries in the test battery.
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class TestEndpoint extends \NDB_Page implements RequestHandlerInterface
{

    /**
     * The database connection
     *
     * @var \Database
     */
    protected $db;

    /**
     * The user accessing the endpoint
     *
     * @var \User
     */
    protected $user;

    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * This function passes the request to the handler. This is necessary since
     * the Endpoint bypass the Module class.
     *
     * XXX: This function should be extracted to a parent class.
     *
     * @param ServerRequestInterface  $request The PSR7 request.
     * @param RequestHandlerInterface $handler The request handler.
     *
     * @return ResponseInterface The outgoing PSR7 response.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    /**
     * This function can be overridden in a module's page to load the necessary
     * resources to check the permissions of a user.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {
    }

    /**
     * This acts as an Ajax enpoint that handles all action requests from the
     * Battery Manager Module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->db   = $this->loris->getDatabaseConnection();
        $this->user = $request->getAttribute('user');
        $method     = $request->getMethod();

        switch ($method) {
        case 'GET':
            return $this->_getInstances();
        case 'POST':
            return $this->_postInstance($request);
        case 'PUT':
            return $this->_putInstance($request);
        }
    }

    /**
     * Gets the data source for battery manager tests.
     *
     * @return \LORIS\Data\Provisioner
     */
    private function _getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new TestProvisioner($this->loris);

        if ($this->user->hasPermission('access_all_profiles') == false) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }

        return $provisioner;
    }

    /**
     * Puts a test to the test_battery in the database.
     *
     * @param ServerRequestInterface $request Test to be saved
     *
     * @return ResponseInterface response
     */
    private function _putInstance(ServerRequestInterface $request)
    {
        $testArray = json_decode($request->getBody()->getContents(), true);
        $test      = new Test($this->loris, null, $testArray);
        return $this->_saveInstance($test);
    }

    /**
     * Posts a test to the test_battery in the database.
     *
     * @param ServerRequestInterface $request Test to be posted
     *
     * @return ResponseInterface response
     */
    private function _postInstance(ServerRequestInterface $request)
    {
        $testArray = json_decode($request->getBody()->getContents(), true);
        $test      = new Test($this->loris, null, $testArray);
        $test->row['active'] = 'Y';
        return $this->_saveInstance($test, "post");
    }

    /**
     * Generic save function for Test Instances.
     *
     * @param Test   $test   The Test Instance to be saved.
     * @param string $method check the request method
     *
     * @return ResponseInterface response
     */
    private function _saveInstance(Test $test , $method=null)
    {
        if (!$this->user->hasPermission('battery_manager_edit')) {
            return new \LORIS\Http\Response\JSON\Forbidden('Edit Permission Denied');
        }

        // validate instance
        $errors = $this->_validateInstance($test);
        if (!empty($errors)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                implode(' ', $errors)
            );
        }

        // check if instance is duplicate
        if ($this->_isDuplicate($test) && $method =='post') {
            return new \LORIS\Http\Response\JSON\Conflict(
                'This Test already exists in the database'
            );
        }

        try {
            $this->db->insertOnDuplicateUpdate('test_battery', $test->toSQL());
            return new \LORIS\Http\Response\JSON\OK();
        } catch (\DatabaseException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'Could not add entry to the Test Battery'
            );
        }
    }

    /**
     * Checks if the entry is an exact duplicate of a previous entry.
     *
     * @param Test $test Test to be checked.
     *
     * @return bool
     */
    private function _isDuplicate(Test $test) : bool
    {
        // Build SQL query based on values entered by user
        $query = "SELECT ID,
                         Test_name,
                         AgeMinDays,
                         AgeMaxDays,
                         Stage,
                         CohortID,
                         Visit_label,
                         CenterID,
                         firstVisit
                  FROM test_battery";
        // Select duplicate entry from Test Battery
        $entries = $this->db->pselect($query, []);

        $testArray = $test->toSQL();
        foreach ($entries as $entry) {
            if ($testArray['ID'] !== $entry['ID']
                && $testArray['Test_name'] == $entry['Test_name']
                && $testArray['AgeMinDays'] == $entry['AgeMinDays']
                && $testArray['AgeMaxDays'] == $entry['AgeMaxDays']
                && $testArray['Stage'] == $entry['Stage']
                && $testArray['CohortID'] == $entry['CohortID']
                && $testArray['Visit_label'] == $entry['Visit_label']
                && $testArray['CenterID'] == $entry['CenterID']
                && $testArray['firstVisit'] == $entry['firstVisit']
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Converts the results of this menu filter to a JSON format.
     *
     * @return ResponseInterface The outgoing PSR7 with a string of json
     *                           encoded tests as the body.
     */
    private function _getInstances() : ResponseInterface
    {
        $instances = (new \LORIS\Data\Table())
            ->withDataFrom($this->_getDataProvisioner($this->user))
            ->toArray($this->user);
        return new \LORIS\Http\Response\JSON\OK($instances);
    }

    /**
     * Validates the Test Instance and collects in errors in an array.
     *
     * @param Test $test The Test instance to be validated
     *
     * @return array $errors An array string errors.
     */
    private function _validateInstance(Test $test) : array
    {
        $errors = [];
        if (!isset($test->row['testName'])) {
            $errors[] = 'Test Name is a required field.';
        }
        if (!isset($test->row['ageMinDays'])) {
            $errors[] = 'Minimum age is a required field.';
        }
        if (isset($test->row['ageMinDays']) && $test->row['ageMinDays'] < 0) {
            $errors[] = 'Minimum age must be greater than 0.';
        }
        if (!isset($test->row['ageMaxDays'])) {
            $errors[] = 'Maximum age is a required field.';
        }
        if (isset($test->row['ageMaxDays']) && $test->row['ageMaxDays'] < 0) {
            $errors[] = 'Maximum age must be greater than 0.';
        }
        if (isset($test->row['ageMaxDays']) && $test->row['ageMaxDays'] > 99999) {
             $errors[] = 'Maximum age must be less than 99999.';
        }
        if (isset($test->row['ageMinDays']) && $test ->row['ageMinDays'] > 99999) {
             $errors[] = 'Minimum age must be less than 99999';
        }
        if ($test->row['ageMaxDays'] < $test->row['ageMinDays']) {
            $errors[] = 'Maximum age must be greater than minimum age.';
        }
        if (!isset($test->row['stage'])) {
            $errors[] = 'Stage is a required field.';
        }
        if (isset($test->row['instrumentOrder'])
            && ($test->row['instrumentOrder'] > 127
            || $test->row['instrumentOrder'] < -127)
        ) {
            $errors[] = 'Instrument order must be between -127 and 127';
        }

        return $errors;
    }
}

