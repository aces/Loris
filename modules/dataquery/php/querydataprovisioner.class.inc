<?php declare(strict_types=1);

namespace LORIS\dataquery;
use \LORIS\Data\ProvisionerInstance;

/**
 * A QueryDataProvisioner is a LORIS data provisioner which retrieves
 * the data for a query run from the data query tool.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryDataProvisioner extends ProvisionerInstance
{
    protected \User $user;
    protected Query $query;

    /**
     * Construct a provisioner to get data for a query run.
     *
     * @param \LORIS\LorisInstance $loris    The LorisInstance it was run on
     * @param QueryRun             $QueryRun The QueryRun whose data should
     *                                       be retrieved.
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        protected QueryRun $QueryRun,
    ) {
        $this->query = $QueryRun->getQuery();
    }

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user executing the query
     *
     * @return \Traversable
     */
    public function execute(\User $user) : \Traversable
    {
        $this->user = $user;
        return parent::execute($user);
    }

    /**
     * {@inheritDoc}
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $candidates = $this->QueryRun->getCandidates($this->user);

        $dataiterators = [];
        $fields        = [];
        $fieldsarray   = $this->query->getFieldsRaw();

        // Convert from an array of fieldnames to an array of
        // fieldnames per module, to minimize the number of roundtrips
        // to the module
        foreach ($fieldsarray as $field) {
            $mname = $field['module'];
            $fname = $field['field'];
            if (!isset($fields[$mname])) {
                $fields[$mname] = [];
            }
            $fields[$mname][] = $fname;
        }

        // Run the query against each module and store the resulting
        // iterators in the $dataiterators array.
        foreach ($fields as $modulename => $mfields) {
            $engine = $this->loris->getModule($modulename)->getQueryEngine();

            $flatdict = $this->getFlattenedDictionary($engine);

            $fielddict = [];

            foreach ($mfields as $fieldname) {
                $fielddict[] = $flatdict[$fieldname];
            }

            $dataiterators[$modulename] = $engine->getCandidateData(
                $fielddict,
                $candidates,
                null,
            );
        }
        return $this->_mergeIterators($candidates, $dataiterators, $fieldsarray);
    }

    /**
     * Merge all iterators into a single iterator.
     *
     * Each yield from the combined iterator is a CandID => row result
     * where row is an array of the same length as fields and the i'th
     * index is the value for field i.
     *
     * It is expected that the iterators return values sorted by CandID.
     *
     * @param array $candidates The candidates we expect results for
     * @param array $iterators  The iterators to combine
     * @param array $fields     The expected fields
     *
     * @return \Traversable
     */
    private function _mergeIterators(
        array $candidates,
        array $iterators,
        array $fields,
    ) {
        foreach ($candidates as $candID) {
            $val = [];
            // Initialize the row to ensure there's no unset indexes for
            // the DataIteratorBinaryStream when it does array_join.
            for ($i = 0; $i < count($fields); $i++) {
                $val[$i] = '';
            }

            // Go through each module, if it has data for this candidate
            // put it in the appropriate columns.
            foreach ($iterators as $modulename => $moduledata) {
                if (is_array($moduledata)) {
                    continue;
                }
                if (!$moduledata->valid()) {
                    continue;
                }
                // modcandidate is the next candidate with data available for
                // this module iterator.

                $modcandidate = $moduledata->key();

                // The candidate data must have been sorted by
                // CandID for our logic to work.
                // Convert to an int for the comparison so that <=
                // works. (We can't do a <= comparison on a CandID
                // object)
                assert("$candID" <= "$modcandidate");

                // If the module has data for this candID, populate it,
                // if not, don't advance the iterator.
                if ("$modcandidate" == "$candID") {
                    // Go through each field and put the data in the right
                    // index if applicable.
                    $data = $moduledata->current();
                    foreach ($fields as $idx => $field) {
                        if ($field['module'] != $modulename) {
                            continue;
                        }
                        $fname = $field['field'];
                        if (!isset($data[$fname])) {
                            continue;
                        }
                        $d         = $data[$fname];
                        $val[$idx] = json_encode($d);
                    }

                    // Advance this iterator to the next row
                    // now that we've dealt with this CandID for
                    // this module.
                    $moduledata->next();
                }
            }

            // We've went through all the module iterators and can
            // now yield the value for this CandID's row.
            yield "$candID" => $val;
        }
    }

    /**
     * Flattens an engine's dictionary into an array without categories
     *
     * @param \Loris\Data\Query\QueryEngine $engine The engine whose dictionary
     *                                              should be flattened.
     *
     * @return array
     */
    public function getFlattenedDictionary(\LORIS\Data\Query\QueryEngine $engine)
    {
        $rawdict = $engine->getDataDictionary();

        // Flattened dictionary without categories
        $dict = [];

        foreach ($rawdict as $cat) {
            foreach ($cat->getItems() as $item) {
                $dict[$item->getName()] = $item;
            }
        }
        return $dict;
    }
}
