<?php declare(strict_types=1);
/**
 * Specimen Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Specimen Object instances
 *
 * PHP Version 7.2
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
 * PHP Version 7.2
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
     * Private instance of the Database class.
     *
     * @var \Database $dao
     */
    private $db;

    /**
     * Initializes a new instance of the SpecimenDAO Class
     *
     * @param Database $db Instance of the LORIS Database class
     */
    function __construct(\Database $db)
    {
        $this->db = $db;
    }

    // XXX: I'm not sure if this function is really necessary since it is only
    // being used once, and should likely not be accessed outside this class.
    /**
     * This method is used when the DAO class needs to create a new Specimen
     * instance.
     *
     * @return Specimen
     */
    private function getInstance() : Specimen
    {
        return new Specimen();
    }

    /**
     * This will load all specimen persistence variables from the database for a
     * given $id into a Specimen object, and return the object.
     *
     * @param int $id Value of the $id for the Specimen that will be
     *                instantiated
     *
     * @return Specimen $specimen Specimen Instance.
     */
    public function getInstanceFromId(int $id) : Specimen
    {
        $specimenData      = $this->getInstanceDataFromId($id);
        $parentSpecimenIds = $this->getParentSpecimenIdsFromId($id);
        $specimen          = $this->getInstanceFromSQL($specimenData, $parentSpecimenIds);

        return $specimen;
    }

    /**
     * Queries data from the database for the Specimen at the requested ID.
     *
     * @param int $id Value of the $id for the Specimen whose data is being
     *               queried.
     *
     * @return array Specimen Data at that ID.
     */
    private function getInstanceDataFromId(int $id)
    {
        $query = "SELECT bs.SpecimenID,
                      bs.ContainerID,
                      bs.SpecimenTypeID,
                      bs.Quantity, 
                      bs.UnitID,
                      bsf.FreezeThawCycle,
                      s.CandID as CandidateID,
                      bs.SessionID, 
                      bspr.PoolID,
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
               LEFT JOIN biobank_specimen_freezethaw bsf
                 USING (SpecimenID)
               LEFT JOIN session s
                 ON bs.SessionID=s.ID
               LEFT JOIN biobank_specimen_pool_rel bspr
                 USING (SpecimenID)
               LEFT JOIN biobank_specimen_collection bsc
                 USING (SpecimenID)
               LEFT JOIN biobank_specimen_preparation bsp
                 USING (SpecimenID)
               LEFT JOIN biobank_specimen_analysis bsa
                 USING (SpecimenID)
               WHERE bs.SpecimenID=:i";
        return $this->db->pselectRow($query, array('i' => $id));
    }

    /**
     * This function returns an array of all the Parent Specimen IDs that are
     * associated with the given Specimen ID in the biobank_specimen_parent
     * table.
     *
     * @param int $id of Specimen
     *
     * @return array $parentSpecimenIds List of Specimen IDs that are
     *                                  parents of the given Specimen ID
     */
    public function getParentSpecimenIdsFromId(int $id) : array
    {
        $query = 'SELECT ParentSpecimenID
                  FROM biobank_specimen_parent
                  WHERE SpecimenID=:i';
        return $this->db->pselectcol($query, array('i' => $id));
    }

    /**
     * This will select all specimens from the database that match the
     * attribute values passed by $conditions and will return an array
     * of specimen objects.
     *
     * @param array $conditions Conditions to be met by the query
     *
     * @return array $specimens List of Specimen Objects that match the query
     */
    public function selectInstances(array $conditions = null) : array
    {
        $query  = 'SELECT SpecimenID
                  FROM biobank_specimen';
        $query .= $conditions ? ' WHERE '.$this->db->implodeWithKeys(' AND ', $conditions) : '';

        $result    = $this->db->pselect($query, array());
        $specimens = array();
        if (!empty($result)) {
            foreach ($result as $row) {
                $id       = intval($row['SpecimenID']);
                $specimen = $this->getInstanceFromId($id);
                $specimens[$id] = $specimen;
            }
        }

        return $specimens;
    }

    /**
     * Instantiates an ArrayIterator class that is composed of all the Specimen
     * Objects.
     *
     * @return traversable Iterator of Specimen Objects
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
        $types = $this->db->pselectWithIndexKey($query, array(), 'id');
        
        $query = "SELECT SpecimenTypeID as id,
                         ParentSpecimenTypeID as parentId
                  FROM biobank_specimen_type_parent";
        $result = $this->db->pselect($query, array());
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
        $protocols = $this->db->pselectWithIndexKey($query, array(), 'id');

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
        $processes = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $processes;
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
        $attributeDatatypes = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $attributeDatatypes;
    }

    /**
     * Queries all rows the biobank_reference_table table. This data is used to
     * query the referenced tables and columns and build a nested array of
     * reference table option values, with the Reference Table ID as the index.
     *
     * @return array $attributeOptions A nested array of attribute reference
     *                                 table options indexed by Reference Table
     *                                 ID
     */
    public function getAttributeReferenceTableOptions() : array
    {
        $query = 'SELECT ReferenceTableID as id,
                         TableName as tableName,
                         ColumnName as columnName
                  FROM biobank_specimen_attribute_referencetable';
        $attributeOptionsReferences = $this->db->pselect($query, array());

        $attributeOptions = array();
        foreach ($attributeOptionsReferences as $reference) {
            $query  = 'SELECT '.$reference['columnName'].' FROM '.$reference['tableName'];
            $result = $this->db->pselect($query, array());

            $options = array();
            foreach ($result as $row) {
                $options[$row[$reference['columnName']]] = $row[$reference['columnName']];
            }

            $attributeOptions[$reference['id']] = $options;
        }

        return $attributeOptions;
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
        $units = $this->db->pselectWithIndexKey($query, array(), 'id');

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
        $result    = $this->db->pselect($query, array());
        $typeUnits = array();
        foreach ($result as $row) {
            foreach ($row as $value) {
                $typeUnits[$row['typeId']][$row['unitId']]['label'] = $row['label'];
            }
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
        $query     = "SELECT SpecimenTypeID as specimenTypeId,
                          ContainerTypeID as containerTypeId
                  FROM biobank_specimen_type_container_type_rel";
        $result    = $this->db->pselect($query, array());
        $typeContainerTypes = array();
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
        $query  = "SELECT bsp.SpecimenProtocolID as protocolId,
                         bsa.SpecimenAttributeID as attributeId,
                         bsa.Label as label,
                         bsa.DatatypeID as datatypeId,
                         bsa.ReferenceTableID as refTableId,
                         bspa.Required as required
                  FROM biobank_specimen_protocol_attribute_rel bspa
                  LEFT JOIN biobank_specimen_protocol bsp
                    USING (SpecimenProtocolID)
                  LEFT JOIN biobank_specimen_attribute bsa
                    USING (SpecimenAttributeID)";
        $result = $this->db->pselect($query, array());
        $pA     = array(); //protocolAttributes
        foreach ($result as $row) {
            foreach ($row as $value) {
                $pA[$row['protocolId']][$row['attributeId']]['label']      = $row['label'];
                $pA[$row['protocolId']][$row['attributeId']]['datatypeId'] = $row['datatypeId'];
                $pA[$row['protocolId']][$row['attributeId']]['refTableId'] = $row['refTableId'];
                $pA[$row['protocolId']][$row['attributeId']]['required']   = (int) $row['required'];
            }
        }

        return $pA;
    }

    /**
     * Queries all rows from the biobank_specimen_protocol_container_type_rel
     * table and returns a nested array of specimen-protocol-specific attribute
     * data with the Protocol ID as the first index, and the Attribute ID as the
     * second index.
     *
     * @return array $pA A nested array of attribute data indexed by Protocol
     *                   ID and Attribute ID
     */
    public function getProtocolContainers() : array
    {
        $query  = "SELECT SpecimenProtocolID as protocolId,
                         ContainerTypeID as typeId
                  FROM biobank_specimen_protocol_container_type_rel";
        $result = $this->db->pselect($query, array());
        $pC     = array(); //protocolContainers
        foreach ($result as $row) {
            $type[] = $row['typeId'];
            $pC[$row['protocolId']] = $type;
        }

        return $pC;
    }

    /**
     * This function receives a Specimen Object, converts it into a SQL format
     * and inserts it into all relevant tables in the database.
     *
     * @param Specimen $specimen The Specimen Object to be saved the
     *                           database.
     *
     * @return void
     */
    public function saveInstance(Specimen $specimen) : int
    {
        // Converts Specimen Object into SQL format.
        $data = $this->getSQLFromInstance($specimen);

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
            foreach ($parentSpecimenIds as $id) {
                $data['biobank_specimen_parent'][$id]
                = array(
                   'SpecimenID'       => $specimen->getId(),
                   'ParentSpecimenID' => $id,
                  );
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
        if (isset($data['biobank_specimen_analysis']['SpecimenMethodID'])) {
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

        return $specimen->getId();
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
    private function getSQLFromInstance(Specimen $specimen) : array
    {
        $specimenData = array(
                         'SpecimenID'     => $specimen->getId(),
                         'ContainerID'    => $specimen->getContainerId(),
                         'SpecimenTypeID' => $specimen->getTypeId(),
                         'Quantity'       => $specimen->getQuantity(),
                         'UnitID'         => $specimen->getUnitId(),
                         'SessionID'      => $specimen->getSessionId(),
                        );

        $freezeThawData = array(
                           'SpecimenID'      => $specimen->getId(),
                           'FreezeThawCycle' => $specimen->getFTCycle(),
                          );

        $collection     = $specimen->getCollection();
        $collectionData = array(
                           'SpecimenID'         => $specimen->getId(),
                           'SpecimenProtocolID' => $collection->getProtocolId(),
                           'Quantity'           => $collection->getQuantity(),
                           'UnitID'             => $collection->getUnitId(),
                           'CenterID'           => $collection->getCenterId(),
                           'ExaminerID'         => $collection->getExaminerId(),
                           'Date'               => $collection->getDate()->format('Y-m-d H:i'),
                           'Time'               => $collection->getTime()->format('Y-m-d H:i'),
                           'Comments'           => $collection->getComments(),
                          );
        if ($collection->getData()) {
            $collectionData['Data'] = json_encode($collection->getData());
        }

        $preparation = $specimen->getPreparation();
        if (isset($preparation)) {
            $preparationData = array(
                                'SpecimenID'         => $specimen->getId(),
                                'SpecimenProtocolID' => $preparation->getProtocolId(),
                                'CenterID'           => $preparation->getCenterId(),
                                'ExaminerID'         => $preparation->getExaminerId(),
                                'Date'               => $preparation->getDate()->format('Y-m-d H:i'),
                                'Time'               => $preparation->getTime()->format('Y-m-d H:i'),
                                'Comments'           => $preparation->getComments(),
                               );

            if ($preparation->getData()) {
                $preparationData['Data'] = json_encode($preparation->getData());
            }
        }

        $analysis = $specimen->getAnalysis();
        if (isset($analysis)) {
            $analysisData = array(
                             'SpecimenID'         => $specimen->getId(),
                             'SpecimenProtocolID' => $analysis->getProtocolId(),
                             'CenterID'           => $analysis->getCenterId(),
                             'ExaminerID'         => $analysis->getExaminerId(),
                             'Date'               => $analysis->getDate()->format('Y-m-d H:i'),
                             'Time'               => $analysis->getTime()->format('Y-m-d H:i'),
                             'Comments'           => $analysis->getComments(),
                            );

            if ($analysis->getData()) {
                $analysisData['Data'] = json_encode($analysis->getData());
            }
        }

        return $data = array(
                        'biobank_specimen'             => $specimenData,
                        'biobank_specimen_freezethaw'  => $freezeThawData,
                        'biobank_specimen_collection'  => $collectionData,
                        'biobank_specimen_preparation' => $preparationData,
                        'biobank_specimen_analysis'    => $analysisData,
                       );
    }

    /**
     * This function takes an array that resulted from an SQL query and
     * instantiates it as a Specimen Object.
     *
     * @param array $data              Values to be converted to array.
     * @param array $parentSpecimenIds IDs of the parent Specimen.
     *
     * @return Specimen 
     */
    private function getInstanceFromSQL(array $data, array $parentSpecimenIds) : Specimen
    {
        $specimen = $this->getInstance();
        isset($data['SpecimenID'])      && $specimen->setId((int) $data['SpecimenID']);
        isset($data['ContainerID'])     && $specimen->setContainerId((int) $data['ContainerID']);
        isset($data['SpecimenTypeID'])  && $specimen->setTypeId((int) $data['SpecimenTypeID']);
        isset($data['Quantity'])        && $specimen->setQuantity((string) $data['Quantity']);
        isset($data['UnitID'])          && $specimen->setUnitId((int) $data['UnitID']);
        isset($data['FreezeThawCycle']) && $specimen->setFTCycle((int) $data['FreezeThawCycle']);
        !empty($parentSpecimenIds)      && $specimen->setParentSpecimenIds(!empty($parentSpecimenIds) ? $parentSpecimenIds : null);
        isset($data['CandidateID'])     && $specimen->setCandidateId((int) $data['CandidateID']);
        isset($data['SessionID'])       && $specimen->setSessionId((int) $data['SessionID']);
        isset($data['PoolID'])          && $specimen->setPoolId((int) $data['PoolID']);

        $collection = new Collection();
        isset($data['CollectionProtocolID']) && $collection->setProtocolId((int) $data['CollectionProtocolID']);
        isset($data['CollectionQuantity'])   && $collection->setQuantity((string) $data['CollectionQuantity']);
        isset($data['CollectionUnitID'])     && $collection->setUnitId((int) $data['CollectionUnitID']);
        isset($data['CollectionCenterID'])   && $collection->setCenterId((int) $data['CollectionCenterID']);
        isset($data['CollectionExaminerID']) && $collection->setExaminerId((int) $data['CollectionExaminerID']);
        isset($data['CollectionDate'])       && $collection->setDate(new \DateTime($data['CollectionDate']));
        isset($data['CollectionTime'])       && $collection->setTime(new \DateTime($data['CollectionTime']));
        isset($data['CollectionComments'])   && $collection->setComments((string) $data['CollectionComments']);
        isset($data['CollectionData'])       && $collection->setData(json_decode($data['CollectionData'], true));
        $specimen->setCollection($collection);

        // XXX: These checks for instantiating $prepartion and $analysis are not
        // the best. Perhaps they should be queried separately and it should be
        // checked whether or not the array itself exists.
        $preparation = new Preparation();
        if ($data['PreparationProtocolID']) {
            isset($data['PreparationProtocolID']) && $preparation->setProtocolId((int) $data['PreparationProtocolID']);
            isset($data['PreparationCenterID'])   && $preparation->setCenterId((int) $data['PreparationCenterID']);
            isset($data['PreparationExaminerID']) && $preparation->setExaminerId((int) $data['PreparationExaminerID']);
            isset($data['PreparationDate'])       && $preparation->setDate(new \DateTime($data['PreparationDate']));
            isset($data['PreparationTime'])       && $preparation->setTime(new \DateTime($data['PreparationTime']));
            isset($data['PreparationComments'])   && $preparation->setComments((string) $data['PreparationComments']);
            isset($data['PreparationData'])       && $preparation->setData(json_decode($data['PreparationData'], true));
            $specimen->setPreparation($preparation);
        }

        if ($data['AnalysisProtocolID']) {
            $analysis = new Analysis();
            isset($data['AnalysisProtocolID']) && $analysis->setProtocolId((int) $data['AnalysisProtocolID']);
            isset($data['AnalysisCenterID'])   && $analysis->setCenterId((int) $data['AnalysisCenterID']);
            isset($data['AnalysisExaminerID']) && $analysis->setExaminerId((int) $data['AnalysisExaminerID']);
            isset($data['AnalysisDate'])       && $analysis->setDate(new \DateTime($data['AnalysisDate']));
            isset($data['AnalysisTime'])       && $analysis->setTime(new \DateTime($data['AnalysisTime']));
            isset($data['AnalysisComments'])   && $analysis->setComments((string) $data['AnalysisComments']);
            isset($data['AnalysisData'])       && $analysis->setData(json_decode($data['AnalysisData'], true));
            $specimen->setAnalysis($analysis);
        }

        return $specimen;
    }
}
