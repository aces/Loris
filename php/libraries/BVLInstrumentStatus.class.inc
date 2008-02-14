<?php
require_once "BVLInstrument.class.inc";
/**
 * manages status of a behavioral instrument
 *
 * this class handles behavioural instrument meta-data. It's
 * properties and methods provide all data and functions to be able to
 * include the instrument into the behavioral battery.
 * This way we can directly include all element in the instrument's
 * .inc file.
 * - _flag_table_data()
 *  meta_data about the candidate, time point, cohort, 
 * - _update_data_entry_()
 *  this updates the data entry status in the flag table for an instrument
 * - _update_administration()
 * - _update_validity()
 * - _update_exclusion()
 * - update_instrument_flags()
 *
 * @access public
 * @package garbage
 */
class BVLInstrumentStatus extends BVLInstrument
{
}
?>