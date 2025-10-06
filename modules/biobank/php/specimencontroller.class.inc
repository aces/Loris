<?php declare(strict_types=1);

/**
 * This class features the code that enables access to the Specimens of the LORIS
 * Biobank Module.
 *
 * PHP Version 8.2
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
 * PHP Version 8.2
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
     * @var \LORIS\LorisInstance $loris
     * @var \Database   $db
     * @var \User       $user
     * @var SpecimenDAO $dao
     */
    private $loris;
    private $db;
    private $user;
    private SpecimenDAO $dao;

    /**
     * Specimen Controller Class constructor
     *
     * @param \LORIS\LorisInstance $loris Loris instance
     * @param \User                $user  User Instance.
     */
    function __construct(\LORIS\LorisInstance $loris, \User $user)
    {
        $this->loris = $loris;
        $this->db    = $loris->getDatabaseConnection();
        $this->user  = $user;
        $this->dao   = $this->_getDataProvisioner();
    }

    /**
     * Get all Specimen Objects permitted by the Specimen Data Provisioner (DAO).
     *
     * @return array
     */
    public function getInstances() : array
    {
        $this->_validatePermission('view');
        $specimens  = [];
        $this->dao  = $this->dao
            ->filter(new \LORIS\Data\Filters\UserSiteMatch())
            ->filter(new \LORIS\Data\Filters\UserProjectMatch());
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
     *
     * @return array $specimen a list of specimen objects that were created.
     */
    public function createInstances(array $list) : array
    {
        $this->_validatePermission('create');

        $containerList = [];
        $specimenList  = [];
        foreach (array_values($list) as $specimen) {
            $containerList[] = $specimen['container'];
            $specimenList[]  = $this->_prepare($specimen);
        }

        $contController = new ContainerController($this->loris, $this->user);
        $containers     = $contController->createInstances($containerList);
        if ($containers[0]->getParentContainerId()) {
            $containers[] = $contController->dao->getInstanceFromId(
                $containers[0]->getParentContainerId()
            );
        }

        $specimens = [];
        foreach ($specimenList as $i => $specimen) {
            $specimen->setContainerId($containers[$i]->getId());
            $specimens[] = $this->dao->saveInstance($specimen);
            $containers[$i]->setSpecimenId($specimen->getId());
        }

        return ['specimens' => $specimens, 'containers' => $containers];
    }

    /**
     * This method takes in a specimen array from the front-end, validates it,
     * instantiates it and then sends it to the DAO to be saved to the
     * database.
     *
     * @param array $specimenArray specimen array to be created
     *
     * @return ?Specimen updated Specimen
     */
    public function updateInstance(array $specimenArray) : ?Specimen
    {
        $this->_validatePermission('update');
        $specimen = $this->_prepare($specimenArray);
        return $this->dao->saveInstance($specimen);
    }

    /**
     * Converts data into a specimen intance validates the specimen.
     *
     * @param array $specimenArray Specimen data to be instantiated
     *
     * @return Specimen $specimen to be submitted
     */
    private function _prepare(array $specimenArray) : Specimen
    {
        $specimen = (new Specimen($this->loris))->fromArray($specimenArray);
        $this->_validateInstance($specimen);

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
        $this->_validatePermission('view');
        return [
            'types'              => $this->dao->getTypes(),
            'typeUnits'          => $this->dao->getTypeUnits(),
            'typeContainerTypes' => $this->dao->getTypeContainerTypes(),
            'protocols'          => $this->dao->getProtocols(),
            'processes'          => $this->dao->getProcesses(),
            'protocolAttributes' => $this->dao->getProtocolAttributes(),
            'processAttributes'  => $this->dao->getProcessAttributes(),
            'units'              => $this->dao->getUnits(),
            'attributes'         => $this->dao->getAttributes(),
            'attributeDatatypes' => $this->dao->getAttributeDatatypes(),
        ];
    }

    /**
     * Treats the Specimen DAO as a Provisioner that can be iteratated
     * through to provide the permissable Specimen Objects for the current User.
     *
     * @return SpecimenDAO
     */
    private function _getDataProvisioner() : SpecimenDAO
    {
        return new SpecimenDAO($this->loris);
    }

    /**
     * Checks User Permissions for creating or updating Specimen Objects.
     *
     * @param string $method User requested action
     *
     * @return void
     */
    private function _validatePermission(string $method) : void
    {
        switch ($method) {
        case 'view':
            if (!$this->user->hasPermission('biobank_specimen_view')) {
                throw new Forbidden('Specimen: View Permission Denied');
            }
            break;
        case 'update':
            if (!$this->user->hasPermission('biobank_specimen_update')
                && !$this->user->hasPermission('biobank_specimen_alter')
            ) {
                throw new Forbidden('Specimen: Update Permission Denied');
            }
            break;
        case 'create':
            if (!$this->user->hasPermission('biobank_specimen_create')) {
                throw new Forbidden('Specimen: Create Permission Denied');
            }
            break;
        }
    }

    /**
     * Validates Specimen Data before being saved
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @return void
     */
    private function _validateInstance(Specimen $specimen) : void
    {
        $this->_validateTypeId($specimen);
        $this->_validateQuantity($specimen);
        $this->_validateUnitId($specimen);
        $this->_validateFTCycle($specimen);
        $this->_validateParentSpecimenIds($specimen);
        $this->_validateCandidateId($specimen);
        $this->_validateSessionId($specimen);
        $this->_validateCollection($specimen);
        $this->_validatePreparation($specimen);
        $this->_validateAnalysis($specimen);
    }

    /**
     * Validates Specimen Object Type ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateTypeId(Specimen $specimen) : void
    {
        if (is_null($specimen->getTypeId())) {
            throw new BadRequest("Specimen Type value must be set");
        }
    }

    /**
     * Validates Specimen Object Quantity.
     *
     * @param Specimen|Process $object Object to be validated.
     *
     * @throws BadRequest if the provided object does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateQuantity(object $object) : void
    {
        $quantity = $object->getQuantity();
        if (is_null($quantity)) {
            throw new BadRequest('Specimen Quantity value must be set');
        }
        if (!(is_numeric($quantity) && is_float(floatval($quantity)))) {
            throw new BadRequest('Specimen Quantity value must be a number');
        }
        //TODO: This is where a capacity check would go, i.e. $quantity > $capacity.
        if ($quantity < 0) {
            throw new BadRequest('Specimen Quantity cannot be less than 0');
        }
    }

    /**
     * Validates Specimen Object Unit ID.
     *
     * @param Specimen|Process $object Object to be validated.
     *
     * @throws BadRequest if the provided object does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateUnitId(object $object) : void
    {
        if (is_null($object->getUnitId())) {
            throw new BadRequest("Specimen Unit value must be set");
        }
    }

    /**
     * Validates Specimen Object FT Cycle.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateFTCycle(Specimen $specimen) : void
    {
        $fTCycle = $specimen->getFTCycle();
        if (isset($fTCycle)) {
            if (strval($fTCycle) !== strval(intval($fTCycle))
                || intval($fTCycle) < 0
            ) {
                throw new BadRequest("F/T Cycle must be 0 or more");
            }

            if ($fTCycle > 100) {
                throw new BadRequest("F/T Cycle value is too large");
            }
        }
    }

    /**
     * Validates Specimen Object Parent Specimen IDs.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
                          requirements.
     *
     * @return void
     */
    private function _validateParentSpecimenIds(Specimen $specimen) : void
    {
        $parentSpecimenIds = $specimen->getParentSpecimenIds();
        if ($parentSpecimenIds) {
            $baseParentSpecimen = $this->dao->getInstanceFromId(
                (int) $parentSpecimenIds[0]
            );
        }
        $specimenTypes = $this->dao->getTypes();

        if (empty($parentSpecimeIds)) {
            return;
        }
        if (empty($baseParentSpecimen)) {
            return;
        }
        foreach ($parentSpecimenIds as $parentSpecimenId) {
            $parentSpecimen = $this->dao->getInstanceFromId((int) $parentSpecimenId);

            $pSpecimenCandId = $parentSpecimen->getCandidateId();

            if ($baseParentSpecimen->getCandidateId() != $pSpecimenCandId) {
                throw new BadRequest(
                    'Parent Specimens must be from the same Candidate'
                );
            }

            if ($baseParentSpecimen->getSessionId()!= $parentSpecimen->getSessionId()
            ) {
                throw new BadRequest(
                    'Parent Specimens must be from the same Session'
                );
            }

            if ($baseParentSpecimen->getTypeId() != $parentSpecimen->getTypeId()) {
                throw new BadRequest('Parent Specimens must be of the same Type');
            }

            if ($parentSpecimen->getTypeId() != $specimen->getTypeId()) {
                if (empty($specimenTypes[$specimen->getTypeId()]['parentTypeIds'])) {
                    $parentTypeId = $parentSpecimen->getTypeId();

                    $childType  = $specimenTypes[$specimen->getTypeId()]['label'];
                    $parentType = $specimenTypes[$parentTypeId]['label'];
                    throw new BadRequest(
                        "A specimen of type '$childType' cannot be derived
                                           from a parent of type '$parentType'"
                    );
                }
                if (!in_array(
                    $parentSpecimen->getTypeId(),
                    $specimenTypes[$specimen->getTypeId()]['parentTypeIds']
                )
                ) {
                    throw new BadRequest(
                        'Parent Specimens must be of a type that
                                           is a parent to the current Specimen type'
                    );
                }
            }
        }
    }

    /**
     * Validates Specimen Object Candidate ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateCandidateId(Specimen $specimen) : void
    {
        if (is_null($specimen->getCandidateId())) {
            throw new BadRequest("PSCID value must be set");
        }
    }

    /**
     * Validates Specimen Object Session ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateSessionId(Specimen $specimen) : void
    {
        if (is_null($specimen->getSessionId())) {
            throw new BadRequest("Visit Label value must be set");
        }
    }

    /**
     * Validates Specimen Object Collection.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateCollection(Specimen $specimen) : void
    {
        $collection = $specimen->getCollection();
        $this->_validateProtocolId($collection);
        $this->_validateExaminerId($collection);
        $this->_validateQuantity($collection);
        $this->_validateUnitId($collection);
        $this->_validateCenterId($collection);
        // $this->_validateDate($collection);
        // $this->_validateTime($collection);
        $this->_validateData($collection);
    }

    /**
     * Validates Specimen Object Preparation.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validatePreparation(Specimen $specimen) : void
    {
        $preparation = $specimen->getPreparation();
        if (isset($preparation)) {
            $this->_validateProtocolId($preparation);
            $this->_validateExaminerId($preparation);
            $this->_validateCenterId($preparation);
            // $this->_validateDate($preparation);
            // $this->_validateTime($preparation);
            $this->_validateData($preparation);
        }
    }

    /**
     * Validates Specimen Object Type ID.
     *
     * @param Specimen $specimen Specimen to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateAnalysis(Specimen $specimen) : void
    {
        // Validate Analysis
        $analysis = $specimen->getAnalysis();
        if (isset($analysis)) {
            $this->_validateProtocolId($analysis);
            $this->_validateExaminerId($analysis);
            $this->_validateCenterId($analysis);
            // $this->_validateDate($analysis);
            // $this->_validateTime($analysis);
            $this->_validateData($analysis);
        }
    }

    /**
     * Validates Specimen Process Protocol ID.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateProtocolId(Process $process) : void
    {
        if (is_null($process->getProtocolId())) {
            throw new BadRequest('Specimen Processing Protocol must be set');
        }
    }

    /**
     * Validates Specimen Process Examiner ID.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Specimen does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateExaminerId(Process $process) : void
    {
        if (is_null($process->getProtocolId())) {
            throw new BadRequest('Specimen Processing Examiner must be set');
        }
        // TODO: Potentially check that examinerId is within the set of possible
        // values. I.e. an ID of the examiner table.
    }

    /**
     * Validates Specimen Process Center ID.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Process does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateCenterId(Process $process) : void
    {
        if (is_null($process->getCenterId())) {
            throw new BadRequest('Specimen Processing Center must be set');
        }
    }

    /**
     * Validates Specimen Process Data.
     *
     * @param Process $process Process to be validated.
     *
     * @throws BadRequest if the provided Process does not meet validation
     *                    requirements.
     *
     * @return void
     */
    private function _validateData(Process $process) : void
    {
        $protocolAttributes = $this->dao->getProtocolAttributes();
        $attributeDatatypes = $this->dao->getAttributeDatatypes();
        $protocolId         = $process->getProtocolId();
        $attributes         = $protocolAttributes[$protocolId] ?? [];
        $data = $process->getData() ?? [];

        foreach ($attributes as $attribute) {
            $attributeId = $attribute['id'];
            $value       = $data[$attributeId] ?? null;

            // Check if the attribute is required and missing
            if ($attribute['required'] && $value === null) {
                throw new BadRequest(
                    "The attribute '"
                    . $attribute['label']
                    . "' is required. Protocol "
                    . $protocolId
                );
            }

            // Skip validation if the attribute is not present in the data
            if ($value === null) {
                continue;
            }

            // Validate the attribute's data type
            $datatype = $attributeDatatypes[$attribute['datatypeId']]['datatype'];
            if ($datatype === 'boolean' && !is_bool($value)) {
                throw new BadRequest(
                    "The attribute '"
                    . $attribute['label']
                    . "' must be a boolean"
                );
            }

            if ($datatype === 'number' && !is_numeric($value)) {
                throw new BadRequest(
                    "The attribute '"
                    . $attribute['label']
                    . "' must be a number"
                );
            }

            // TODO: Add further validations for text, date, time, file, etc.
            if ($datatype === 'text') {
            }

            if ($datatype === 'date') {
            }

            if ($datatype === 'time') {
            }

            if ($datatype === 'file') {
            }
        }
    }
}
