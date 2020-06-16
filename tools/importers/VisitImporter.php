<?php declare(strict_types=1);

require_once 'DataImporter.class.inc';

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class VisitImporter extends DataImporter
{
    public $excludedVisitLabels = array();
    public $excludedCount       = 0;
    public $existingSessions    = array();

    /**
     * {@inheritDoc}
     *
     * @param SplFileInfo  $mappingFile  A path to the CSV mapping file.
     * @param SplFileInfo  $dataFile     A path to the CSV data file.
     * @param ?SplFileInfo $excludedFile a file containing candidates to be
     *                                   excluded from import.
     *
     * @return void
     */
    public function __construct(
        SplFileInfo $mappingFile,
        SplFileInfo $dataFile,
        ?SplFileInfo $excludedFile = null
    ) {
        $this->table = 'session';

        // Get existing sessions so that there is a way to distinguish between
        // when to build UPDATE vs. INSERT statements.
        $result = \Database::singleton()->pselect(
            'SELECT CandID,Visit_label FROM session',
            array()
        );
        foreach ($result as $row) {
            if (!array_key_exists($row['CandID'], $this->existingSessions)) {
                $this->existingSessions[$row['CandID']] = array();
            }
            array_push(
                $this->existingSessions[$row['CandID']],
                $row['Visit_label']
            );
        }

        // Read list of excluded visit labels into an array.
        if (!is_null($excludedFile)) {
            $this->excludedVisitLabels = explode(
                "\n",
                file_get_contents($excludedFile->getRealPath())
            );
        }

        // Populate arrays with contents of CSV files.
        parent::__construct($mappingFile, $dataFile);
    }

    /**
     * {@inheritDoc}
     *
     * @return void
     */
    function calculateSharedCandidates(): void
    {
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

    /**
     * {@inheritDoc}
     *
     * @param string[] $row CSV data to be converted to an SQL statement.
     *
     * @return void
     */
    function buildSQLQuery(array $row): void
    {
        // Skip this visit label if it is in the list of excluded labels.
        if (count($this->excludedVisitLabels) > 0) {
            if (in_array($row['Visit_label'], $this->excludedVisitLabels, true)) {
                $this->excludedCount++;
                return;
            }
        }

        $data = $row;

        // Prepare command information.
        //
        $newCandID = $this->newCandID($this->newPSCID($data['PSCID']));

        // We don't want PSCID information from the CSV file included in the
        // SET statement. It's only used for linking.
        unset($data['PSCID']);
        $where   = array('CandID' => $newCandID);
        $command = array(
            'data'  => $data,
            'where' => $where,
        );

        if (empty($this->existingSessions[$newCandID])
            || !in_array(
                $row['Visit_label'],
                $this->existingSessions[$newCandID],
                true
            )
        ) {
            // INSERT if the candidate doesn't have any visit labels or if the
            // current visit label is not present in their list of visit labels.
            $command['data']['CandID'] = $newCandID;
            $this->INSERTQueue[]       = $command;
        } else {
            // UPDATE if Visit label already present for this candidate
            $command['where']['Visit_label'] = $row['Visit_label'];
            $this->UPDATEQueue[] = $command;
        }
    }
}
