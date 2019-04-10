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

        // Use the old PSCID to get the new CandID.
        $newCandID = $this->newCandID($this->newPSCID($data['PSCID']));

        // Retrieve the CommentID for this candidate/session/instrument using
        // the new CandID and the visit label.
        $query = "SELECT f.CommentID
            FROM flag f
            INNER JOIN session s ON s.ID = f.SessionID
            INNER JOIN candidate c ON c.CandID = s.CandID
            WHERE c.CandID = :newCandID AND s.Visit_label = :visitLabel;";

        $newCommentID = \Database::singleton()->pselectOne(
            $query, 
            array(
                'newCandID' => $newCandID,
                'visitLabel' => $data['Visit_label']
            )
        );

        if (empty($newCommentID)) {
            $msg = "No CommentID could be found for candidate `%s`, " .
                "visit label `%s`, and instrument `%s`";
            echo sprintf($msg, $newCandID, $data['Visit_label'], $this->table)
                . PHP_EOL;
            return;
        }

        // PSCID and Visit_label in the source CSV ar eonly used for linking.
        // They shouldn't be inserted into the database.
        unset($data['PSCID'], $data['Visit_label']);

        $command['data'] = $data;
        $command['where'] = array('CommentID' => $newCommentID);
        $this->UPDATEQueue[] = $command;
    }
}

