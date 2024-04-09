<?php
namespace LORIS\imaging_browser;

use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryEngine extends \LORIS\Data\Query\SQLQueryEngine
{
    protected $baseURL;
    /**
     * {@inheritDoc}
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance being queried
     */
    public function __construct(protected \LORIS\LorisInstance $loris)
    {
        $factory       = \NDB_Factory::singleton();
        $this->baseURL = $factory->settings()->getBaseURL();
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary() : iterable
    {
        $scope  = new Scope(Scope::SESSION);
        $images = new \LORIS\Data\Dictionary\Category(
            "Images",
            "Image Acquisitions",
        );
        $items  = [
            new DictionaryItem(
                "ScanDone",
                "Does the session have any imaging scan done?",
                $scope,
                new \LORIS\Data\Types\BooleanType(),
                new Cardinality(Cardinality::SINGLE),
            ),
        ];

        $scantypes = \Utility::getScanTypeList();
        foreach ($scantypes as $ScanType) {
            $items[] = new LocationDictionaryItem(
                $ScanType . "_file",
                "$ScanType acquisition file path",
                $scope,
                new \LORIS\Data\Types\StringType(),
                new Cardinality(Cardinality::MANY),
                $ScanType,
            );
            $items[] = new LocationDictionaryItem(
                $ScanType . "_url",
                "$ScanType acquisition file URL",
                $scope,
                new \LORIS\Data\Types\URI(),
                new Cardinality(Cardinality::MANY),
                $ScanType,
            );
            // TODO: Investigate adding a file scope instead of having this apply
            // on a session scope with a Many cardinality.
            $items[] = new QCDictionaryItem(
                $ScanType  . "_QCStatus",
                "Quality control status for $ScanType acquisition",
                $scope,
                new \LORIS\Data\Types\Enumeration("Pass", "Fail"),
                new Cardinality(Cardinality::MANY),
                $ScanType,
            );
        }
        $images = $images->withItems($items);

        return [$images];
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\Category       $inst The item category
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The item itself
     *
     * @return string[]
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable {
        if ($item->getScope()->__toString() !== 'session') {
            return [];
        }

        if ($item instanceof ImagingDictionaryItem) {
            $DB     = \NDB_Factory::singleton()->database();
            $visits = $DB->pselectCol(
                "SELECT DISTINCT s.Visit_label
                FROM files f
                    JOIN session s ON (f.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                    JOIN mri_scan_type mst ON (mst.ID=f.AcquisitionProtocolID)
                WHERE
                    c.Active='Y' AND
                    s.Active='Y' AND
                    mst.Scan_type=:scantype AND
                    c.Entity_Type='Human'
                ORDER BY s.Visit_label",
                ['scantype' => $item->getModality()],
            );
            return $visits;
        }

        // Fall back on all visits if something ends up getting
        // added that we can't derive the modality of.
        return array_keys(\Utility::getVisitList());
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - the field
     *
     * @return string
     */
    protected function getFieldNameFromDict(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ): string {
        if ($item->getName() == 'ScanDone') {
            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
                return "CASE WHEN s.Scan_Done='Y' THEN true
                             WHEN s.Scan_Done='N' THEN false
                             ELSE NULL END";
        }
        if ($item instanceof LocationDictionaryItem) {
            $modality = $item->getModality();

            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files ON (s.ID=files.SessionID)");

            // Because of complex interactions between joins that get
            // out of hand when a scan type that doesn't exist is selected
            // alongside one that does, we use a subselect here.
            if (str_ends_with($item->getName(), "_file")) {
                return "(SELECT File FROM files as files2
                            JOIN mri_scan_type
                                ON (files2.AcquisitionProtocolID=mri_scan_type.ID)
                            WHERE files2.FileID=files.FileID
                                AND mri_scan_type.Scan_type='{$modality}')";
            } else if (str_ends_with($item->getName(), "_url")) {
                return "(SELECT CONCAT(
                            \"$this->baseURL\",
                            \"/api/v0.0.3/candidates/\",
                            c.CandID,
                            \"/\",
                            s.Visit_label,
                            \"/images/\", 
                            SUBSTRING_INDEX(files.File, '/', -1)
                            ) FROM files as files2
                            JOIN mri_scan_type
                                ON (files2.AcquisitionProtocolID=mri_scan_type.ID)
                            WHERE files2.FileID=files.FileID
                                AND mri_scan_type.Scan_type='{$modality}')";
            }
        }
        if ($item instanceof QCDictionaryItem) {
            $modality = $item->getModality();

            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files ON (s.ID=files.SessionID)");
            return "(SELECT QCStatus FROM files_qcstatus 
                        JOIN files as files2
                        JOIN mri_scan_type
                            ON (files2.AcquisitionProtocolID=mri_scan_type.ID)
                        WHERE files_qcstatus.FileID=files.FileID
                            AND files2.FileID=files.FileID
                            AND mri_scan_type.Scan_type='{$modality}')";
        }

        throw new \DomainException("Invalid field " . $item->getName());
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - The field
     *
     * @return string
     */
    public function getCorrespondingKeyFieldType(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : string {
        return "Imaging Filename";
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - The field
     *
     * @return string
     */
    public function getCorrespondingKeyField(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) {
        if ($item instanceof LocationDictionaryItem
            || $item instanceof QCDictionaryItem
        ) {
            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files ON (s.ID=files.SessionID)");
            return "SUBSTRING_INDEX(files.File, '/', -1)";
        }
        throw new \Exception(
            "Unhandled Cardinality::MANY field " . $item->getName()
        );
    }
}
