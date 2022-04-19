<?php declare(strict_types=1);
/**
 * This class features the code that enables access to the Shipments of the LORIS
 * Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Handler
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
namespace LORIS\biobank;

/**
 * This class features the code that enables access to the Shipments of the LORIS
 * Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Handler
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
class ShipmentHandler
{
    /**
     * Private instances of the Database, User and ContainerDAO classes
     *
     * @var \Shipment   $shipment
     * @var \Database   $db
     * @var \User       $user
     * @var ShipmentDAO $dao
     */
    private $shipment;
    private $db;
    private $user;
    private $dao;

    /**
     * Shipment Handler Class constructor
     *
     * @param Database $db   Database Instance.
     * @param User     $user User Instance.
     */
    function __construct(array $data, \Database $db, \User $user)
    {
        $this->db       = $db;
        $this->user     = $user;
        $this->dao      = $this->getDataProvisioner();
        $this->shipment = new Shipment($data);
        $this->validate($this->shipment);
    }

    /**
     * This method takes in a list of shipment and container arrays from the
     * front-end. The shipments are validated while the containers are
     * sent to their respective handler to be validated and saved. The ids of
     * the saved containers are set to the shipment instances which are then
     * sent to the DAO to be saved.
     *
     * @param array $shipmentArray a list of shipment and container arrays to be created.
     *
     * @return array a list of shipment objects that were created.
     */
    public function createInstance() : array
    {
        $this->validatePermission('create');
        return $this->dao->saveInstance($this->shipment);
    }

    /**
     * This method takes in a shipment array from the front-end, validates it,
     * instantiates it and then sends it to the DAO to be saved to the
     * database.
     *
     * @param array $shipmentArray shipment array to be created
     *
     * @return array a list of shipments objects that were created
     */
    public function updateInstance(array $shipmentArray) : array
    {
        $this->validatePermission('update');
        return $this->dao->saveInstance($this->shipment);
    }

    /**
     * Treats the Shipment DAO as a Provisioner that can be iteratated
     * through to provide the permissable Shipment Objects for the current User.
     *
     * @return \LORIS\Data\Provisioner
     */
    private function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $dao = new ShipmentDAO($this->db);

        if ($this->user->hasPermission('access_all_profiles') === false) {
            $dao = $dao->filter(new \LORIS\Data\Filters\UserSiteMatch());
        }
        return $dao;
    }

    /**
     * Checks User Permissions for creating or updating Shipment Objects.
     *
     * @param string $method User requested action
     *
     * @return void
     */
    private function validatePermission(string $method) : void
    {
        // switch($method) {
        // case 'view':
        //     if (!$this->user->hasPermission('biobank_shipment_view')) {
        //         throw new \Forbidden('Shipment: View Permission Denied');
        //     }
        //     break;
        // case 'update':
        //     if (!$this->user->hasPermission('biobank_shipment_update')) {
        //         throw new \Forbidden('Shipment: Update Permission Denied');
        //     }
        //     break;
        // case 'create':
        //     if (!$this->user->hasPermission('biobank_shipment_create')) {
        //         throw new \Forbidden('Shipment: Create Permission Denied');
        //     }
        //     break;
        // }
    }

    public function isValid()
    {
        return empty($this->errors);
    }

    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Validates Shipment Data before being saved
     *
     * @param Shipment $shipment
     *
     * @return void
     */
    private function validate(Shipment $shipment) : void
    {
        $errors       = [];
        $errors       = $this->validateBarcode($shipment, $errors);
        $errors       = $this->validateType($shipment, $errors);
        $errors       = $this->validateDestinationCenterId($shipment, $errors);
        $errors       = $this->validateLogs($shipment, $errors);
        $errors       = $this->validateContainers($shipment, $errors);
        $this->errors = $errors;
    }

    /**
     * Validates Shipment Object Barcode.
     *
     * @param Shipment $shipment
     * @param array    $errors
     *
     * @return array
     */
    private function validateBarcode(Shipment $shipment, array $errors) : array
    {
        $error = '';
        if (empty($shipment->barcode)) {
            $error .= 'Barcode is required. ';
        }
        if (!$shipment->id) {
            foreach($this->dao->selectInstances() as $shipmentComp) {
                if ($shipment->barcode === $shipmentComp->barcode) {
                    $error .= 'A shipment with this Barcode already exists. ';
                }
            }
        }
        if (!empty($error)) {
            $errors['barcode'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Object Type Id.
     *
     * @param Shipment $shipment
     * @param array    $errors
     *
     * @return array
     */
    private function validateType(Shipment $shipment, array $errors) : array
    {
        $error = '';
        if (empty($shipment->type)) {
            $error .= 'Shipment Type is required. ';
        }
        if (!empty($error)) {
            $errors['type'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Object Destination Center.
     *
     * @param Shipment $shipment
     * @param array    $errors
     *
     * @return array
     */
    private function validateDestinationCenterId(Shipment $shipment, array $errors) : array
    {
        $error = '';
        if (empty($shipment->destinationCenterId)) {
            $error .= 'Destination Center is required.';
        }

        // TODO: Check that Destination Center is an actual center.

        if (!empty($error)) {
            $errors['destinationCenterId'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Object Containers
     *
     * @param Shipment $shipment
     * @param array    $errors
     *
     * @return array
     */
    private function validateContainers(Shipment $shipment, array $errors) : array
    {
        $error = '';
        $field = 'containerIds';

        // Check that there is atleast one container in the shipment.
        if (empty($shipment->containerIds)) {
            $errors[$field] = 'Atleast 1 container must be selected.';
            return $errors;
        }

        $containerDAO = new ContainerDAO($this->db);
        $container1   = $containerDAO->getInstanceFromId((int) $shipment->containerIds[0]);
        foreach ($shipment->containerIds as $containerId) {
            $container = $containerDAO->getInstanceFromId((int) $containerId);

            // TODO: Re-Implement once integrity of Centers of Containers is
            // established in CBIGR. Currently, child containers are permitted
            // at a different site than the parent. This should NOT be the case.

            /* Check that containers are all at the same center.*/
            // if ($container->getCenterID() != $container1->getCenterID()) {
            //     $errors[$field] = $container->getBarcode().' and '
            //     .$container1->getBarcode().' are not at the same Center. All
            //     Containers must be at the same Center.';
            //     return $errors;
            // }

            // Check that containers are not already associated with an active
            // shipment.
            if (!$shipment->id) {
                foreach ($container->getShipmentBarcodes() as $shipmentBarcode) {
                    $containerShipment = $this->dao->getInstanceFromBarcode($shipmentBarcode);
                    if ($containerShipment->getActive()) {
                        $errors[$field] = $container->getBarcode().' is already
                  associated with an active shipment';
                    }
                };
            }
        }

        // TODO: this could maybe be improved since it only checks 1 shipment.
        // TODO: This check needs to be reworked because it will only apply for
        // the shipment creation.
        // Check that the containers are at the same center as the shipment.
        // if ($shipment->logs[0]->centerId !== $container1->getCenterID()) {
        //     $error .= 'Containers must be at the same site as the shipment. ';
        // }

        // shipment

        if (!empty($error)) {
            $errors[$field] = $error;
        }

        return $errors;
    }

    /**
     * Validates Shipment Object Logs.
     *
     * @param Shipment $shipment
     * @param array    $array
     *
     * @return array
     */
    private function validateLogs(Shipment $shipment, array $errors) : array
    {
        $logsErrors = [];
        foreach ($shipment->logs as $i=>$log) {
            $logErrors = [];
            $logErrors = $this->validateCenter($log, $logErrors);
            $logErrors = $this->validateStatus($log, $logErrors);
            $logErrors = $this->validateUser($log, $logErrors);
            $logErrors = $this->validateTemperature($log, $logErrors);
            $logErrors = $this->validateDate($log, $logErrors);
            $logErrors = $this->validateTime($log, $logErrors);
            if (!empty($logErrors)) {
                $logsErrors[$i] = $logErrors;
            }
        }

        if (!empty($logsErrors)) {
            $errors['logs'] = $logsErrors;
        }

        return $errors;
    }

    /**
     * Validates Shipment Log Center.
     *
     * @param Log   $log    Log to be validated.
     * @param array $errors
     *
     * @return array
     */
    private function validateCenter(Log $log, array $errors) : array
    {
        $error = '';
        if (empty($log->centerId)) {
            $error .= 'Center is required';
        }
        if (!empty($error)) {
            $errors['centerId'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Log Status.
     *
     * @param Log   $log    Log to be validated.
     * @param array $errors
     *
     * @return array
     */
    private function validateStatus(Log $log, array $errors) : array
    {
        $error = '';
        if (empty($log->status)) {
            $error .= 'Status is required.';
        }
        if (!empty($error)) {
            $errors['status'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Log Center.
     *
     * @param Log   $log    Log to be validated.
     * @param array $errors
     *
     * @return array
     */
    private function validateUser(Log $log, array $errors) : array
    {
        $error = '';
        if (empty($log->user)) {
            $error .= 'User is required.';
        }
        if (!empty($error)) {
            $errors['user'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Log Temperature.
     *
     * @param Log   $log    Log to be validated.
     * @param array $errors
     *
     * @return array
     */
    private function validateTemperature(Log $log, array $errors) : array
    {
        $error = '';
        if (empty($log->temperature)) {
            $error .= 'Temperature is required.';
        }
        if (!empty($error)) {
            $errors['temperature'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Log Date.
     *
     * @param Log   $log    Log to be validated.
     * @param array $errors
     *
     * @return array
     */
    private function validateDate(Log $log, array $errors) : array
    {
        $error = '';
        if (empty($log->date)) {
            $error .= 'Date is required.';
        }
        if (!empty($error)) {
            $errors['date'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Log Time.
     *
     * @param Log   $log    Log to be validated.
     * @param array $errors
     *
     * @return array
     */
    private function validateTime(Log $log, array $errors) : array
    {
        $error = '';
        if (empty($log->time)) {
            $error .= 'Time is required.';
        }
        if (!empty($error)) {
            $errors['time'] = $error;
        }
        return $errors;
    }
}
