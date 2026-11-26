<?php declare(strict_types=1);

/**
 * This class features the code that enables access to the Shipments of the LORIS
 * Biobank Module.
 *
 * PHP Version 8.2
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
 * PHP Version 8.2
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
    private array $errors;

    /**
     * Private instances of the Database, User and ContainerDAO classes
     *
     * @var Shipment   $shipment
     * @var \Database   $db
     * @var \User       $user
     * @var ShipmentDAO $dao
     */
    private $shipment;
    private $db;
    private $user;
    private ShipmentDAO $dao;

    /**
     * Shipment Handler Class constructor
     *
     * @param array     $data An array of data to initialize the instance with
     * @param \Database $db   Database Instance.
     * @param \User     $user User Instance.
     */
    function __construct(array $data, \Database $db, \User $user)
    {
        $this->db       = $db;
        $this->user     = $user;
        $this->dao      = new ShipmentDAO($this->db);
        $this->shipment = new Shipment($data);
        $this->_validate($this->shipment);
    }

    /**
     * This method creates a new, empty instance of a shipment.
     *
     * @return array a list of shipment objects that were created.
     */
    public function createInstance() : array
    {
        $this->_validatePermission('create');
        return $this->dao->saveInstance($this->shipment);
    }

    /**
     * This method takes in a shipment array from the front-end, validates it,
     * instantiates it and then sends it to the DAO to be saved to the
     * database.
     *
     * @return array a list of shipments objects that were created
     */
    public function updateInstance() : array
    {
        $this->_validatePermission('update');
        return $this->dao->saveInstance($this->shipment);
    }

    /**
     * Checks User Permissions for creating or updating Shipment Objects.
     *
     * @return void
     */
    private function _validatePermission() : void
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

    /**
     * Check if there's any validation errors for this shipment
     *
     * @return bool
     */
    public function isValid() : bool
    {
        return empty($this->errors);
    }

    /**
     * Get list of validation errors
     *
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Validates Shipment Data before being saved
     *
     * @param Shipment $shipment The shipment to validate
     *
     * @return void
     */
    private function _validate(Shipment $shipment) : void
    {
        $errors       = [];
        $errors       = $this->_validateBarcode($shipment, $errors);
        $errors       = $this->_validateType($shipment, $errors);
        $errors       = $this->_validateDestinationCenter($shipment, $errors);
        $errors       = $this->_validateLogs($shipment, $errors);
        $errors       = $this->_validateContainers($shipment, $errors);
        $this->errors = $errors;
    }

    /**
     * Validates Shipment Object Barcode.
     *
     * @param Shipment $shipment Shipment to validate
     * @param array    $errors   List of errors to add to
     *
     * @return array
     */
    private function _validateBarcode(Shipment $shipment, array $errors) : array
    {
        $error = '';
        if (empty($shipment->barcode)) {
            $error .= 'Barcode is required. ';
        }
        if (!$shipment->id) {
            foreach ($this->dao->selectInstances() as $shipmentComp) {
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
     * @param Shipment $shipment Shipment to validate
     * @param array    $errors   List of errors to add to
     *
     * @return array
     */
    private function _validateType(Shipment $shipment, array $errors) : array
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
     * @param Shipment $shipment Shipment to validate
     * @param array    $errors   List of errors to add to
     *
     * @return array
     */
    private function _validateDestinationCenter(
        Shipment $shipment,
        array $errors
    ) : array {
        $error = '';
        if (empty($shipment->destinationCenterId)) {
            $error .= 'Destination Center is required.';
        }

        // TODO: Check that Destination Center is an actual center.

        if (!empty($error)) {
            $errors['destinationCenter'] = $error;
        }
        return $errors;
    }

    /**
     * Validates Shipment Object Containers and store any failures
     * in $errors.
     *
     * @param Shipment $shipment The shipment to validate
     * @param array    $errors   The existing error list to add to
     *
     * @return array
     */
    private function _validateContainers(Shipment $shipment, array $errors) : array
    {
        $error = '';
        $field = 'containerIds';

        // Check that there is atleast one container in the shipment.
        $containerIds = $shipment->containerIds;
        if (empty($containerIds)) {
            $errors[$field] = 'Atleast 1 container must be selected.';
            return $errors;
        }
        $containerDAO = new ContainerDAO($this->db);
        //$container1   = $containerDAO->getInstanceFromId(
        //    (int) $containerIds[0]
        //);

        foreach ($shipment->containerIds as $containerId) {
            $container = $containerDAO->getInstanceFromId(
                (int) $containerId
            );

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
                    $containerShipment = $this->dao->getInstanceFromBarcode(
                        $shipmentBarcode
                    );
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
     * @param Shipment $shipment The shipment to validate.
     * @param array    $errors   List of errors to add to.
     *
     * @return array
     */
    private function _validateLogs(Shipment $shipment, array $errors) : array
    {
        $logsErrors = [];
        foreach ($shipment->logs as $i=>$log) {
            $logErrors = [];
            $logErrors = $this->_validateCenter($log, $logErrors);
            $logErrors = $this->_validateStatus($log, $logErrors);
            $logErrors = $this->_validateUser($log, $logErrors);
            $logErrors = $this->_validateTemperature($log, $logErrors);
            $logErrors = $this->_validateDate($log, $logErrors);
            $logErrors = $this->_validateTime($log, $logErrors);
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
     * @param array $errors list of errors to add to
     *
     * @return array
     */
    private function _validateCenter(Log $log, array $errors) : array
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
     * @param array $errors List of errors to add to.
     *
     * @return array
     */
    private function _validateStatus(Log $log, array $errors) : array
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
     * @param array $errors List of errors to add to
     *
     * @return array
     */
    private function _validateUser(Log $log, array $errors) : array
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
     * @param array $errors List of errors to add to
     *
     * @return array
     */
    private function _validateTemperature(Log $log, array $errors) : array
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
     * @param array $errors list of errors to add to
     *
     * @return array
     */
    private function _validateDate(Log $log, array $errors) : array
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
     * @param array $errors list of errors to add to
     *
     * @return array
     */
    private function _validateTime(Log $log, array $errors) : array
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
