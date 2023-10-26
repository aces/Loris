<?php
namespace LORIS\imaging_browser;

use LORIS\StudyEntities\Candidate\CandID;

use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;
use \LORIS\Data\Query\QueryTerm;

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryEngine extends \LORIS\Data\Query\SQLQueryEngine
{
    /**
     * {@inheritDoc}
     *
     * @param \LORIS\LorisInstance $loris The Loris instance from which the
     *                                    data dictionary for this module
     *                                    should be retrieved.
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
                "Does the candidate have any imaging scan done?",
                $scope,
                new \LORIS\Data\Types\BooleanType(),
                new Cardinality(Cardinality::SINGLE),
            ),
        ];

        $scantypes = \Utility::getScanTypeList();
        foreach ($scantypes as $ScanType) {
            $items[] = new LocationDictionaryItem(
                $ScanType,
                "$ScanType acquisition location",
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

    public function getVisitList(\LORIS\Data\Dictionary\Category $inst, \LORIS\Data\Dictionary\DictionaryItem $item) : iterable
    {
        if ($item->getScope()->__toString() !== 'session') {
            return null;
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

    protected function getFieldNameFromDict(\LORIS\Data\Dictionary\DictionaryItem $item) : string
    {
        if ($item->getName() == 'ScanDone') {
            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            return "CASE WHEN s.Scan_Done='Y' THEN true WHEN s.Scan_Done='N' THEN false ELSE NULL END";
        }
        if ($item instanceof LocationDictionaryItem) {
            $modality = $item->getModality();

            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files `$modality` ON (s.ID=`$modality`.SessionID)");
            $this->addTable("LEFT JOIN mri_scan_type `{$modality}_mst` ON (`$modality`.AcquisitionProtocolID=`{$modality}_mst`.ID)");
            $this->addWhereClause("(`{$modality}_mst`.Scan_type=\"{$modality}\" OR `{$modality}_mst`.Scan_type IS NULL)");
            return "`$modality`.File";
        }
        if ($item instanceof QCDictionaryItem) {
            $modality = $item->getModality();

            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files `$modality` ON (s.ID=`$modality`.SessionID)");
            $this->addTable("LEFT JOIN mri_scan_type `{$modality}_mst` ON (`$modality`.AcquisitionProtocolID=`{$modality}_mst`.ID)");
            $this->addTable("LEFT JOIN files_qcstatus `{$modality}_qc` ON (`$modality`.FileID=`{$modality}_qc`.FileID)");
            $this->addWhereClause("(`{$modality}_mst`.Scan_type=\"{$modality}\" OR `{$modality}_mst`.Scan_type IS NULL)");
            return "`{$modality}_qc`.QCStatus";
        }

        throw new \DomainException("Invalid field " . $item->getName());
    }

    public function getCorrespondingKeyFieldType(\LORIS\Data\Dictionary\DictionaryItem $item) : string{
        return "Imaging Filename";
    }
    public function getCorrespondingKeyField(\LORIS\Data\Dictionary\DictionaryItem $item)
    {
        if ($item instanceof LocationDictionaryItem) {
            $modality = $item->getModality();
            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files `$modality` ON (s.ID=`$modality`.SessionID)");
            $this->addTable("LEFT JOIN mri_scan_type `{$modality}_mst` ON (`$modality`.AcquisitionProtocolID=`{$modality}_mst`.ID)");
            return "`" . $item->getModality() ."`.File";
        }
        if ($item instanceof QCDictionaryItem) {
            $modality = $item->getModality();
            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addTable("LEFT JOIN files `$modality` ON (s.ID=`$modality`.SessionID)");
            $this->addTable("LEFT JOIN mri_scan_type `{$modality}_mst` ON (`$modality`.AcquisitionProtocolID=`{$modality}_mst`.ID)");
            return "`" . $item->getModality() ."`.File";
        }
        throw new \Exception("Unhandled Cardinality::MANY field $fieldname");
    }
}
