<?php declare(strict_types=1);
/**
 * This class features the code that enables access to the Pools of the
 * LORIS Biobank Module.
 *
 * PHP Version 7.2
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
 * PHP Version 7.2
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
     */
    private $db, $user, $dao;

    /**
     * Pool Controller Class constructor.
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
     * Get all Pool Objects permitted by the Pool Data Provisioner.
     *
     * @return array of all permissable Pool Objects
     */
    public function getInstances() : array
    {
        $this->validatePermission('view');
        $pools  = array();
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
     * @return string a json encoded string of all permissable Pool Objects.
     */
    public function createInstance(array $poolArray)
    {
        $this->validatePermission('create');
        $pool = (new Pool())->fromArray($poolArray);
        $this->validateInstance($pool);
        $this->dao->saveInstance($pool);
    }

    /**
     * Treats the Pool DAO as a Provisioner that can be iterated through to
     * provide the permissible Pool Objects for the current User
     *
     * @return \LORIS\Data\Provisioner
     */
    private function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $dao = new PoolDAO($this->db);
        if ($this->user->hasPermission('access_all_profiles') == false) {
            $dao = $dao->filter(new \LORIS\Data\Filters\UserSiteMatch());
        }
        return $dao;
    }

    /**
     * Checks user Permissions for given requested action.
     *
     * @param string $method to be executed.
     *
     * @return void
     */
    private function validatePermission(string $method) : void
    {
        switch ($method) {
        case 'view':
            if (!$this->user->hasPermission('biobank_pool_view')) {
                throw new \Forbidden('Pool: View Permission Denied');
            }
        case 'create':
            if (!$this->user->hasPermission('biobank_pool_create')) {
                throw new \Forbidden('Pool: Create Permission Denied');
            }
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
        $this->validateLabel($pool);
        $this->validateSpecimenIds($pool);
        $this->validateCenterId($pool);
        $this->validateDate($pool);
        $this->validateTime($pool);
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
    private function validateLabel(Pool $pool) : void
    {
        //TODO: Validate Label with Regex and required
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
    private function validateSpecimenIds(Pool $pool) : void
    {
        $specimenIds = $pool->getSpecimenIds();
        if (count($specimenIds) < 2) {
            throw new \BadRequest(
                'At least 2 specimens must be provided to create a Pool'
            );
        }

        $specimenDAO   = new SpecimenDAO($this->db);
        $containerDAO  = new ContainerDAO($this->db);
        $baseSpecimen  = $specimenDAO->getInstanceFromId($specimenIds[0]);
        $baseContainer = $containerDAO->getInstanceFromId($baseSpecimen->getContainerId());

        foreach ($specimenIds as $specimenId) {
            //TODO: Make sure to check that containers are available.
            //TODO: Make sure to check there are atleast two items in the list
            $specimen  = $specimenDAO->getInstanceFromId($specimenId);
            $container = $containerDAO->getInstanceFromId($specimen->getContainerId());
            $barcode   = $container->getBarcode();

            if ($baseSpecimen->getCandidateId() !== $specimen->getCandidateId()) {
                throw new \BadRequest('Pooled specimens must belong to the same Candidate');
            }

            if ($baseSpecimen->getSessionId() !== $specimen->getSessionId()) {
                throw new \BadRequest('Pooled specimens must belong to the same Session');
            }

            if ($baseSpecimen->getTypeId() !== $specimen->getTypeId()) {
                throw new \BadRequest('Pooled specimens must be of the same Type');
            }

            if ($baseContainer->getCenterID() !== $container->getCenterID()) {
                throw new \BadRequest('Pooled specimens must be at the same Site');
            }

            if ($specimen->getQuantity() === 0 ) {
                throw new \BadRequest("Quantity of '$barcode' must be greater than '0'");
            }

            if ($specimen->getPoolId() !== null) {
                throw new \BadRequest("Specimen '$barcode' already belongs to a Pool");
            }
        }
    }

    /**
     * Validates Pool Object Center ID
     *
     * @param Pool $pool Pool to be checked.
     *
     * @throws BadRequest if the provided Pool does not meet validation requirements
     *
     * @return void
     */
    private function validateCenterId(Pool $pool) : void
    {
        if (is_null($pool->getCenterId())) {
            throw new \BadRequest('Pool Center must be set');
        }
    }

    /**
     * Validates Pool Object Date
     *
     * @param Pool $pool Pool to be checked.
     *
     * @throws BadRequest if the provided Pool does not meet validation requirements
     *
     * @return void
     */
    private function validateDate(Pool $pool) : void
    {
        // TODO: query date format from backend configuration.
        // $format = 'd-m-Y';
        // $date   = \DateTime::createFromFormat($format, $pool->getDate());
        // if ($date && $date->format($format) !== $pool->getDate()) {
        //     throw new \BadRequest("Pooling date must be of the format: $format");
        // }
    }

    /**
     * Validates Pool Object Time
     *
     * @param Pool $pool Pool to be checked.
     *
     * @throws BadRequest if the provided Pool does not meet validation requirements
     *
     * @return void
     */
    private function validateTime(Pool $pool) : void
    {
        // TODO: query time format from backend configuration.
        // $format = 'H:i';
        // $time   = \DateTime::createFromFormat($format, $pool->getTime());
        // if ($time && $time->format($format) !== $pool->getTime()) {
        //     throw new \BadRequest("Pooling time must be of the format: $format");
        // }
    }
}
