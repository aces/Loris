<?php
namespace LORIS\instruments;

/**
 * InstrumentQueryEngine implements a LORIS QueryEngine for querying
 * against instrument data from a LORIS instance.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class InstrumentQueryEngine implements \LORIS\Data\Query\QueryEngine
{
    protected $loris;

    /**
     * Cache of an instrument's visits for getVisitList
     */
    private $visitcache = [];


    /**
     * Constructor
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance
     */
    public function __construct(\LORIS\LorisInstance $loris)
    {
        $this->loris = $loris;
    }

    /**
     * Return the data dictionary for all instruments installed on a LORIS
     * instance.
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary() : iterable
    {
        $DB = $this->loris->getDatabaseConnection();

        $rows = $DB->pselectCol("SELECT Test_name FROM test_names", []);

        $dict = [];
        foreach ($rows as $testname) {
            try {
                $inst   = \NDB_BVL_Instrument::factory(
                    $this->loris,
                    $testname,
                    "",
                    "",
                );
                $cat    = new \LORIS\Data\Dictionary\Category(
                    $testname,
                    $inst->getFullName()
                );
                $fields = $inst->getDataDictionary();
                $dict[] = $cat->withItems($fields);
            } catch (\LorisException $e) {
                error_log($e);
            }
        }
        return $dict;
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Query\QueryTerm $term      The criteria being matched
     * @param ?array                      $visitlist The list of visits that must
     *                                               match for session scoped
     *                                               variables
     *
     * @return iterable
     */
    public function getCandidateMatches(
        \LORIS\Data\Query\QueryTerm $term,
        ?array $visitlist=null
    ) : iterable {
        // This is stupid, but the parameter_type_override table uses '_' as
        // a delimiter between instrument and fieldname, despite the fact that
        // either one may itself have a _ in the name. This can't be easily
        // changed without losing all existing overrides from the old datadict
        // module.
        //
        // We walk the existing test names ordered by length to look for the
        // longest prefix match to find out what the instrument for the fieldname is.
        $DB = $this->loris->getNewDatabaseConnection();
        $DB->setBuffering(false);

        $rows = $DB->pselectCol(
            "SELECT Test_name FROM test_names ORDER BY Length(Test_name) DESC",
            []
        );

        $testname = null;
        $fullname = $term->dictionary->getName();
        foreach ($rows as $testcandidate) {
            if (strpos($fullname, $testcandidate) === 0) {
                $testname = $testcandidate;
                break;
            }
        }
        if ($testname === null) {
            throw new \DomainException("Field for unknown instrument");
        }

        $inst   = \NDB_BVL_Instrument::factory($this->loris, $testname);
        $values = $inst->bulkLoadInstanceData(
            null,
            $term,
        );
        foreach ($values as $match) {
            yield $match->getCandID();
        }
        return;
    }

    /**
     * Get list of visits that an instrument is valid at
     *
     * @param \LORIS\Data\Dictionary\Category       $inst The instrument
     *                                                    category
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The field
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

        // An instrument's fields all have the same visit list, so cache
        // the results to ensure it's only queried once.
        if (isset($this->visitcache[$inst->getName()])) {
            return $this->visitcache[$inst->getName()];
        }

        $DB     = \NDB_Factory::singleton()->database();
        $visits = $DB->pselectCol(
            "SELECT DISTINCT s.Visit_Label
                FROM flag f
                   JOIN test_names tn ON (tn.ID=f.TestID)
                   JOIN session s ON (f.SessionID=s.ID)
                   JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Active='Y' AND c.Active='Y' and tn.Test_name=:tn
            ORDER BY s.Visit_label",
            ['tn' => $inst->getName()]
        );

        $this->visitcache[$inst->getName()] = $visits;

        return $visits;
    }

    /**
     * {inheritDoc}
     *
     * @param array    $items      DictionaryItems for which to get data
     * @param iterable $candidates Candidates whose data we want
     * @param ?array   $visitlist  List of visits that we want data for
     *
     * @return iterable<string, \LORIS\Data\DataInstance>
     */
    public function getCandidateData(
        array $items,
        iterable $candidates,
        ?array $visitlist
    ) : iterable {
        // We need to know what category the item is in to get the instrument,
        // so get the full data dictionary and go through each to see if
        // it's the same as $item
        $field2instMap = [];

        $fullDictionary = $this->getDataDictionary();
        foreach ($fullDictionary as $category) {
            $instrument = $category->getName();
            foreach ($category->getItems() as $dict) {
                $field2instMap[$dict->getName()] = $instrument;
            }
        }

        $instruments = [];
        foreach ($items as $dict) {
            $instr = $field2instMap[$dict->getName()];

            if (!in_array($instr, $instruments, true)) {
                $instruments[] = $instr;
            }

        }
        $DB = $this->loris->getDatabaseConnection();

        // Put candidates into a temporary table so that it can be used in a join
        // clause. Directly using "c.CandID IN (candid1, candid2, candid3, etc)" is
        // too slow.
        $DB->run("DROP TEMPORARY TABLE IF EXISTS querycandidates");
        $DB->run(
            "CREATE TEMPORARY TABLE querycandidates (
                 CandID int(6),
                 PRIMARY KEY (CandID)
            );"
        );
        $insertstmt = "INSERT INTO querycandidates VALUES ("
        /* see https://github.com/phan/phan/issues/4746
         * @phan-suppress-next-line PhanParamSpecial1 */
            . join('),(', $candidates)
            . ')';

        $q = $DB->prepare($insertstmt);
        $q->execute([]);

        $rows = $DB->pselect(
            "SELECT c.CandID, CommentID FROM flag f 
		JOIN test_names tn ON (f.TestID=tn.ID)
                JOIN session s ON (f.SessionID=s.ID)
                JOIN candidate c ON (s.CandID=c.CandID)
             WHERE f.CommentID NOT LIKE 'DDE%'
                AND c.CandID IN (SELECT CandID FROM querycandidates)
                AND tn.Test_name IN ('" . join("', '", $instruments). "')
                AND c.Active='Y' AND s.Active='Y'
             ORDER BY c.CandID",
            [],
        );

        $commentID2CandID = [];
        foreach ($rows as $row) {
            $commentID2CandID[$row['CommentID']] = $row['CandID'];
        }

        $instrumentIterators = [];
        foreach ($instruments as $instrument) {
            $inst   = \NDB_BVL_Instrument::factory($this->loris, $instrument);
            $values = $inst->bulkLoadInstanceData(
                array_keys($commentID2CandID)
            );

            $instrumentIterators[$instrument] = $this->_dataToIterator(
                $values,
                $commentID2CandID,
                $items,
                $field2instMap
            );
        }
        return $this->_mergeIterators($candidates, $instrumentIterators);
    }

    /**
     * Merge the iterators for each instrument into a single iterator for the
     * candidate.
     *
     * @param iterable     $candidates The list of CandIDs that were expected to
                                       be returned
     * @param \Generator[] $iterators  An iterator for each instrument, may or
     *                                 may not have every CandID
     *
     * @return \Generator
     */
    private function _mergeIterators($candidates, $iterators)
    {
        foreach ($candidates as $candID) {
            // Go through each module, if it has data for this candidate
            // put it in the appropriate columns.
            $candidateData = [];
            $candIDStr     = "$candID";
            foreach ($iterators as $instrData) {
                if (!$instrData->valid()) {
                    continue;
                }
                $instCandidate = $instrData->key();
                // The candidate data must have been sorted by
                // CandID for our logic to work.
                // Coerce to string for the comparison so that <=
                // works. (We can't do a <= comparison on a CandID
                // object)
                assert($candIDStr <= $instCandidate);

                // If the module has data for this candID, populate it,
                // if not, don't advance the iterator.
                while ($instCandidate == $candIDStr && $instrData->valid()) {
                    // Go through each field and put the data in the right
                    // index if applicable.
                    $data = $instrData->current();
                    foreach ($data as $fieldkey=> $sessionobjs) {
                        foreach ($sessionobjs as $sessionID => $val) {
                            assert(!isset($candidateData[$fieldkey][$sessionID]));
                            $candidateData[$fieldkey][$sessionID] = $val;
                        }
                    }
                    $instrData->next();
                    $instCandidate = $instrData->key();
                }
            }
            if (!empty($candidateData)) {
                    yield $candIDStr => $candidateData;
            }
        }
    }

    /**
     * Take the data loaded by bulkLoadInstrumentData and convert it to an
     * iterator of the format expected by a QueryEngine
     *
     * @param array $values           Loaded instruments with data
     * @param array $commentID2CandID A Mapping from CommentID to CandID
     * @param array $items            The QueryEngine items selected
     * @param array $field2instMap    A Map of fields to which instrument
     *                                the field is from for each item
     *                                in $items
     *
     * @return iterable
     */
    private function _dataToIterator(
        $values,
        $commentID2CandID,
        $items,
        $field2instMap,
    ) {
        foreach ($values as $loadedInstrument) {
            $candData = [];
            $iCandID  = $commentID2CandID[$loadedInstrument->getCommentID()];

            foreach ($items as $dict) {
                $fieldinst = $field2instMap[$dict->getName()];
                if ($fieldinst  == $loadedInstrument->testName) {
                    if (!isset($candData[$dict->getName()])) {
                        $candData[$dict->getName()] = [];
                    }
                    $sid = $loadedInstrument->getSessionID();
                    $candData[$dict->getName()][$sid->__toString()] = [
                        'VisitLabel' => $loadedInstrument->getVisitLabel(),
                        'SessionID'  => $sid->__toString(),
                        'value'      => $loadedInstrument->getDictionaryValue($dict),
                    ];
                }
            }
            yield "$iCandID" => $candData;
        }
    }
}
