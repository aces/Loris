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
     * Global variable $db
     *
     * @access private
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
        $specimenArray     = $this->getArrayFromSQL($specimenData, $parentSpecimenIds);
        $specimen          = $this->getInstanceFromArray($specimenArray);

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
        // TODO: query date and time format to know how to query them from the
        // database.
        $query = "SELECT bs.SpecimenID,
                      bs.ContainerID,
                      bs.SpecimenTypeID,
                      bs.Quantity, 
                      bs.UnitID,
                      bsf.FreezeThawCycle,
                      s.CandID as CandidateID,
                      bs.SessionID, 
                      bspr.PoolID,
                      bsc.Quantity as CollectionQuantity,
                      bsc.UnitID as CollectionUnitID, 
                      bsc.CenterID as CollectionCenterID,
                      bsc.Date as CollectionDate, 
                      DATE_FORMAT(bsc.Time, '%H:%i') as CollectionTime,
                      bsc.Comments as CollectionComments, 
                      bsc.Data as CollectionData,
                      bsp.SpecimenProtocolID, 
                      bsp.CenterID as PreparationCenterID,
                      bsp.Date as PreparationDate,
                      DATE_FORMAT(bsp.Time, '%H:%i') as PreparationTime,
                      bsp.Comments as PreparationComments,
                      bsp.Data as PreparationData,
                      bsa.SpecimenMethodID,
                      bsa.CenterID as AnalysisCenterID,
                      bsa.Date as AnalysisDate, 
                      DATE_FORMAT(bsa.Time, '%H:%i') as AnalysisTime,
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

    // XXX: Currently this function is never used with any conditions passed as
    // parameters. Decide if this is a necessary feature. It is likely useful
    // but I need to figure out how to integrate it with the dataprovisioner.
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
     * @return array $specimenTypes All data concerning each specimen type
     */
    public function getTypes() : array
    {
        $query = "SELECT SpecimenTypeID as id,
                         Label as type,
                         ParentSpecimenTypeID as parentTypeId,
                         FreezeThaw as freezeThaw,
                         Regex as regex
                  FROM biobank_specimen_type";
        $types = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $types;
    }

    /**
     * Queries all rows of the biobank_specimen_protocol table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $specimenProtocols All data concerning each specimen
     *                                  protocol.
     */
    public function getProtocols() : array
    {
        $query     = "SELECT SpecimenProtocolID as id,
                         Label as protocol, 
                         SpecimenTypeID as typeId
                  FROM biobank_specimen_protocol";
        $protocols = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $protocols;
    }

    /**
     * Queries all rows of the biobank_specimen_methods table and returns a nested
     * array with the ID field as the index.
     *
     * @return array $specimenMethods All data concerning each specimen method
     */
    public function getMethods() : array
    {
        $query   = "SELECT SpecimenMethodID as id,
                         Label as method,
                         SpecimenTypeID as typeId
                  FROM biobank_specimen_method";
        $methods = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $methods;
    }

    // TODO: Change the name of this function to getSpecimenAttributeDatatypes
    // TODO: Change name of table 'biobank_datatype' to
    // 'biobank_specimen_attribute_datatype'
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
                  FROM biobank_datatype';
        $attributeDatatypes = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $attributeDatatypes;
    }

    // TODO: Change the name of this function to
    // getSpecimenAttributeReferenceTableOptions
    // TODO: Change name of table 'biobank_reference_table' to
    // 'biobank_specimen_attribute_referencetable'
    /**
     * Queries all rows the biobank_reference_table table. This data is used to
     * query the referenced tables and columns and build a nested array of
     * reference table option values, with the Reference Table ID as the index.
     *
     * @return array $attributeOptions A nested array of attribute reference
     *                                 table options indexed by Reference Table
     *                                 ID
     */
    public function getAttributeOptions() : array
    {
        $query = 'SELECT ReferenceTableID as id,
                         TableName as tableName,
                         ColumnName as columnName
                  FROM biobank_reference_table';
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
                         Label as unit 
                  FROM biobank_unit";
        $units = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $units;
    }

    /**
     * Queries all rows of the biobank_specimen_type_unit_rel table and returns
     * a nested array of specimen unit values, with the Type ID as the first index,
     * and the Unit ID as the second index.
     *
     * @return array $specimenTypeUnits A nested array of unit values index by
     *                                  Type ID and Unit ID
     */
    public function getTypeUnits() : array
    {
        $query     = "SELECT bst.SpecimenTypeID as typeId,
                          bu.UnitID as unitId,
                          bu.Label as unit
                  FROM biobank_specimen_type_unit_rel bstu
                  JOIN biobank_specimen_type bst USING (SpecimenTypeID)
                  JOIN biobank_unit bu USING (UnitID)";
        $result    = $this->db->pselect($query, array());
        $typeUnits = array();
        foreach ($result as $row) {
            foreach ($row as $value) {
                $typeUnits[$row['typeId']][$row['unitId']]['unit'] = $row['unit'];
            }
        }

        return $typeUnits;
    }

    /**
     * Queries all rows from the biobank_specimen_type_attribute_rel table and
     * returns a nested array of specimen-type-specific attribute data with the
     * Type ID as the first index, and the Attribute ID as the second index.
     *
     * @return array $tA A nested array of attribute data
     *                   indexed by Type ID and Attribute ID
     */
    public function getTypeAttributes() : array
    {
        $query  = "SELECT bst.SpecimenTypeID as typeId,
                         bsa.SpecimenAttributeID as attributeId,
                         bsa.Label as name, 
                         bsa.DatatypeID as datatypeId,
                         bsa.ReferenceTableID as refTableId, 
                         bsta.Required as required
                  FROM biobank_specimen_type_attribute_rel bsta
                  JOIN biobank_specimen_type bst USING (SpecimenTypeID)
                  JOIN biobank_specimen_attribute bsa USING (SpecimenAttributeID)";
        $result = $this->db->pselect($query, array());
        $tA     = array(); //typeAttributes
        foreach ($result as $row) {
            foreach ($row as $value) {
                $tA[$row['typeId']][$row['attributeId']]['name']       = $row['name'];
                $tA[$row['typeId']][$row['attributeId']]['datatypeId'] = $row['datatypeId'];
                $tA[$row['typeId']][$row['attributeId']]['refTableId'] = $row['refTableId'];
                $tA[$row['typeId']][$row['attributeId']]['required']   = $row['required'];
            }
        }

        return $tA;
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
                         bsa.Label as name,
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
                $pA[$row['protocolId']][$row['attributeId']]['name']       = $row['name'];
                $pA[$row['protocolId']][$row['attributeId']]['datatypeId'] = $row['datatypeId'];
                $pA[$row['protocolId']][$row['attributeId']]['refTableId'] = $row['refTableId'];
                $pA[$row['protocolId']][$row['attributeId']]['required']   = $row['required'];
            }
        }

        return $pA;
    }

    /**
     * Queries all rows from the biobank_specimen_method_attribute_rel table
     * and returns a nested array of specimen-method-specific attribute data
     * with the Method ID as the first index, and the Attribute ID as the
     * second index.
     *
     * @return array $mA A nested array of attribute data
     *                   indexed by Method ID and Attribute
     *                   ID
     */
    public function getMethodAttributes() : array
    {
        $query  = "SELECT bsm.SpecimenMethodID as methodId,
                         bsa.SpecimenAttributeID as attributeId,
                         bsa.Label as name,
                         bsa.DatatypeID as datatypeId,
                         bsa.ReferenceTableID as refTableId,
                         bsma.Required as required
                  FROM biobank_specimen_method_attribute_rel bsma
                  JOIN biobank_specimen_method bsm
                    USING (SpecimenMethodID)
                  JOIN biobank_specimen_attribute bsa
                    USING (SpecimenAttributeID)";
        $result = $this->db->pselect($query, array());
        $mA     = array(); //methodAttributes
        foreach ($result as $row) {
            foreach ($row as $value) {
                $mA[$row['methodId']][$row['attributeId']]['name']       = $row['name'];
                $mA[$row['methodId']][$row['attributeId']]['datatypeId'] = $row['datatypeId'];
                $mA[$row['methodId']][$row['attributeId']]['refTableId'] = $row['refTableId'];
                $mA[$row['methodId']][$row['attributeId']]['required']   = $row['required'];
            }
        }

        return $mA;
    }

    /**
     * This function receives a Specimen Object, converts it into a SQL format
     * and inserts it into all relevant tables in the database.
     *
     * @param object $specimen The Specimen Object to be saved the
     *                         database.
     *
     * @return void
     */
    public function saveInstance(Specimen $specimen) : void
    {
        // Converts Specimen Object into SQL format.
        $specimenArray = $this->getArrayFromInstance($specimen);
        $data          = $this->getSQLFromArray($specimenArray);

        // TODO: Look into implementing a transaction here
        // $this->db->_PDO->beginTransaction();
        // $this->db->_PDO->commit();
        // $this->db->_PDO->rollBack();

        // Inserts or Updates the biobank_specimen table with respective data.
        $this->db->insertOnDuplicateUpdate(
            'biobank_specimen',
            $data['biobank_specimen']
        );

        $specimenId = $specimen->getId();
        if (isset($specimenId)) {
            // If update:
            // XXX: Logic will likely eventually go here.
        } else {
            // If insert:
            $specimenId = $this->db->getLastInsertId();
            // set the respective data array index to the value of the new
            // specimen ID
            $parentSpecimenIds = $newSpecimen->getParentSpecimenIds();
            foreach ($parentSpecimenIds as $id) {
                $data['biobank_specimen_parent'][$id]
                    = array(
                       'SpecimenID'       => $specimenId,
                       'ParentSpecimenID' => $id,
                      );
            }
            $data['biobank_specimen_freezethaw']['SpecimenID']  = $specimenId;
            $data['biobank_specimen_collection']['SpecimenID']  = $specimenId;
            $data['biobank_specimen_preparation']['SpecimenID'] = $specimenId;
            $data['biobank_specimen_analysis']['SpecimenID']    = $specimenId;
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
    }

    /**
     * This function takes a Specimen array and prepares the data to be
     * inserted into the database by converting it to a data array.
     *
     * @param array $specimen Specimen array to be converted
     *
     * @return array $data Array containing the data to be inserted
     */
    private function getSQLFromArray(array $specimen) : array
    {
        $specimenData = array(
                         'SpecimenID'     => $specimen['id'],
                         'ContainerID'    => $specimen['containerId'],
                         'SpecimenTypeID' => $specimen['typeId'],
                         'Quantity'       => $specimen['quantity'],
                         'UnitID'         => $specimen['unitId'],
                         'SessionID'      => $specimen['sessionId'],
                        );

        $freezeThawData = array(
                           'SpecimenID'      => $specimen['id'],
                           'FreezeThawCycle' => $specimen['fTCycle'],
                          );

        $collection     = $specimen->getCollection();
        $collectionData = array(
                           'SpecimenID' => $specimen['id'],
                           'Quantity'   => $collection['quantity'],
                           'UnitID'     => $collection['untiId'],
                           'CenterID'   => $collection['centerId'],
                           'Date'       => \Utility::toMysqlDateFormat($collection['date']),
                           'Time'       => \Utility::toMysqlDateFormat($collection['time']),
                           'Comments'   => $collection['comments'],
                          );
        $collectionData['Data'] = $collection['data'] ? json_encode($collection['data']) : null;

        $preparation = $specimen->getPreparation();
        if (isset($preparation)) {
            $preparationData         = array(
                                        'SpecimenID'         => $specimen['id'],
                                        'SpecimenProtocolID' => $preparation['protocolId'],
                                        'CenterID'           => $preparation['centerId'],
                                        'Date'               => \Utility::toMysqlDateFormat($preparation['date']),
                                        'Time'               => \Utility::toMysqlDateFormat($preparation['time']),
                                        'Comments'           => $preparation['comments'],
                                       );
            $preparationData['Data'] = $preparation['data'] ? json_encode($preparation['data']) : null;
        }

        $analysis = $specimen->getAnalysis();
        if (isset($analysis)) {
            $analysisData         = array(
                                     'SpecimenID'       => $specimen['id'],
                                     'SpecimenMethodID' => $analysis['methodId'],
                                     'CenterID'         => $analysis['centerId'],
                                     'Date'             => \Utility::toMysqlDateFormat($analysis['date']),
                                     'Time'             => \Utility::toMysqlDateFormat($analysis['time']),
                                     'Comments'         => $analysis['comments'],
                                    );
            $analysisData['Data'] = $analysis['data'] ? json_encode($analysis['data']) : null;
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
     * @return array
     */
    private function getArrayFromSQL(array $data, array $parentSpecimenIds) : array
    {
        return array(
                'id'                => intval($data['SpecimenID']),
                'containerId'       => intval($data['ContainerID']),
                'typeId'            => intval($data['SpecimenTypeID']),
                'quantity'          => floatval($data['Quantity']),
                'unitId'            => intval($data['UnitID']),
                'fTCycle'           => intval($data['FreezeThawCycle']),
                'parentSpecimenIds' => $parentSpecimenIds,
                'candidateId'       => intval($data['CandidateID']),
                'sessionId'         => intval($data['SessionID']),
                'poolId'            => intval($data['PoolID']),
                'collection'        => array(
                                        'quantity' => floatval($data['CollectionQuantity']),
                                        'unitId'   => intval($data['CollectionUnitID']),
                                        'centerId' => intval($data['CollectionCenterID']),
                                        'date'     => $data['CollectionDate'],
                                        'time'     => $data['CollectionTime'],
                                        'comments' => $data['CollectionComments'],
                                        'data'     => json_decode($data['CollectionData'], true),
                                       ),
                'preparation'       => array(
                                        'protocolId' => intval($data['SpecimenProtocolID']),
                                        'centerId'   => intval($data['PreparationCenterID']),
                                        'date'       => $data['PreparationDate'],
                                        'time'       => $data['PreparationTime'],
                                        'comments'   => $data['PreparationComments'],
                                        'data'       => $data['PreparationData'] ? json_decode($data['PreparationData'], true) : null,
                                       ),
                'analysis'          => array(
                                        'methodId' => intval($data['SpecimenMethodID']),
                                        'centerId' => intval($data['AnalysisCenterID']),
                                        'date'     => $data['AnalysisDate'],
                                        'time'     => $data['AnalysisTime'],
                                        'comments' => $data['AnalysisComments'],
                                        'data'     => $data['AnalysisData'] ? json_decode($data['AnalysisData'], true) : null,
                                       ),
               );
    }

    /**
     * Instatiates a Specimen Object using the values sent from the front-end.
     *
     * @param array $data Data to be used to instantiate the Specimen Object.
     *
     * @return Specimen $specimen Instantiated Specimen Object
     */
    public function getInstanceFromArray(array $data) : Specimen
    {
        $specimen = $this->getInstance();
        $specimen->setId($data['id']);
        $specimen->setContainerId($data['containerId']);
        $specimen->setTypeId($data['typeId']);
        $specimen->setQuantity($data['quantity']);
        $specimen->setUnitId($data['unitId']);
        $specimen->setFTCycle($data['fTCycle']);
        $specimen->setParentSpecimenIds($data['parentSpecimenIds']);
        $specimen->setCandidateId($data['candidateId']);
        $specimen->setSessionId($data['sessionId']);
        $specimen->setPoolId($data['poolId']);
        $specimen->setCollection($data['collection']);
        $specimen->setPreparation($data['preparation']);
        $specimen->setAnalysis($data['analysis']);

        return $specimen;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Specimen Instance
     * Class. This converts the Specimen Instance into an array
     *
     * @param Specimen $specimen Specimen Instance
     *
     * @return array Specimen Array
     */
    public function getArrayFromInstance(Specimen $specimen)
    {
        return $specimen->jsonSerialize();
    }
}
