<?php declare(strict_types=1);

class InstrumentImporter extends DataImporter {

    /**
     * This value should be updated if the CandID class in LORIS is updated.
     */
    const CANDID_LENGTH = 6;
    /**
     * This value should be updated if the source project has a PSCID of
     * a custom length (the LORIS default at this time is 6).
     * This value is used to extract a PSCID from a CommentID based on an index.
     */
    const PSCID_LENGTH = 6;

    /* An array of CommentIDs that exist in the database. */
    private $existingCommentIDs = array();

    public function __construct(SplFileInfo $mappingFile, SplFileInfo $dataFile) {
        // The name of the table must be the first value in the filename preceding
        // an underscore. e.g, "$instrumentName_dataExtract_output.csv".
        $this->table = substr(
            $dataFile->getFilename(), 
            0, 
            strpos($dataFile->getFilename(), '_')
        );
        
        // Access list of existing CommentIDs
        $this->existingCommentIDs = \Database::singleton()->pselectCol(
            'SELECT CommentID from flag',
            array()
        );

        // Create a mapping between PSCIDs and new PSCIDs to new CandIDs.
        parent::__construct($mappingFile, $dataFile);
    }

    function buildSQLQuery(array $row) {
        $data = $row;
        // Build the new CommentID by replacing the old CandID value with the
        // new CandID and the old PSCID value with the new PSCID.
        $oldPSCID = $this->extractPSCIDFromCommentID($data['CommentID']);
        $newPSCID = $this->newPSCID($oldPSCID);
        $newCommentID = $this->newCandID($newPSCID) . $newPSCID . substr(
            $data['CommentID'], 
            self::CANDID_LENGTH + self::PSCID_LENGTH
        );
        $data['CommentID'] = $newCommentID;
        $command['data'] = $data;
        $this->INSERTQueue[] = $command;
    }

    function calculateSharedCandidates() {
        // CommentIDs begin with a CandID followed by a PSCID. In order to find
        // the old PSCID we ignore the CandID and check if the characters
        // immediatelly following are equal to an old PSCID value in the mapping
        // file. 
        // This requires an O(n^2) loop.
        // TODO Need a branch to check for DDE_ CommentIDs.
        foreach ($this->dataRows as $row) {
            foreach (array_keys($this->PSCIDMapping) as $oldPSCID) {
                // Check if the characeters immediately following CandID are equal
                // to an old PSCID in the mapping file. If so, then add this to
                // the lsit of shared candidates.
                $pscidFound = strpos(
                    $row['CommentID'], 
                    $oldPSCID, 
                    self::CANDID_LENGTH
                ) === self::CANDID_LENGTH;
                if ($pscidFound) {
                    $this->sharedCandidates[] = $oldPSCID;
                }
            }
        }
    }

    /**
     * CommentIDs begin with a CandID followed by a PSCID. This function grabs
     * a number characters equal to PSCID_LENGTH
     * from the CommentID, beginning at the index of CANDID_LENGTH.
     */
    function extractPSCIDFromCommentID(string $commentID) {
        return substr(
            $commentID, 
            self::CANDID_LENGTH, 
            self::PSCID_LENGTH
        );
    }

    /**
     * {@inheritDoc}
     *
     * Overrides parent function by extracting the PSCID from the CommentID
     * rather than directly querying a PSCID column.
     */
    function extractOldPSCIDFromRow(array $row) {
        return $this->extractPSCIDFromCommentID($row['CommentID']);
    }
}
