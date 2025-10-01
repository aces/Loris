<?php declare(strict_types=1);

/**
 * Pool Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Pool Object instances
 *
 * PHP Version 8.2
 *
 * @category   DAO
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\biobank;

/**
 * Pool Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Pool Object instances
 *
 * PHP Version 8.2
 *
 * @category   DAO
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

class PoolDAO extends \LORIS\Data\ProvisionerInstance
{
    /**
     * Private instance of the Database class.
     *
     * @var \LORIS\LorisInstance $loris
     * @var \Database $db
     */
    private $loris;
    private $db;

    /**
     * Initializes a new instance of the PoolDAO Class
     *
     * @param \LORIS\LorisInstance $loris LORIS instance object
     */
    function __construct(\LORIS\LorisInstance $loris)
    {
        $this->loris = $loris;
        $this->db    = $loris->getDatabaseConnection();
    }

    /**
     * This will load all pool persistence variables from the database for a
     * given $id into a Pool object, and return the object.
     *
     * @param int $id Value of the $id for the Pool that will be
     *                instantiated.
     *
     * @return Pool $pool Pool Instance.
     */
    public function getInstanceFromId(int $id) : Pool
    {
        return $this->selectInstances(
            [['column' => 'bp.PoolID', 'value'=>$id]]
        )[$id];
    }

    // XXX: Currently this function is never used with any conditions passed as
    // paramters. Decide if this is a necessary feature.

    /**
     * This will select all pools from the database that match the
     * attribute values passed through $poolData and will return an array
     * of pool objects.
     *
     * @param ?array $conditions Conditions to be met by the query
     * @param string $operator   Operator to link conditions with
     *
     * @return array $pools      List of Pool Objects that match the query
     */
    public function selectInstances(
        ?array $conditions = [],
        $operator = 'AND'
    ) : array {
        $query = "SELECT bp.PoolID,
                         bp.Label,
                         bp.Quantity,
                         bp.UnitID,
                         GROUP_CONCAT(bspr.SpecimenID) as SpecimenIDs,
                         GROUP_CONCAT(bc.Barcode) as SpecimenBarcodes,
                         bp.Date,
                         DATE_FORMAT(bp.Time, '%H:%i') as Time
                  FROM   biobank_pool bp
                  LEFT JOIN
                    biobank_specimen_pool_rel bspr ON bspr.PoolID=bp.PoolID
                  LEFT JOIN
                      biobank_specimen bs ON bs.SpecimenID=bspr.SpecimenID
                  LEFT JOIN
                      biobank_container bc ON bc.ContainerID=bs.ContainerID";
        if (!empty($conditions)) {
            $whereClause = [];
            foreach ($conditions as $condition) {
                $whereClause[] = $condition['column']
                    . '='
                    . '"'
                    . $condition['value']
                    . '"';
            }
            $query .= ' WHERE '.implode(" $operator ", $whereClause);
        }
        $query   .= ' GROUP BY bp.PoolID';
        $poolRows = $this->db->pselectWithIndexKey($query, [], 'PoolID');

        $pools       = [];
        $specimenDAO = new SpecimenDAO($this->loris);

        foreach ($poolRows as $id => $poolRow) {
            $specimenIds      = explode(',', $poolRow['SpecimenIDs']);
            $specimenBarcodes = explode(',', $poolRow['SpecimenBarcodes']);

            // set global pool properties based on first specimen of pool
            $specimenId = (int) $specimenIds[0];
            $specimen   = $specimenDAO->getInstanceFromId($specimenId);
            $poolRow['CandidateID']    = $specimen->getCandidateId();
            $poolRow['CandidatePSCID'] = $specimen->getCandidatePSCID();
            $poolRow['SessionID']      = $specimen->getSessionId();
            $poolRow['CenterID']       = $specimen->getCenterId();
            $projectId         = $specimen->getProjectId();
            $poolRow['TypeID'] = $specimen->getTypeId();

            // instantiate pool entity
            $pools[$id] = $this->_getInstanceFromSQL(
                $poolRow,
                $specimenIds,
                $specimenBarcodes,
                $projectId
            );
        }

        return $pools;
    }

    /**
     * Instantiates an ArrayIterator class that is composed of all the Pool
     * Objects
     *
     * @return \Traversable Iterator of Pool Objects
     */
    protected function getAllInstances() : \Traversable
    {
        return new \ArrayIterator($this->selectInstances());
    }

    /**
     * This function recieves a Pool Object, converts it into an SQL format
     * and inserts it into all relevant tables in the database. Certain
     * information is then cascaded to the children of the Pool.
     *
     * @param Pool $pool The Pool to be inserted into the database.
     *
     * @return Pool The pool that was inserted into the database
     */
    public function saveInstance(Pool $pool) : Pool
    {
        //Convert Pool to SQL format.
        $data = $this->_getSQLFromInstance($pool);

        $this->db->insertOnDuplicateUpdate(
            'biobank_pool',
            $data['biobank_pool']
        );

        $poolId = $pool->getId();
        if (isset($poolId)) {
            // If update:
            // Do nothing.
        } else {
            // If insert:
            $pool->setId((int) $this->db->getLastInsertId());
            // set the respective data array index to the value of the new
            // pool ID
            $specimenIds = $pool->getSpecimenIds();
            foreach ($specimenIds as $id) {
                $data['biobank_specimen_pool_rel'][$id]['PoolID'] = $pool->getId();
            }
        }

        // insert or update biobank_specimen_pool_rel with relevant data.
        foreach ($data['biobank_specimen_pool_rel'] as $insert) {
            $this->db->insertOnDuplicateUpdate(
                'biobank_specimen_pool_rel',
                $insert
            );
        }

        // XXX: decide if quantity of all pooled specimens should go to 0.
        // XXX: logic for adding preparations to pools will likely go here as well.

        return $this->getInstanceFromId($pool->getId());
    }

    /**
     * This function takes a Pool array and prepares the data to be inserted
     * into the database by converting it to a data array. This mapping is done
     * to enable the update or insertion of data into the database directly from
     * the resuling array.
     *
     * @param Pool $pool Pool array to be converted
     *
     * @return array $data Array containing the data to be inserted
     */
    private function _getSQLFromInstance(Pool $pool) : array
    {
        $poolData = [
            'PoolID'   => $pool->getId(),
            'Label'    => $pool->getLabel(),
            'Quantity' => $pool->getQuantity(),
            'UnitID'   => $pool->getUnitId(),
            'Date'     => $pool->getDate()->format('Y-m-d'),
            'Time'     => $pool->getTime()->format('H:i'),
        ];

        $specimenIds = $pool->getSpecimenIds();
        foreach ($specimenIds as $id) {
            $specimenPoolData[$id] = [
                'PoolID'     => $pool->getId(),
                'SpecimenID' => $id,
            ];
        }

        return [
            'biobank_pool'              => $poolData,
            'biobank_specimen_pool_rel' => $specimenPoolData ?? '',
        ];
    }

    /**
     * This function takes an array that resulted from an SQL query and
     * instantiates it as a Pool Object
     *
     * @param array      $data             Values to be reassigned.
     * @param array      $specimenIds      List of specimen IDs.
     * @param array      $specimenBarcodes List of specimen Barcodes.
     * @param \ProjectId $projectId        List of project IDs.
     *
     * @return Pool
     */
    private function _getInstanceFromSQL(
        array $data,
        array $specimenIds,
        array $specimenBarcodes,
        \ProjectId $projectId
    ) : Pool {
        $pool = new Pool();
        if (isset($data['PoolID'])) {
            $pool->setId((int) $data['PoolID']);
        }
        if (isset($data['Label'])) {
            $pool->setLabel((string) $data['Label']);
        }
        if (isset($data['Quantity'])) {
            $pool->setQuantity((float) $data['Quantity']);
        }
        if (isset($data['UnitID'])) {
            $pool->setUnitId((int) $data['UnitID']);
        }
        if (!empty($specimenIds)) {
            $pool->setSpecimenIds($specimenIds);
        }
        if (!empty($specimenBarcodes)) {
            $pool->setSpecimenBarcodes($specimenBarcodes);
        }
        if (isset($data['CandidateID'])) {
            $pool->setCandidateId((int) $data['CandidateID']);
        }
        if (isset($data['CandidatePSCID'])) {
            $pool->setCandidatePSCID((string) $data['CandidatePSCID']);
        }
        if (isset($data['SessionID'])) {
            $pool->setSessionId((int) $data['SessionID']);
        }
        if (isset($data['SessionID'])) {
            $pool->setSessionId((int) $data['SessionID']);
        }
        if (isset($data['TypeID'])) {
            $pool->setTypeId((int) $data['TypeID']);
        }
        if (isset($data['CenterID'])) {
            $pool->setCenterId($data['CenterID']);
        }
        if (isset($projectId)) {
            $pool->setProjectId($projectId);
        }
        if (isset($data['Date'])) {
            $pool->setDate(new \DateTime($data['Date']));
        }
        if (isset($data['Time'])) {
            $pool->setTime(new \DateTime($data['Time']));
        }

        return $pool;
    }
}
