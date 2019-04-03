<?php declare(strict_types=1);
require_once 'DataImporter.class.inc';

class CandidateImporter extends DataImporter {

    public function __construct(SplFileInfo $mappingFile, SplFileInfo $dataFile) {
        $this->table = 'candidate';
        // Populate arrays with contents of CSV files.
        $this->populateDataFromCSVs($mappingFile, $dataFile);

        // Create a mapping between PSCIDs and new PSCIDs to new CandIDs.
        $this->buildIDMappings();
        $this->calculateSharedCandidates();
    }

    function calculateSharedCandidates() {
        // Filter out candidates present in data export but not included in the
        // mapping file. If the candidates are not present in the mapping file
        // that means that they are being deliberately excluded from import.
        foreach($dataRows as $row) {
            $oldPSCID = $row[$this->dataHeaders[OLD_PSCID]];
            if (isset($this->PSCIDMapping[$oldPSCID])) {
                $this->sharedCandidates[] = $oldPSCID;
            }
        }
    }
}
