<?php
/**
 * File implements the JSONToolkit class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Behavioural
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

/**
 * JSON data toolkit class.
 *
 * This class provides a toolkit for accessing and manipulating
 * JSON instrument data.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */


class JSONToolkit
{
    var $instrName;
    var $flagData;
    var $metadataFields = array(
        'Date_taken',
        'Examiner',
        'Candidate_Age',
        'Window_Difference'
    );

    /**
     * JSONToolkit constructor.
     *
     * @param string $instrumentName Name of instrument whose data to manipulate
     * @throws \LorisException
     */
    function __construct(string $instrumentName)
    {
        $db = \Database::singleton();

        $checkInstrument = $db->pselect(
            "SELECT Test_name FROM test_battery WHERE Test_name=:tbln",
            array("tbln" => $instrumentName)
        );
        if (empty($checkInstrument)) {
            throw new \Exception("The instrument ". $instrumentName . "was not found in the database.");
        }

        $queryData = $db->pselectWithIndexKey(
            "SELECT CommentID, Data FROM flag WHERE Test_name =:tbln",
            array("tbln" => $instrumentName),
            'CommentID'
        );

        $this->instrName = $instrumentName;
        $this->flagData = $queryData;
    }

    /**
     * Select list of CommentIDs where a field has certain value
     *
     * @param array $conditionArray     The array of conditions to meet for selection
     *                                  Given as field => value, checks if the value at field === value
     * @return array                    List of commentIDs
     */
    public function selectCMIDs(array $conditionArray) : array
    {
        // Function specifying what to select
        $fn = function(& $cmids, $cmid, $instrData) {
            $cmids[] = $cmid;
        };
        return $this->genericSelect($conditionArray, $fn);
    }

    /**
     * Select all data where a field has certain value
     *
     * @param array $conditionArray     Array of conditions to meet for selection
     *                                  Given as field => value, checks if the value at field === value
     * @return array                    Array of instrument data with CommentID as key
     */
    public function selectAll(array $conditionArray) : array
    {
        // Function specifying what to select
        $fn = function(& $results, $cmid, $instrData) {
            $results[$cmid] = $instrData;
        };
        return $this->genericSelect($conditionArray, $fn);
    }

    /**
     * Select value of $selected when $field has $val
     *
     * @param string $selected          Name of field to return values of
     * @param array $conditionArray     Array of conditions to meet for selection
     *                                  Given as field => value, checks if the value at field === value
     * @return array                    Array of values for $selected
     *                                  CommentID as key
     */
    public function selectField(
        string $selected,
        array $conditionArray
    ) : array {
        // Function specifying what to select
        $fn = function(& $results, $cmid, $instrData) use($selected) {
            if(key_exists($selected, $instrData)) {
                $results[$cmid] = $instrData[$selected];
            }
        };
        return $this->genericSelect($conditionArray, $fn);
    }

    /**
     * Generic method for selecting values that meet conditions
     * Customization through function parameter
     *
     * @param array $conditionArray     Array of conditions to meet for selection
     *                                  Given as field => value, checks if the value at field === value
     * @param callable $fn              Function that specifies how the return array is constructed
     *
     * @return array                    Array of values that meet conditions, constructed by $fn
     *                                  CommentID as key.
     */
    public function genericSelect(
        array $conditionArray,
        callable $fn
    ) : array {
        $results = array();
        foreach ($this->flagData as $cmid => $data) {
            if (is_null($data['Data'])) {
                continue;
            }

            // array of instrument data
            $instrData = json_decode($data['Data'], true);

            // perform operation from anonymous function if conditions are met
            if ($this->checkConditions($instrData, $conditionArray)) {
                $fn($results, $cmid, $instrData);
            }
        }
        return $results;
    }

    /**
     * Renames field of instrument
     *
     * @param string $oldName   Name of field to rename
     * @param string $newName   What the field will be renamed as
     *
     * @return int              Return number of fields altered
     * @throws \DatabaseException
     */
    public function rename(
        string $oldName,
        string $newName
    ) : int {
        // Function specifying rename operation
        $fn = function($instrData, $oldName) use($newName) {
            // Make sure a field $newName does not already exist
            if(!key_exists($newName, $instrData)) {
                // rename field in array
                $fieldNames = array_keys($instrData);
                $fieldNames[array_search($oldName, $fieldNames)] = $newName;
                $instrData = array_combine($fieldNames, $instrData);
                return $instrData;
            } else {
                // return null if no change is made
                return null;
            }
        };

        return $this->genericOperation(
            $oldName,
            $fn
        );
    }

    /**
     * Drop field from instrument data
     *
     * @param string $field     Name of field to be dropped
     *
     * @return int              Return number of fields altered
     * @throws \DatabaseException
     */
    public function drop(string $field) : int
    {
        // Function specifying drop operation
        $fn = function($instrData, $field) {
            unset($instrData[$field]);
            return $instrData;
        };
        return $this->genericOperation($field, $fn);
    }

    /**
     * Generic method for performing operations directly on flag table
     * Customization through function parameter
     *
     * @param string $field A field to check for before performing operation
     * @param callable $fn Function that specifies how the return array is constructed
     *
     * @return int              Number of fields altered
     * @throws \DatabaseException
     */
    public function genericOperation(
        string $field,
        callable $fn
    ) : int {

        // Do not modify if metadata field
        if($this->checkMetaData($field)) {
            throw new \Exception("Modification of metadata field forbidden.");
        }

        $dataAltered = 0;

        foreach ($this->flagData as $cmid => $data) {
            // Continue if data is empty
            if (is_null($data['Data'])) {
                continue;
            }

            // Array of instrument data
            $instrData = json_decode($data['Data'], true);

            // Only operate if field exists
            if (key_exists($field, $instrData)) {

                // set instrument data using function parameter
                $instrData = $fn($instrData, $field);

                if (!isset($instrData)) {
                    continue;
                }

                $instrument = \NDB_BVL_Instrument::factory($this->instrName, $cmid, '', true);

                // Unset metadata fields for validation
                $validationData = $instrData;
                foreach ($this->metadataFields as $meta) {
                    unset($validationData[$meta]);
                }

                // If valid, save values
                if ($instrument->form->validate($validationData)) {
                    // update values
                    $newData = json_encode($instrData);

                    // Update flagData variable
                    $this->flagdata[$cmid]['Data'] = $newData;

                    // Update database
                    $db = \Database::singleton();
                    $db->unsafeupdate(
                        "flag",
                        array("Data" => $newData),
                        array("CommentID" => $cmid)
                    );
                    $dataAltered++;
                    $instrument->score();
                } else {
                    throw new \Exception("Operation can not be performed due to a validation error for CommentID $cmid.");
                }
            }
        }

        if($dataAltered) {
            $this->resetFlag();
        }
        return $dataAltered;
    }

    /**
     * Alter value of a field
     * (Alter value of $field to $newVal if the
     * $conditionalField has value $conditionalValue)
     *
     * @param string $field             The name of field whos data will be changed.
     * @param string $newVal            The value that the field will be changed to.
     * @param array $conditionArray     The array of conditions to meet for modification
     *                                  Given as field => value, checks if the value at field === value
     *
     * @return int                      Return number of fields altered
     * @throws \DatabaseException
     * @throws \LorisException
     * @throws \NotFound
     */
    public function modify(
        string $field,
        string $newVal,
        array $conditionArray
    ) : int {
        // Simple modification function, setting field to new value
        $fn = function($value) use($newVal) {
            return $newVal === 'null' ? null : $newVal;
        };
        return $this->customModify(
            $fn,
            $field,
            $conditionArray
        );
    }

    /**
     * Alter value of a field using given operation
     *
     * @param callable $fn                  Function containing the operation to be done
     *                                      on the specified field
     * @param string $field                 The name of the field to modify
     * @param array|null $conditionArray    The array of conditions to meet for modification
     *                                      Given as field => value, checks if the value at field === value
     *
     * @return int                          Return number of fields altered
     * @throws \DatabaseException
     * @throws \LorisException
     * @throws \NotFound
     *
     */
    public function customModify(
        callable $fn,
        string $field,
        ?array $conditionArray = null
    ) : int {

        // Do not modify if metadata field
        if($this->checkMetaData($field)) {
            throw new  \Exception("Modification of metadata field forbidden.");
        }

        $dataAltered = 0;
        foreach ($this->flagData as $cmid => $data) {
            // Continue if data is empty
            if (is_null($data['Data'])) {
                continue;
            }

            // Array of instrument data
            $instrData = json_decode($data['Data'], true);

            // Continue if field does not exist
            if (!key_exists($field, $instrData)) {
                continue;
            }

            // If conditions given, check if conditions are met
            if (isset($conditionArray) && !$this->checkConditions($instrData, $conditionArray)) {
                continue;
            }

            $oldVal = $instrData[$field];
            $newVal = $fn($instrData[$field]);

            // If field already has the new value, continue
            if($newVal === $oldVal) {
                continue;
            }

            // set new value
            $instrData[$field] = $newVal;

            $instrument = \NDB_BVL_Instrument::factory($this->instrName, $cmid, '', true);

            // Unset metadata fields before validating
            $validationData = $instrData;
            foreach ($this->metadataFields as $meta) {
                unset($validationData[$meta]);
            }

            // if validated, save values
            if ($instrument->form->validate($validationData)) {
                $instrument->_saveValues($instrData);
                $dataAltered++;
                $instrument->score();
            } else {
                throw new \Exception("Operation can not be performed due to a validation error for CommentID $cmid.");
            }
        }
        // If any data was altered, reset the flag data variable
        if($dataAltered) {
            $this->resetFlag();
        }
        return $dataAltered;
    }


    /**
     * Check if there is a status field in
     * an instrument's data for a given fieldname
     * (e.g. $field "name" given: search for "name_status")
     *
     * @param string $field     Name of the field to check for relative status field
     *
     * @return bool             Return true if status field found
     */
    public function checkStatusField(string $field) : bool
    {
        foreach ($this->flagData as $cmid => $data) {
            if (is_null($data['Data'])) {
                continue;
            }

            // Array of instrument data
            $instrData = json_decode($data['Data'], true);

            // Check for status field
            if (isset($instrData[$field . "_status"])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks whether all conditions are met in an array of data
     *
     * @param array $data               The array of data to parse through for conditions
     * @param array $conditionArray     The conditions to check for in the data
     *                                  Given as field => value, checks if the value at field === value
     *
     * @return bool                     Return true if all conditions met
     */
    public function checkConditions(
        array $data,
        array $conditionArray
    ) : bool {
        $pass = true;

        foreach($conditionArray as $field => $value) {
            if (!key_exists($field, $data)) {
                // if the field does not exist in the data, condition not met
                $pass = false;
            } elseif ($data[$field] != $value &&
                !($value === 'null' && empty($data[$field]))
            ) {
                // if the value does not match the data value, condition not met
                // including null option
                $pass = false;
            }
        }
        return $pass;
    }

    /**
     * Checks whether the field passed is a metadata field
     *
     * @param string $field     The field to check
     *
     * @return bool             Return true if metadata field
     */
    public function checkMetaData(string $field) : bool
    {
        return in_array($field, $this->metadataFields);
    }

    /**
     * Resets flagData variable with query to DB
     */
    public function resetFlag() : void
    {
        $db = \Database::singleton();
        $queryData = $db->pselectWithIndexKey(
            "SELECT CommentID, Data FROM flag WHERE Test_name =:tbln",
            array("tbln" => $this->instrName),
            'CommentID'
        );
        $this->flagData = $queryData;
    }
}
