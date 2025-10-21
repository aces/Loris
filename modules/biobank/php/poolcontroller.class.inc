<?php declare(strict_types=1);

/**
 * This class features the code that enables access to the Pools of the
 * LORIS Biobank Module.
 *
 * PHP Version 8.2
 *
 * @category   Controller
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * This class features the code that enables access to the Pools of the
 * LORIS Biobank Module.
 *
 * PHP Version 8.2
 *
 * @category   Controller
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
class PoolController
{
    /**
     * Private instances of the Database, User and PoolDAO classes.
     *
     * @var \Database $db
     * @var \User     $user
     * @var PoolDAO   $dao
     * @var \LORIS\LorisInstance $loris
     */
    private $db, $user, $dao, $loris;

    /**
     * Pool Controller Class constructor.
     *
     * @param \LORIS\LorisInstance $loris LORIS Instance.
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
     * Get all Pool Objects permitted by the Pool Data Provisioner.
     *
     * @return array of all permissable Pool Objects
     */
    public function getInstances() : array
    {
        $this->_validatePermission('view');
        $pools  = [];
        $poolIt = $this->dao->execute($this->user);
        foreach ($poolIt as $id => $pool) {
            $pools[$id] = $pool;
        }

        return $pools;
    }

    // TODO: Decide if this should be able to handle a list of pools rather
    // than a singular pool array.

    /**
     * Takes a list of pool arrays from the client-side, validates them,
     * instantiates them and sends them to the DAO to be saved to the database.
     *
     * @param array $poolArray pool array to be created.
     *
     * @return Pool $pool The created Pool.
     */
    public function createInstance(array $poolArray) : Pool
    {
        $this->_validatePermission('create');
        $pool = (new Pool())->fromArray($poolArray);
        $this->validateInstance($pool);
        return $this->dao->saveInstance($pool);
    }

    /**
     * Treats the Pool DAO as a Provisioner that can be iterated through to
     * provide the permissible Pool Objects for the current User
     *
     * @return \LORIS\Data\Provisioner
     */
    private function _getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $dao = new PoolDAO($this->loris);
        $dao = $dao
            ->filter(new \LORIS\Data\Filters\UserSiteMatch())
            ->filter(new \LORIS\Data\Filters\UserProjectMatch());
        return $dao;
    }

    /**
     * Checks user Permissions for given requested action.
     *
     * @param string $method to be executed.
     *
     * @return void
     */
    private function _validatePermission(string $method) : void
    {
        switch ($method) {
        case 'view':
            if (!$this->user->hasPermission('biobank_pool_view')) {
                throw new Forbidden('Pool: View Permission Denied');
            }
            break;
        case 'create':
            if (!$this->user->hasPermission('biobank_pool_create')) {
                throw new Forbidden('Pool: Create Permission Denied');
            }
            break;
        }
    }

    /**
     * Validates Pool Object before being saved
     *
     * @param Pool $pool Pool to be validated
     *
     * @return void
     */
    function validateInstance(Pool $pool) : void
    {
        $this->_validateLabel($pool);
        // $this->_validateQuantity($pool);
        // $this->_validateUnitId($pool);
        $this->_validateSpecimenIds($pool);
        // $this->_validateDate($pool);
        // $this->_validateTime($pool);
    }

    /**
     * Validates Pool Object Label
     *
     * @param Pool $pool Pool to be checked.
     *
     * @throws BadRequest if the provided Pool does not meet validation requirements
     *
     * @return void
     */
    private function _validateLabel(Pool $pool) : void
    {
        $poolList = $this->dao->selectInstances(
            [
                ['column' => 'bp.Label', 'value' => $pool->getLabel()],
            ],
        );
        if (!empty($poolList)) {
            throw new BadRequest('Pool Label must be unique');
        }
        // TODO: Validate Label with Regex and required
    }

    /**
     * Validates Pool Object Specimen IDs
     *
     * @param Pool $pool Pool to be checked.
     *
     * @throws BadRequest if the provided Pool does not meet validation requirements
     *
     * @return void
     */
    private function _validateSpecimenIds(Pool $pool) : void
    {
        $specimenIds = $pool->getSpecimenIds();
        if (count($specimenIds) < 2) {
            throw new BadRequest(
                'At least 2 specimens must be provided to create a Pool'
            );
        }

        // XXX: not sure why a loris oobject is being passed to instatiate the
        // DAO. Maybe this is right, but I'm not sure why.
        $specimenDAO   = new SpecimenDAO($this->loris);
        $containerDAO  = new ContainerDAO($this->db);
        $baseSpecimen  = $specimenDAO->getInstanceFromId($specimenIds[0]);
        $baseContainer = $containerDAO->getInstanceFromId(
            $baseSpecimen->getContainerId()
        );

        foreach ($specimenIds as $specimenId) {
            $specimen  = $specimenDAO->getInstanceFromId($specimenId);
            $container = $containerDAO->getInstanceFromId(
                $specimen->getContainerId()
            );
            $barcode   = $container->getBarcode();

            if ($baseSpecimen->getCandidateId() !== $specimen->getCandidateId()) {
                throw new BadRequest(
                    'Pooled specimens must belong to the same Candidate'
                );
            }

            if ($baseSpecimen->getSessionId() !== $specimen->getSessionId()) {
                throw new BadRequest(
                    'Pooled specimens must belong to the same Session'
                );
            }

            if ($baseSpecimen->getTypeId() !== $specimen->getTypeId()) {
                throw new BadRequest('Pooled specimens must be of the same Type');
            }

            if ($baseContainer->getCenterId() != $container->getCenterId()) {
                throw new BadRequest('Pooled specimens must be at the same Site');
            }

            if ($specimen->getQuantity() === 0 ) {
                throw new BadRequest(
                    "Quantity of '$barcode' must be greater than '0'"
                );
            }

            if ($specimen->getPoolId() !== null) {
                throw new BadRequest(
                    "Specimen '$barcode' already belongs to a Pool"
                );
            }

            $stati    = $containerDAO->getStati();
            $statusId = $container->getStatusId() ?? '';
            if ($stati[$statusId]['label'] !== 'Available') {
                throw new BadRequest("Specimen '$barcode' is not 'Available'");
            }
        }
    }
}
