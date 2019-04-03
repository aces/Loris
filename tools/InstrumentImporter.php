<?php

class InstrumentImporter extends DataImporter {

    public function __construct(SplFileInfo $mappingFile, SplFileInfo $dataFile) {
        // The name of the table must be the first value in the filename preceding
        // an underscore. e.g, "$instrumentName_dataExtract.csv".
        $table = substr($dataFile, 0, strpos($dataFile, '_'));

        // Populate arrays with contents of CSV files.
        $this->populateDataFromCSVs($mappingFile, $dataFile);

        // Create a mapping between PSCIDs and new PSCIDs to new CandIDs.
        $this->buildIDMappings();
        $this->calculateSharedCandidates();

    }

    function calculateSharedCandidates() {
        // CommentIDs begin with a CandID followed by a PSCID. In order to find
        // the old PSCID we ignore the CandID and check if the characters
        // immediatelly following are equal to an old PSCID value in the mapping
        // file. 
        // This requires an O(n^2) loop.
        print_r(array_keys($this->PSCIDMapping));
        foreach ($this->$dataRows as $row) {
            foreach (array_keys($this->PSCIDMapping) as $oldPSCID) {
                // Check if the characeters immediately following CandID are equal
                // to an old PSCID in the mapping file. If so, then add this to
                // the lsit of shared candidates.
                if (strpos($row['CommentID'], $oldPSCID, CANDID_LENGTH) === CANDID_LENGTH) {
                    $sharedCandidates[] = $oldPSCID;
                }
            }
        }
    }
}
