<?php declare(strict_types=1);

namespace LORIS\biobank;

use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;

/**
 * Biospecimen Query Engine for Data Query Tool
 *
 * Provides queryable fields for biospecimen/biobank data including
 * specimen collection status, availability, and specimen characteristics.
 * 
 * This implementation provides fixed/static fields only. Dynamic protocol
 * attributes (stored in the Data JSON column) are not yet exposed.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryEngine extends \LORIS\Data\Query\SQLQueryEngine
{
    // Reusable JOIN clauses - defined once to ensure exact string matching
    const JOIN_SESSION = 'LEFT JOIN session s ON (s.CandidateID=c.ID)';
    const JOIN_SPECIMEN = 'LEFT JOIN biobank_specimen bs '
        . 'ON (s.ID=bs.SessionID)';
    const JOIN_CONTAINER = 'LEFT JOIN biobank_container bc '
        . 'ON (bs.ContainerID=bc.ContainerID)';
    const JOIN_TYPE = 'LEFT JOIN biobank_specimen_type bst '
        . 'ON (bs.SpecimenTypeID=bst.SpecimenTypeID)';
    const JOIN_UNIT = 'LEFT JOIN biobank_unit bu '
        . 'ON (bs.UnitID=bu.UnitID)';
    const JOIN_COLLECTION = 'LEFT JOIN biobank_specimen_collection bsc '
        . 'ON (bs.SpecimenID=bsc.SpecimenID)';
    const JOIN_PROTOCOL = 'LEFT JOIN biobank_specimen_protocol bsp '
        . 'ON (bsc.SpecimenProtocolID=bsp.SpecimenProtocolID)';
    const JOIN_CENTER = 'LEFT JOIN psc ON (bsc.CenterID=psc.CenterID)';
    const JOIN_FREEZETHAW = 'LEFT JOIN biobank_specimen_freezethaw bsf '
        . 'ON (bs.SpecimenID=bsf.SpecimenID)';
    const JOIN_CONTAINER_TYPE = 'LEFT JOIN biobank_container_type bct '
        . 'ON (bc.ContainerTypeID=bct.ContainerTypeID)';

    protected $baseURL;

    /**
     * Constructor
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance being queried
     */
    public function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct($loris);
        $factory = \NDB_Factory::singleton();
        $this->baseURL = $factory->settings()->getBaseURL();
    }

    /**
     * Get the data dictionary for biospecimen fields
     *
     * Returns all queryable fields including:
     * - Session-level summary fields (collection done, specimens available)
     * - Specimen-level fields (barcode, quantity, type, etc.)
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary(): iterable
    {
        $scope = new Scope(Scope::SESSION);
        $specimen = new \LORIS\Data\Dictionary\Category(
            "Specimen",
            "Specimen Collection and Availability",
        );

        // Get specimen types for the enumeration
        $specimenTypes = $this->getSpecimenTypes();

        $items = [
            // Summary field: Any specimen collected at this session
            new DictionaryItem(
                "SpecimenCollectionDone",
                "Does the session have any specimen collected?",
                $scope,
                new \LORIS\Data\Types\BooleanType(),
                new Cardinality(Cardinality::SINGLE),
            ),
            // Summary field: Any specimen still available
            new DictionaryItem(
                "SpecimenAvailable",
                "Does the session have any specimen currently available?",
                $scope,
                new \LORIS\Data\Types\BooleanType(),
                new Cardinality(Cardinality::SINGLE),
            ),
            
            // Specimen-level fields (Cardinality::MANY - multiple specimens per session)
            new DictionaryItem(
                "SpecimenType",
                "Type of specimen",
                $scope,
                new \LORIS\Data\Types\Enumeration(...$specimenTypes),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenBarcode",
                "Container barcode for specimen",
                $scope,
                new \LORIS\Data\Types\StringType(40),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenQuantity",
                "Current quantity of specimen",
                $scope,
                new \LORIS\Data\Types\DecimalType(),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenUnit",
                "Unit of measurement for specimen quantity",
                $scope,
                new \LORIS\Data\Types\StringType(20),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenAvailabilityStatus",
                "Whether specimen is available or used/discarded",
                $scope,
                new \LORIS\Data\Types\Enumeration(
                    "Available",
                    "Used/Discarded"
                ),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenFreezeThawCycle",
                "Number of freeze-thaw cycles for specimen",
                $scope,
                new \LORIS\Data\Types\IntegerType(),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenCollectionDate",
                "Date specimen was collected",
                $scope,
                new \LORIS\Data\Types\DateType(),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenCollectionTime",
                "Time specimen was collected",
                $scope,
                new \LORIS\Data\Types\StringType(8),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenCollectionProtocol",
                "Collection protocol used for specimen",
                $scope,
                new \LORIS\Data\Types\StringType(100),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenCollectionCenter",
                "Center where specimen was collected",
                $scope,
                new \LORIS\Data\Types\StringType(255),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenContainerType",
                "Type of container holding specimen",
                $scope,
                new \LORIS\Data\Types\StringType(40),
                new Cardinality(Cardinality::MANY),
            ),
            new DictionaryItem(
                "SpecimenTemperature",
                "Storage temperature for specimen",
                $scope,
                new \LORIS\Data\Types\DecimalType(),
                new Cardinality(Cardinality::MANY),
            ),
        ];

        $specimen = $specimen->withItems($items);

        return [$specimen];
    }

    /**
     * Get list of specimen types from the database
     *
     * @return string[] Array of specimen type labels
     */
    protected function getSpecimenTypes(): array
    {
        $DB = \NDB_Factory::singleton()->database();
        
        $types = $DB->pselectCol(
            "SELECT DISTINCT Label 
             FROM biobank_specimen_type 
             ORDER BY Label",
            []
        );

        return $types;
    }

    /**
     * Get list of visits that have biospecimen data
     *
     * @param \LORIS\Data\Dictionary\Category       $inst The item category
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The item itself
     *
     * @return string[]
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ): iterable {
        if ($item->getScope()->__toString() !== 'session') {
            return [];
        }
        
        $user = \NDB_Factory::singleton()->user();
        $userVisits = array_keys($user->getVisits());
        
        // Get visits that actually have specimens
        $DB = \NDB_Factory::singleton()->database();
        $visitsWithSpecimens = $DB->pselectCol(
            "SELECT DISTINCT s.Visit_label
             FROM biobank_specimen bs
             JOIN session s ON (bs.SessionID = s.ID)
             WHERE s.Active='Y'
             AND s.Visit_label IN ('" . implode("','", $userVisits) . "')
             ORDER BY s.Visit_label",
            []
        );
        
        return $visitsWithSpecimens;        
    }    

    /**
     * Generate SQL field expression for a dictionary item
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The field
     *
     * @return string SQL expression for the field
     */
    protected function getFieldNameFromDict(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ): string {
        switch ($item->getName()) {
        case 'SpecimenCollectionDone':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            return "CASE WHEN COUNT(DISTINCT bs.SpecimenID) > 0 "
                . "THEN true ELSE false END";

        case 'SpecimenAvailable':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            return "CASE WHEN COUNT("
                . "CASE WHEN bs.Quantity > 0 THEN 1 END"
                . ") > 0 THEN true ELSE false END";

        case 'SpecimenType':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_TYPE);
            return 'bst.Label';

        case 'SpecimenBarcode':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_CONTAINER);
            return 'bc.Barcode';

        case 'SpecimenQuantity':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            return 'bs.Quantity';

        case 'SpecimenUnit':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_UNIT);
            return 'bu.Label';

        case 'SpecimenAvailabilityStatus':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            return 'CASE WHEN bs.Quantity > 0 '
                . 'THEN "Available" '
                . 'ELSE "Used/Discarded" END';

        case 'SpecimenFreezeThawCycle':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_FREEZETHAW);
            return 'bsf.FreezeThawCycle';

        case 'SpecimenCollectionDate':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_COLLECTION);
            return 'bsc.Date';

        case 'SpecimenCollectionTime':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_COLLECTION);
            return 'bsc.Time';

        case 'SpecimenCollectionProtocol':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_COLLECTION);
            $this->addTable(self::JOIN_PROTOCOL);
            return 'bsp.Label';

        case 'SpecimenCollectionCenter':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_COLLECTION);
            $this->addTable(self::JOIN_CENTER);
            return 'psc.Name';

        case 'SpecimenContainerType':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_CONTAINER);
            $this->addTable(self::JOIN_CONTAINER_TYPE);
            return 'bct.Label';

        case 'SpecimenTemperature':
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_CONTAINER);
            return 'bc.Temperature';

        default:
            throw new \DomainException(
                "Invalid field " . $item->getName()
            );
        }
    }    

    /**
     * Get the type description for the corresponding key field
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The field
     *
     * @return string Description of key field type
     */
    public function getCorrespondingKeyFieldType(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ): string {
        return "Specimen Container Barcode";
    }

    /**
     * Get the SQL for the corresponding key field (for MANY cardinality)
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The field
     *
     * @return string SQL expression for key field
     */
    public function getCorrespondingKeyField(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) {
        if ($item->getCardinality()->__toString() === 'many') {
            $this->addTable(self::JOIN_SESSION);
            $this->addTable(self::JOIN_SPECIMEN);
            $this->addTable(self::JOIN_CONTAINER);
            return "bc.Barcode";
        }

        throw new \Exception(
            "Unhandled Cardinality::MANY field " . $item->getName()
        );
    }    
}

