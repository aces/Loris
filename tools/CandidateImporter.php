<?php declare(strict_types=1);
require_once 'DataImporter.class.inc';

class CandidateImporter extends DataImporter {

    public function __construct(SplFileInfo $mappingFile, SplFileInfo $dataFile) {
        $this->table = 'candidate';
        // Populate arrays with contents of CSV files.
        parent::__construct($mappingFile, $dataFile);
    }

    function calculateSharedCandidates() {
        // Filter out candidates present in data export but not included in the
        // mapping file. If the candidates are not present in the mapping file
        // that means that they are being deliberately excluded from import.
        foreach ($this->dataRows as $row) {
            $oldPSCID = $row[$this->dataHeaders[parent::OLD_PSCID]];
            if (!is_null($this->newPSCID($oldPSCID))) {
                $this->sharedCandidates[] = $oldPSCID;
            }
        }
    }

    function buildSQLQuery($row) {
        $data = $row;
        // Discard the PSCID value in this CSV row. It is equal to the old
        // PSCID and only used for linking. It should not be included in the
        // UPDATE statement.
        unset($data['PSCID']);

        // Get the new PSCID value using the old PSCID found in the row.
        $where = array(
            'PSCID' => $this->newPSCID(
                $row[$this->dataHeaders[parent::OLD_PSCID]]
            )
        );
        $this->UPDATEQueue[] = array(
            'data' => $data,
            'where' => $where
        );
    }
}
