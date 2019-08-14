<?php declare(strict_types=1);
/**
 * This class features the code that enables access to the Specimens of the LORIS
 * Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Controller
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
namespace LORIS\biobank;

/**
 * This class features the code that enables access to the Specimens of the LORIS
 * Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Controller
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
class SpecimenController
{
    /**
     * Private instances of the Database, User and ContainerDAO classes
     *
     * @var \Database   $db
     * @var \User       $user
     * @var SpecimenDAO $dao
     */
    private $db;
    private $user;
    private $dao;

    /**
     * Specimen Controller Class constructor
     *
     * @param Database $db   Database Instance.
     * @param User     $user User Instance.
     */
    function __construct(\Database $db, \User $user)
    {
        $this->db   = $db;
        $this->user = $user;
        $this->dao  = $this->getDataProvisioner();
    }

    /**
     * Get all Specimen Objects permitted by the Specimen Data Provisioner (DAO).
     *
     * @return array
     */
    public function getInstances() : array
    {
        $this->validatePermission('view');
        $specimens  = array();
        $specimenIt = $this->dao->execute($this->user);
        foreach ($specimenIt as $id => $specimen) {
            $specimens[$id] = $specimen;
        }

        return $specimens;
    }

    /**
     * This method takes in a list of specimen and container arrays from the
     * front-end. The specimens are validated while the containers are
     * sent to their respective controller to be validated and saved. The ids of
     * the saved containers are set to the specimen instances which are then
     * sent to the DAO to be saved.
     *
     * @param array $list a list of specimen and container arrays to be created.
     */
    public function createInstances(array $list) : void
    {
        $this->validatePermission('create');

        foreach ($list as $i => $specimen) {
            $containerList[$i] = $specimen['container'];
            $specimenList[$i]  = $this->prepare($specimen);
        }

        $contController = new ContainerController($this->db, $this->user);
        $containers   = $contController->createInstances($containerList);

        foreach ($specimenList as $i => $specimen) {
            $specimen->setContainerId($containers[$i]->getId());
            $this->dao->saveInstance($specimen);
        }
    }

    /**
     * This method takes in a specimen array from the front-end, validates it,
     * instantiates it and then sends it to the DAO to be saved to the
     * database.
     *
     * @param array $specimenArray specimen array to be created
     *
     * @return \Specimen updated specimen
     */
    public function updateInstance(array $specimenArray) : Specimen
    {
        $this->validatePermission('update');
        $specimen = $this->prepare($specimenArray);
        $specimenId = $this->dao->saveInstance($specimen);
        return $this->dao->getInstanceFromId($specimenId);
    }

    /**
     * Converts data into a specimen intance validates the specimen.
     *
     * @param array $specimenArray Specimen data to be instantiated
     *
     * @return Specimen $specimen to be submitted
     */
    private function prepare(array $specimenArray) : Specimen
    {
        $specimen = (new Specimen)->fromArray($specimenArray);
        $this->validateInstance($specimen);

        return $specimen;
    }

    /**
     * Get all data associated with the Specimen entity. This is used for
     * front-end mapping and populating form options.
     *
     * @return array Associative array of option data.
     */
    public function getOptions() : array
    {
        $this->validatePermission('view');
        return array(
                'types'              => $this->dao->getTypes(),
                'typeUnits'          => $this->dao->getTypeUnits(),
                'typeContainerTypes' => $this->dao->getTypeContainerTypes(),
                'protocols'          => $this->dao->getProtocols(),
                'processes'          => $this->dao->getProcesses(),
                'protocolAttributes' => $this->dao->getProtocolAttributes(),
                'protocolContainers' => $this->dao->getProtocolContainers(),
                'units'              => $this->dao->getUnits(),
                'attributeDatatypes' => $this->dao->getAttributeDatatypes(),
                'attributeOptions'   => $this->dao->getAttributeReferenceTableOptions(),
               );
    }

    /**
     * Treats the Specimen DAO as a Provisioner that can be iteratated
     * through to provide the permissable Specimen Objects for the current User.
     *
     * @return \LORIS\Data\Provisioner
     */
    private function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $dao = new SpecimenDAO($this->db);

        if ($this->user->hasPermission('access_all_profiles') === false) {
            $dao = $dao->filter(new \LORIS\Data\Filters\UserSiteMatch());
        }
        return $dao;
    }

    /**
     * Checks User Permissions for creating or updating Specimen Objects.
     *
     * @param string $method User requested action
     *
     * @return void
     */
    private function validatePermission(string $method) : void
    {
        switch($method) {
        case 'view':
            if (!$this->user->hasPermission('biobank_specimen_view')) {
                throw new \Forbidden('Specimen: View Permission Denied');
            }
        case 'update':
            if (!$this->user->hasPermission('biobank_specimen_update')) {
                throw new \Forbidden('Specimen: Update Permission Denied');
            }
        case 'create':
            if (!$this->user->hasPermission('biobank_specimen_create')) {
                throw new \Forbidden('Specimen: Create Permission Denied');
            }
        }
    }

    /**
     * Validates Specimen Data before being saved
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @return void
     */
    private function validateInstance(Specimen $specimen) : void
    {
        $this->validateTypeId($specimen);
        $this->validateQuantity($specimen);
        $this->validateUnitId($specimen);
        $this->validateFTCycle($specimen);
        $this->validateParentSpecimenIds($specimen);
        $this->validateCandidateId($specimen);
        $this->validateSessionId($specimen);
        $this->validateCollection($specimen);
        $this->validatePreparation($specimen);
        $this->validateAnalysis($specimen);
    }

    /**
     * Validates Specimen Object Type ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateTypeId(Specimen $specimen) : void
    {
        if (is_null($specimen->getTypeId())) {
            throw new \BadRequest("Specimen Type value must be set");
        }
    }

    /**
     * Validates Specimen Object Quantity.
     *
     * @param Specimen|Process $object Object to be validated.
     *
     * @throws BadRequest if the provided object does not meet validation requirements.
     *
     * @return void
     */
    private function validateQuantity(object $object) : void
    {
        $quantity = $object->getQuantity();
        if (is_null($quantity)) {
            throw new \BadRequest('Specimen Quantity value must be set');
        }
        if (!(is_numeric($quantity) && is_float(floatval($quantity)))) {
            throw new \BadRequest('Specimen Quantity value must be a number');
        }
        //TODO: This is where a capacity check would go, i.e. $quantity > $capacity.
        if ($quantity < 0) {
            throw new \BadRequest('Specimen Quantity cannot be less than 0');
        }
    }

    /**
     * Validates Specimen Object Unit ID.
     *
     * @param Specimen|Process $object Object to be validated.
     *
     * @throws BadRequest if the provided object does not meet validation requirements.
     *
     * @return void
     */
    private function validateUnitId(object $object) : void
    {
        if (is_null($object->getUnitId())) {
            throw new \BadRequest("Specimen Unit value must be set");
        }
    }

    /**
     * Validates Specimen Object FT Cycle.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateFTCycle(Specimen $specimen) : void
    {
        $fTCycle = $specimen->getFTCycle();
        if (isset($fTCycle)) {
            if (!is_numeric($fTCycle) || intval($fTCycle) < 0) {
                throw new \BadRequest("F/T Cycle must be 0 or more");
            }
        }
    }

    /**
     * Validates Specimen Object Parent Specimen IDs.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateParentSpecimenIds(Specimen $specimen) : void
    {
        $parentSpecimenIds = $specimen->getParentSpecimenIds();
        if ($parentSpecimenIds) {
            $baseParentSpecimen = $this->dao->getInstanceFromId((int) $parentSpecimenIds[0]);
        }
        $specimenTypes = $this->dao->getTypes();

        foreach ($parentSpecimenIds as $parentSpecimenId) {
            $parentSpecimen = $this->dao->getInstanceFromId((int) $parentSpecimenId);

            if ($baseParentSpecimen->getCandidateId() != $parentSpecimen->getCandidateId()) {
                throw new \BadRequest('Parent Specimens must be from the same Candidate');
            }

            if ($baseParentSpecimen->getSessionId() != $parentSpecimen->getSessionId()) {
                throw new \BadRequest('Parent Specimens must be from the same Session');
            }

            if ($baseParentSpecimen->getTypeId() != $parentSpecimen->getTypeId()) {
                throw new \BadRequest('Parent Specimens must be of the same Type');
            }

            if (!in_array($parentSpecimen->getTypeId(),
                         $specimenTypes[$specimen->getTypeId()]['parentTypeIds'])
            ) {
                throw new \BadRequest('Parent Specimens must be of a type that
                                       is a parent to the current Specimen type');
            }
        }
    }

    /**
     * Validates Specimen Object Candidate ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateCandidateId(Specimen $specimen) : void
    {
        if (is_null($specimen->getCandidateId())) {
            throw new \BadRequest("PSCID value must be set");
        }
    }

    /**
     * Validates Specimen Object Session ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateSessionId(Specimen $specimen) : void
    {
        if (is_null($specimen->getSessionId())) {
            throw new \BadRequest("Visit Label value must be set");
        }
    }

    /**
     * Validates Specimen Object Collection.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateCollection(Specimen $specimen) : void
    {
        $collection = $specimen->getCollection();
        $this->validateProtocolId($collection);
        $this->validateExaminerId($collection);
        $this->validateQuantity($collection);
        $this->validateUnitId($collection);
        $this->validateCenterId($collection);
        $this->validateDate($collection);
        $this->validateTime($collection);
        $this->validateData($collection);
    }

    /**
     * Validates Specimen Object Preparation.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validatePreparation(Specimen $specimen) : void
    {
        $preparation = $specimen->getPreparation();
        if (isset($preparation)) {
            $this->validateProtocolId($preparation);
            $this->validateExaminerId($preparation);
            $this->validateCenterId($preparation);
            $this->validateDate($preparation);
            $this->validateTime($preparation);
            $this->validateData($preparation);
        }
    }

    /**
     * Validates Specimen Object Type ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateAnalysis(Specimen $specimen) : void
    {
        // Validate Analysis
        $analysis = $specimen->getAnalysis();
        if (isset($analysis)) {
            $this->validateProtocolId($analysis);
            $this->validateExaminerId($analysis);
            $this->validateCenterId($analysis);
            $this->validateDate($analysis);
            $this->validateTime($analysis);
            $this->validateData($analysis);
        }
    }

    /**
     * Validates Specimen Process Protocol ID.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateProtocolId(Process $process) : void
    {
        if (is_null($process->getProtocolId())) {
            throw new \BadRequest('Specimen Processing Protocol must be set');
        }
    }

    /**
     * Validates Specimen Process Examiner ID.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation requirements.
     *
     * @return void
     */
    private function validateExaminerId(Process $process) : void
    {
        if (is_null($process->getProtocolId())) {
            throw new \BadRequest('Specimen Processing Examiner must be set');
        }
        // TODO: Potentially check that examinerId is within the set of possible
        // values. I.e. an ID of the examiner table.
    }

    /**
     * Validates Specimen Process Center ID.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Process does not meet validation requirements.
     *
     * @return void
     */
    private function validateCenterId(Process $process) : void
    {
        if (is_null($process->getCenterId())) {
            throw new \BadRequest('Specimen Processing Center must be set');
        }
    }

    // XXX: Now that the DateTime object is used to store date and time,
    // I don't know if these checks are as important because the DateTime
    // doesn't have a native format. As long as it can be converted to 
    // datetime properly, then there isn't really need for validation here.
    // TODO: 
    /**
     * Validates Specimen Process Date.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Process does not meet validation requirements.
     *
     * @return void
     */
    private function validateDate(Process $process) : void
    {
        // TODO: query date format from backend configuration.
        //  $format = 'd-m-Y';
        //  $date   = \DateTime::createFromFormat($format, $pool->getDate());
        //  if ($date && $date->format($format) !== $pool->getDate()) {
        //      throw new \BadRequest("Processing date must be of the format: $format");
        //  }
    }

    /**
     * Validates Specimen Process Time.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Process does not meet validation requirements.
     *
     * @return void
     */
    private function validateTime(Process $process) : void
    {
        // TODO: query time format from backend configuration.
        // $format = 'H:i';
        // $time   = \DateTime::createFromFormat($format, $pool->getTime());
        // if ($time && $time->format($format) !== $pool->getTime()) {
        //     throw new \BadRequest("Processing time must be of the format: $format");
        // }
    }

    /**
     * Validates Specimen Process Data.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Process does not meet validation requirements.
     *
     * @return void
     */
    private function validateData(Process $process) : void
    {
        $protocolAttributes = $this->dao->getProtocolAttributes();
        $attributeDatatypes = $this->dao->getAttributeDatatypes();
        $protocolId = $process->getProtocolId();
        $attributes = $protocolAttributes[$protocolId];
        $data = $process->getData();

        foreach ($data as $attributeId => $value) {
            $attribute = $attributes[$attributeId];

            if (!array_key_exists($attributeId, $attributes)) {
                throw new \BadRequest("");
            }

            if ($attributeDatatypes[$attribute['datatypeId']]['datatype'] === 'boolean') {
                if (false) {
                    throw new \BadRequest($attribute['label'] . " must be a boolean ". $value);
                }
            } 
            if ($attributeDatatypes[$attribute['datatypeId']]['datatype'] === 'number') {
                if (false) {
                    throw new \BadRequest("");
                }
            } 
            if ($attributeDatatypes[$attribute['datatypeId']]['datatype'] === 'text') {
            } 
            if ($attributeDatatypes[$attribute['datatypeId']]['datatype'] === 'date') {
            } 
            if ($attributeDatatypes[$attribute['datatypeId']]['datatype'] === 'time') {
            } 
            if ($attributeDatatypes[$attribute['datatypeId']]['datatype'] === 'file') {
            } 
        }
    }
}
