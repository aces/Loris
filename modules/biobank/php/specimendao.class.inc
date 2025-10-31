<?php declare(strict_types=1);

/**
 * Specimen Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Specimen Object instances
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
 * Specimen Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Specimen Object instances
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
class SpecimenDAO extends \LORIS\Data\ProvisionerInstance
{
    /**
     * The LORIS instance
     *
     * @var \LORIS\LORISInstance $loris
     * @var \Database $db
     */
    private $loris;
    private $db;

    /**
     * Initializes a new instance of the SpecimenDAO Class
     *
     * @param \LORIS\LorisInstance $loris Instance of the LORIS Database class
     */
    function __construct(\LORIS\LORISInstance $loris)
    {
        $this->loris = $loris;
        $this->db    = $loris->getDatabaseConnection();
    }

    /**
     * This will load all specimen persistence variables from the database for a
     * given $id into a Specimen object, and return the object.
     *
     * @param int $id Value of the $id for the Specimen that will be
     *                instantiated
     *
     * @return ?Specimen $specimen Specimen Instance.
     */
    public function getInstanceFromId(int $id) : ?Specimen
    {
        return $this->selectInstances(
            [['column'=>'bs.SpecimenID', 'value'=>$id]]
        )[$id];
    }

    /**
     * This function returns an array of all the Parent Specimen IDs that are
     * associated with the given Specimen ID in the biobank_specimen_parent
     * table.
     *
     * @param int $id Specimen ID
     *
     * @return array $parentSpecimenIds List of Specimen IDs that are
     *                                  parents of the given Specimen ID
     */
    public function getParentSpecimenIdsFromId(int $id) : array
    {
        $query = 'SELECT ParentSpecimenID
                  FROM biobank_specimen_parent
                  WHERE SpecimenID=:i';
        return $this->db->pselectcol($query, ['i' => $id]);
    }

    /**
     * This will select all specimens from the database that match the
     * attribute values passed by $conditions and will return an array
     * of specimen objects.
     *
     * @param ?array $conditions Conditions to be met by the query
     * @param string $operator   Operator to link the conditions. "AND" or "OR".
     *
     * @return array $specimens List of Specimen Objects that match the query
     */
    public function selectInstances(
        ?array $conditions = [],
        string $operator = 'AND'
    ) : array {
        $query = "SELECT
                      bs.SpecimenID,
                      bs.ContainerID,
                      bc.Barcode,
                      LPAD(bs.SampleNumber, 3, '0') AS SampleNumber,
                      bs.SpecimenTypeID,
                      bs.Quantity,
                      bs.UnitID,
                      bc.CenterID,
                      s.ProjectID,
                      bsf.FreezeThawCycle,
                      GROUP_CONCAT(DISTINCT bspa.ParentSpecimenID)
                        as ParentSpecimenIDs,
                      GROUP_CONCAT(DISTINCT bc2.Barcode)
                        as ParentSpecimenBarcodes,
                      s.CandidateID,
                      c.PSCID as CandidatePSCID,
                      bs.SessionID,
                      s.CenterID as SessionCenterID,
                      (
                        SELECT FLOOR(DATEDIFF(s.Date_visit, c.DoB)/365.25)
                      ) as CandidateAge,
                      bspor.PoolID,
                      bsc.SpecimenProtocolID as CollectionProtocolID,
                      bsc.Quantity as CollectionQuantity,
                      bsc.UnitID as CollectionUnitID,
                      bsc.CenterID as CollectionCenterID,
                      bsc.ExaminerID as CollectionExaminerID,
                      bsc.Date as CollectionDate,
                      bsc.Time as CollectionTime,
                      bsc.Comments as CollectionComments,
                      bsc.Data as CollectionData,
                      bsp.SpecimenProtocolID as PreparationProtocolID,
                      bsp.CenterID as PreparationCenterID,
                      bsp.ExaminerID as PreparationExaminerID,
                      bsp.Date as PreparationDate,
                      bsp.Time as PreparationTime,
                      bsp.Comments as PreparationComments,
                      bsp.Data as PreparationData,
                      bsa.SpecimenProtocolID as AnalysisProtocolID,
                      bsa.CenterID as AnalysisCenterID,
                      bsa.ExaminerID as AnalysisExaminerID,
                      bsa.Date as AnalysisDate,
                      bsa.Time as AnalysisTime,
                      bsa.Comments as AnalysisComments,
                      bsa.Data as AnalysisData
               FROM biobank_specimen bs
               INNER JOIN biobank_container bc
                 ON bs.ContainerID=bc.ContainerID
               LEFT JOIN biobank_specimen_freezethaw bsf
                 ON bs.SpecimenID=bsf.SpecimenID
               LEFT JOIN session s
                 ON bs.SessionID=s.ID
               LEFT JOIN candidate c
                 ON s.CandidateID=c.ID
               LEFT JOIN biobank_specimen_pool_rel bspor
                 ON bs.SpecimenID=bspor.SpecimenID
               LEFT JOIN biobank_specimen_collection bsc
                 ON bs.SpecimenID=bsc.SpecimenID
               LEFT JOIN biobank_specimen_preparation bsp
                 ON bs.SpecimenID=bsp.SpecimenID
               LEFT JOIN biobank_specimen_analysis bsa
                 ON bs.SpecimenID=bsa.SpecimenID
               LEFT JOIN biobank_specimen_parent bspa
                 ON bs.SpecimenID=bspa.SpecimenID
               LEFT JOIN biobank_specimen bs2
                 ON bspa.ParentSpecimenID=bs2.SpecimenID
               LEFT JOIN biobank_container bc2
                ON bs2.ContainerID=bc2.ContainerID";
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
        $query       .= " GROUP BY bs.SpecimenID";
        $specimenRows = $this->db->pselectWithIndexKey($query, [], 'SpecimenID');
        $specimens    = [];
        foreach ($specimenRows as $id => $specimenRow) {
            $specimens[$id] = $this->_getInstanceFromSQL($specimenRow);
        }

        return $specimens;
    }

    /**
     * Instantiates an ArrayIterator class that is composed of all the Specimen
     * Objects.
     *
     * @return \Traversable Iterator of Specimen Objects
     */
    protected function getAllInstances() : \Traversable
    {
        return new \ArrayIterator($this->selectInstances());
    }

    /**
     * Queries all rows of the biobank_specimen_type table and returns a nested
     * array with the ID field as the index.
     *
     * @return array $types All data concerning each specimen type
     */
    public function getTypes() : array
    {
        $query = "SELECT SpecimenTypeID as id,
                         Label as label,
                         FreezeThaw as freezeThaw
                  FROM biobank_specimen_type";
        $types = $this->db->pselectWithIndexKey($query, [], 'id');

        $query  = "SELECT SpecimenTypeID as id,
                         ParentSpecimenTypeID as parentId
                  FROM biobank_specimen_type_parent";
        $result = $this->db->pselect($query, []);
        foreach ($result as $row) {
            $types[$row['id']]['parentTypeIds'][] = $row['parentId'];
        }

        return $types;
    }

    /**
     * Queries all rows of the biobank_specimen_protocol table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $protocols All data concerning each specimen
     *                          protocol.
     */
    public function getProtocols() : array
    {
        $query     = "SELECT SpecimenProtocolID as id,
                         Label as label,
                         SpecimenProcessID as processId,
                         SpecimenTypeID as typeId
                  FROM biobank_specimen_protocol";
        $protocols = $this->db->pselectWithIndexKey($query, [], 'id');

        return $protocols;
    }

    /**
     * Queries all rows of the biobank_specimen_process table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $processes All data concerning each specimen
     *                          process.
     */
    public function getProcesses() : array
    {
        $query     = "SELECT SpecimenProcessID as id,
                         Label as label
                      FROM biobank_specimen_process";
        $processes = $this->db->pselectWithIndexKey($query, [], 'id');

        return $processes;
    }

    /**
     * Queries all rows of the biobank_specimen_attribute table and returns an
     * array with the ID field as the index
     *
     * @return array $attributes All data concerning each attribute
     */
    public function getAttributes() : array
    {
        $query      = 'SELECT SpecimenAttributeID as id,
                         Label as label,
                         DatatypeId as datatypeId
                  FROM biobank_specimen_attribute';
        $attributes = $this->db->pselectWithIndexKey($query, [], 'id');

        return $attributes;
    }

    /**
     * Queries all rows of the biobank_datatype table and returns a nested array
     * with the ID field as the index
     *
     * @return array $attributeDatatypes All data concerning each attribute datatype
     */
    public function getAttributeDatatypes() : array
    {
        $query = 'SELECT DatatypeID as id,
                         Datatype as datatype
                  FROM biobank_specimen_attribute_datatype';
        $attributeDatatypes = $this->db->pselectWithIndexKey($query, [], 'id');

        return $attributeDatatypes;
    }

    // XXX: This should potentially be queried from a table called
    // `biobank_specimen_units` since containers are not currently using units.
    // Discussions need to be had with Rida regarding this.

    /**
     * Queries all rows of the biobank_unit table and returns a nested
     * array with the ID field as the index.
     *
     * @return array $specimenUnits All data concerning each unit
     */
    public function getUnits() : array
    {
        $query = "SELECT UnitID as id,
                         Label as label
                  FROM biobank_unit";
        $units = $this->db->pselectWithIndexKey($query, [], 'id');

        return $units;
    }

    /**
     * Queries all rows of the biobank_specimen_type_unit_rel table and returns
     * a nested array of specimen unit values, with the Type ID as the first index,
     * and the Unit ID as the second index.
     *
     * @return array $typeUnits A nested array of unit values index by
     *                                  Type ID and Unit ID
     */
    public function getTypeUnits() : array
    {
        $query     = "SELECT bst.SpecimenTypeID as typeId,
                          bu.UnitID as unitId,
                          bu.Label as label
                  FROM biobank_specimen_type_unit_rel bstu
                  JOIN biobank_specimen_type bst USING (SpecimenTypeID)
                  JOIN biobank_unit bu USING (UnitID)";
        $result    = $this->db->pselect($query, []);
        $typeUnits = [];
        foreach ($result as $row) {
            $typeUnits[$row['typeId']][$row['unitId']]['label'] = $row['label'];
        }

        return $typeUnits;
    }

    /**
     * Queries all rows of the biobank_specimen_type_container_type_rel table
     * and returns a nested array of container type value, with the specimen
     * Type ID as the index.
     *
     * @return array $typeContainerTypes A nested array of container type values
     *                                   indexex by Specimen Type ID.
     */
    public function getTypeContainerTypes() : array
    {
        $query  = "SELECT SpecimenTypeID as specimenTypeId,
                          ContainerTypeID as containerTypeId
                  FROM biobank_specimen_type_container_type_rel";
        $result = $this->db->pselect($query, []);
        $typeContainerTypes = [];
        foreach ($result as $row) {
            $typeContainerTypes[$row['specimenTypeId']][] = $row['containerTypeId'];
        }

        return $typeContainerTypes;
    }

    /**
     * Queries all rows from the biobank_specimen_protocol_attribute_rel table
     * and returns a nested array of specimen-protocol-specific attribute data
     * with the Protocol ID as the first index, and the Attribute ID as the
     * second index.
     *
     * @return array $pA A nested array of attribute data indexed by Protocol
     *                    ID and Attribute ID
     */
    public function getProtocolAttributes() : array
    {
        $query = "
            SELECT 
                bsp.SpecimenProtocolID as protocolId,
                bsa.SpecimenAttributeID as attributeId,
                bsa.Label as label,
                bsa.DatatypeID as datatypeId,
                bspa.Required as required,
                bspa.ShowInDataTable as showInDataTable,
                bspa.OrderIndex as orderIndex
            FROM biobank_specimen_protocol_attribute_rel bspa
            LEFT JOIN biobank_specimen_protocol bsp
                USING (SpecimenProtocolID)
            LEFT JOIN biobank_specimen_attribute bsa
                USING (SpecimenAttributeID)
            ORDER BY bsp.SpecimenProtocolID, bspa.OrderIndex
        ";

        $result = $this->db->pselect($query, []);
        $protocolAttributes = [];

        foreach ($result as $row) {
            $protocolId = $row['protocolId'];
            // Ensure the protocol exists in the array
            if (!isset($protocolAttributes[$protocolId])) {
                $protocolAttributes[$protocolId] = [];
            }

            // Add the attribute data, keeping the order intact
            $protocolAttributes[$protocolId][] = [
                'id'              => $row['attributeId'],
                'label'           => $row['label'],
                'datatypeId'      => $row['datatypeId'],
                'required'        => (int) $row['required'],
                'showInDataTable' => (int) $row['showInDataTable'],
                'orderIndex'      => (int) $row['orderIndex'],
            ];
        }

        return $protocolAttributes;
    }

    /**
     * Queries all rows from the biobank_specimen_protocol_attribute_rel table
     * and returns a nested array of specimen-protocol-specific attribute data
     * with the Protocol ID as the first index, and the Attribute ID as the
     * second index.
     *
     * @return array $pA A nested array of attribute data indexed by Protocol
     *                    ID and Attribute ID
     */
    public function getProcessAttributes() : array
    {
        $query  = "SELECT bsp.SpecimenProtocolID as protocolId,
                          bsp.SpecimenProcessID as processId,
                         bsa.SpecimenAttributeID as attributeId,
                         bsa.Label as label,
                         bsa.DatatypeID as datatypeId,
                         bspa.Required as required,
                         bspa.ShowInDataTable as showInDataTable
                  FROM biobank_specimen_protocol_attribute_rel bspa
                  LEFT JOIN biobank_specimen_protocol bsp
                    USING (SpecimenProtocolID)
                  LEFT JOIN biobank_specimen_attribute bsa
                    USING (SpecimenAttributeID)";
        $result = $this->db->pselect($query, []);
        $pA     = []; //processAttributes
        foreach ($result as $row) {
            if ($row['showInDataTable']) {
                if (!isset($pA[$row['processId']][$row['attributeId']])) {
                    $pA[$row['processId']][$row['attributeId']] = [];
                }
                $attrib =& $pA[$row['processId']][$row['attributeId']] ?? [];
                $attrib['protocolIds'][] = $row['protocolId'];
            }
        }

        return $pA;
    }

    /**
     * This function receives a Specimen Object, converts it into a SQL format
     * and inserts it into all relevant tables in the database.
     *
     * @param Specimen $specimen The Specimen Object to be saved the
     *                           database.
     *
     * @throws \InvalidArgumentException If required data is missing or invalid.
     *
     * @return ?Specimen $specimen The Specimen Object that was saved
     *                            to the database.
     */
    public function saveInstance(Specimen $specimen) : ?Specimen
    {
        // Converts Specimen Object into SQL format.
        $data = $this->_getSQLFromInstance($specimen);

        // Inserts or Updates the biobank_specimen table with respective data.
        $this->db->insertOnDuplicateUpdate(
            'biobank_specimen',
            $data['biobank_specimen']
        );

        $specimenId = $specimen->getId();
        if (isset($specimenId)) {
            // If update:
            // Do nothing.
        } else {
            // If insert:
            $specimen->setId((int) $this->db->getLastInsertId());
            // set the respective data array index to the value of the new
            // specimen ID
            $parentSpecimenIds = $specimen->getParentSpecimenIds();
            if (!empty($parentSpecimenIds)) {
                foreach ($parentSpecimenIds as $id) {
                    $data['biobank_specimen_parent'][$id] = [
                        'SpecimenID'       => $specimen->getId(),
                        'ParentSpecimenID' => $id,
                    ];
                }
            }
            $data['biobank_specimen_freezethaw']['SpecimenID']  = $specimen->getId();
            $data['biobank_specimen_collection']['SpecimenID']  = $specimen->getId();
            $data['biobank_specimen_preparation']['SpecimenID'] = $specimen->getId();
            $data['biobank_specimen_analysis']['SpecimenID']    = $specimen->getId();
        }

        // Insert or update biobank_specimen_collection with respective data.
        $this->db->unsafeInsertOnDuplicateUpdate(
            'biobank_specimen_collection',
            $data['biobank_specimen_collection']
        );

        // If protocol exists, insert or update biobank_specimen_preparation
        // with respective data.
        if (isset($data['biobank_specimen_preparation']['SpecimenProtocolID'])) {
            $this->db->unsafeInsertOnDuplicateUpdate(
                'biobank_specimen_preparation',
                $data['biobank_specimen_preparation']
            );
        }

        // If method exists, insert or update biobank_specimen_analysis
        // with respective data.
        if (isset($data['biobank_specimen_analysis']['SpecimenProtocolID'])) {
            $this->db->unsafeInsertOnDuplicateUpdate(
                'biobank_specimen_analysis',
                $data['biobank_specimen_analysis']
            );
        }

        // If parent exists, insert or update biobank_specimen_parent
        // with respective data.
        if (isset($data['biobank_specimen_parent'])) {
            foreach ($data['biobank_specimen_parent'] as $insert) {
                $this->db->insertOnDuplicateUpdate(
                    'biobank_specimen_parent',
                    $insert
                );
            }
        }

        // If F/T Cycle exists, insert or update biobank_specimen_freezethaw
        // with respective data.
        $fTCycle = $specimen->getFTCycle();
        if (isset($fTCycle)) {
            $this->db->insertOnDuplicateUpdate(
                'biobank_specimen_freezethaw',
                $data['biobank_specimen_freezethaw']
            );
        }

        return $this->getInstanceFromId($specimen->getId());
    }

    /**
     * Generates a new sample number for the specimen.
     *
     * @param int $candId - The candidate for which to generate the sample number
     *
     * @return int The sample number of the specimen
     */
    private function _getSampleNumber(int $candId)
    {
        // Query to get the maximum SampleNumber for the given candidate
        $query = "
            SELECT IFNULL(MAX(bs.SampleNumber), 0) AS max_sample_number
            FROM biobank_specimen bs
            JOIN session s ON bs.SessionID = s.ID
            WHERE s.CandidateID = :candId
        ";

        $sampleNumber = $this->db->pselectOneInt($query, ['candId' => $candId]);

        return $sampleNumber + 1;
    }

    /**
     * This function takes a Specimen Instance and prepares the data to be
     * inserted into the database by converting it to a data array. This one to
     * one mapping is done to enable the update or insertion of data into the
     * database directly from the resulting arrays.
     *
     * @param Specimen $specimen Specimen Instance to be converted
     *
     * @return array $data Array containing the data to be inserted
     */
    private function _getSQLFromInstance(Specimen $specimen) : array
    {
        $specimenData = [
            'SpecimenID'     => $specimen->getId(),
            'ContainerID'    => $specimen->getContainerId(),
            'SpecimenTypeID' => $specimen->getTypeId(),
            'Quantity'       => $specimen->getQuantity(),
            'UnitID'         => $specimen->getUnitId(),
            'SessionID'      => $specimen->getSessionId(),
        ];

        // I'd prefer a better way of doing this, but for now this is the simplest
        // way to ensure that the Sample Number does NOT get updated.
        if ($specimen->getId() == null) {
            $sampleNumber = $this->_getSampleNumber($specimen->getCandidateId());
            $specimenData['SampleNumber'] = $sampleNumber;
        } else {
            $specimenData['SampleNumber'] = $specimen->getSampleNumber();
        }

        $freezeThawData = [
            'SpecimenID'      => $specimen->getId(),
            'FreezeThawCycle' => $specimen->getFTCycle(),
        ];

        $collection     = $specimen->getCollection();
        $collectionData = [
            'SpecimenID'         => $specimen->getId(),
            'SpecimenProtocolID' => $collection->getProtocolId(),
            'Quantity'           => $collection->getQuantity(),
            'UnitID'             => $collection->getUnitId(),
            'CenterID'           => $collection->getCenterId(),
            'ExaminerID'         => $collection->getExaminerId(),
            'Date'               => $collection->getDate()->format('Y-m-d H:i'),
            'Time'               => $collection->getTime()->format('Y-m-d H:i'),
            'Comments'           => $collection->getComments(),
        ];
        $collectionData['Data'] = !empty($collection->getData()) ?
            json_encode($collection->getData()) : null;

        $preparation     = $specimen->getPreparation();
        $preparationData = [];
        if (isset($preparation)) {
            $preparationData = [
                'SpecimenID'         => $specimen->getId(),
                'SpecimenProtocolID' => $preparation->getProtocolId(),
                'CenterID'           => $preparation->getCenterId(),
                'ExaminerID'         => $preparation->getExaminerId(),
                'Date'               => $preparation->getDate()->format('Y-m-d H:i'),
                'Time'               => $preparation->getTime()->format('Y-m-d H:i'),
                'Comments'           => $preparation->getComments(),
            ];

            $preparationData['Data'] = !empty($preparation->getData()) ?
                json_encode($preparation->getData()) : null;
        }

        $analysis     = $specimen->getAnalysis();
        $analysisData = [];
        if (isset($analysis)) {
            $analysisData = [
                'SpecimenID'         => $specimen->getId(),
                'SpecimenProtocolID' => $analysis->getProtocolId(),
                'CenterID'           => $analysis->getCenterId(),
                'ExaminerID'         => $analysis->getExaminerId(),
                'Date'               => $analysis->getDate()->format('Y-m-d H:i'),
                'Time'               => $analysis->getTime()->format('Y-m-d H:i'),
                'Comments'           => $analysis->getComments(),
            ];

            if ($analysis->getData()) {
                $analysisData['Data'] = json_encode($analysis->getData());
            }
            $analysisData['Data'] = !empty($analysis->getData()) ?
                json_encode($analysis->getData()) : null;
        }

        return [
            'biobank_specimen'             => $specimenData,
            'biobank_specimen_freezethaw'  => $freezeThawData,
            'biobank_specimen_collection'  => $collectionData,
            'biobank_specimen_preparation' => $preparationData,
            'biobank_specimen_analysis'    => $analysisData,
        ];
    }

    /**
     * This function takes an array that resulted from an SQL query and
     * instantiates it as a Specimen Object.
     *
     * @param array $data Values to be converted to array.
     *
     * @return Specimen
     */
    private function _getInstanceFromSQL(
        array $data,
    ) : Specimen {
        $specimen = new Specimen($this->loris);
        if (isset($data['SpecimenID'])) {
            $specimen->setId((int) $data['SpecimenID']);
        }
        if (isset($data['ContainerID'])) {
            $specimen->setContainerId((int) $data['ContainerID']);
        }
        if (isset($data['Barcode'])) {
            $specimen->setBarcode((string) $data['Barcode']);
        }
        if (isset($data['SampleNumber'])) {
            $specimen->setSampleNumber((string) $data['SampleNumber']);
        }
        if (isset($data['SpecimenTypeID'])) {
            $specimen->setTypeId((int) $data['SpecimenTypeID']);
        }
        if (isset($data['Quantity'])) {
            $specimen->setQuantity((string) $data['Quantity']);
        }
        if (isset($data['UnitID'])) {
            $specimen->setUnitId((int) $data['UnitID']);
        }
        if (isset($data['CenterID'])) {
            $specimen->setCenterId(new \CenterID((string) $data['CenterID']));
        }
        if (isset($data['ProjectID'])) {
            $specimen->setProjectId(new \ProjectID((string) $data['ProjectID']));
        }
        if (isset($data['FreezeThawCycle'])) {
            $specimen->setFTCycle((int) $data['FreezeThawCycle']);
        }
        if (!empty($data['ParentSpecimenIDs'])) {
            $parentSpecimenIds = explode(',', $data['ParentSpecimenIDs']);
            $specimen->setParentSpecimenIds($parentSpecimenIds);
        } else {
            $specimen->setParentSpecimenIds([]);
        }
        if (!empty($data['ParentSpecimenBarcodes'])) {
            $parentSpecimenBarcodes = explode(',', $data['ParentSpecimenBarcodes']);
            $specimen->setParentSpecimenBarcodes($parentSpecimenBarcodes);
        } else {
            $specimen->setParentSpecimenBarcodes([]);
        }
        if (isset($data['CandidateID'])) {
            $specimen->setCandidateId((int) $data['CandidateID']);
        }
        if (isset($data['CandidatePSCID'])) {
            $specimen->setCandidatePSCID((string) $data['CandidatePSCID']);
        }

        if (isset($data['CandidateAge'])) {
            $specimen->setCandidateAge((int) $data['CandidateAge']);
        }
        if (isset($data['SessionID'])) {
            $specimen->setSessionId((int) $data['SessionID']);
        }
        if (isset($data['SessionID'])) {
            $specimen->setSessionCenterId(
                new \CenterID(
                    (string) $data['SessionCenterID']
                )
            );
        }
        if (isset($data['PoolID'])) {
            $specimen->setPoolId((int) $data['PoolID']);
        }

        $collection = new Collection();
        if (isset($data['CollectionProtocolID'])) {
            $collection->setProtocolId(
                (int) $data['CollectionProtocolID']
            );
        }
        if (isset($data['CollectionQuantity'])) {
            $collection->setQuantity(
                (string) $data['CollectionQuantity']
            );
        }
        if (isset($data['CollectionUnitID'])) {
            $collection->setUnitId(
                (int) $data['CollectionUnitID']
            );
        }
        if (isset($data['CollectionCenterID'])) {
            $collection->setCenterId((int) $data['CollectionCenterID']);
        }
        if (isset($data['CollectionExaminerID'])) {
            $collection->setExaminerId((int) $data['CollectionExaminerID']);
        }
        if (isset($data['CollectionDate'])) {
            $collection->setDate(new \DateTime($data['CollectionDate']));
        }
        if (isset($data['CollectionTime'])) {
            $collection->setTime(
                new \DateTime($data['CollectionTime'])
            );
        }
        if (isset($data['CollectionComments'])) {
            $collection->setComments(
                (string) $data['CollectionComments']
            );
        }
        if (isset($data['CollectionData'])) {
            $collection->setData(
                json_decode($data['CollectionData'], true)
            );
        }
        $specimen->setCollection($collection);

        // XXX: These checks for instantiating $prepartion and $analysis are not
        // the best. Perhaps they should be queried separately and it should be
        // checked whether or not the array itself exists.
        $preparation = new Preparation();
        if ($data['PreparationProtocolID']) {
            if (isset($data['PreparationProtocolID'])) {
                $preparation->setProtocolId(
                    (int) $data['PreparationProtocolID']
                );
            }
            if (isset($data['PreparationCenterID'])) {
                $preparation->setCenterId(
                    (int) $data['PreparationCenterID']
                );
            }
            if (isset($data['PreparationExaminerID'])) {
                $preparation->setExaminerId(
                    (int) $data['PreparationExaminerID']
                );
            }
            if (isset($data['PreparationDate'])) {
                $preparation->setDate(
                    new \DateTime($data['PreparationDate'])
                );
            }
            if (isset($data['PreparationTime'])) {
                $preparation->setTime(
                    new \DateTime($data['PreparationTime'])
                );
            }
            if (isset($data['PreparationComments'])) {
                $preparation->setComments(
                    (string) $data['PreparationComments']
                );
            }
            if (isset($data['PreparationData'])) {
                $preparation->setData(
                    json_decode($data['PreparationData'], true)
                );
            }
            $specimen->setPreparation($preparation);
        }

        if ($data['AnalysisProtocolID']) {
            $analysis = new Analysis();
            if (isset($data['AnalysisProtocolID'])) {
                $analysis->setProtocolId((int) $data['AnalysisProtocolID']);
            }
            if (isset($data['AnalysisCenterID'])) {
                $analysis->setCenterId((int) $data['AnalysisCenterID']);
            }
            if (isset($data['AnalysisExaminerID'])) {
                $analysis->setExaminerId((int) $data['AnalysisExaminerID']);
            }
            if (isset($data['AnalysisDate'])) {
                $analysis->setDate(new \DateTime($data['AnalysisDate']));
            }
            if (isset($data['AnalysisTime'])) {
                $analysis->setTime(new \DateTime($data['AnalysisTime']));
            }
            if (isset($data['AnalysisComments'])) {
                $analysis->setComments((string) $data['AnalysisComments']);
            }
            if (isset($data['AnalysisData'])) {
                $analysis->setData(json_decode($data['AnalysisData'], true));
            }
            $specimen->setAnalysis($analysis);
        }

        return $specimen;
    }
}
