<?php
/**
 *
 * PHP version 5
 *
 * @category Genomic
 * @package  Main
 * @author      Loris team <info-loris.mni@mcgill.ca>
 * @contributor Xavier <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_genomic_file_uploader Class
 *
 * This class is to provide a uploader tool to keep genomic
 * files into LORIS.
 *
 * @category    Genomic
 * @package     Main
 * @author      Loris team <info-loris.mni@mcgill.ca>
 * @contributor Xavier <xavier.lecoursboucher@mcgill.ca>
 * @license     http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link        https://github.com/aces/Loris
*/
class NDB_Menu_Filter_Genomic_File_Uploader extends NDB_Menu_Filter
{

    var $AjaxModule = true;

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privileges
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return ($user->hasPermission('genomic_browser_view_allsites')
                || $user->hasPermission('genomic_browser_view_site'));
    }


    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */
    function _setupVariables()
    {
        // set the class variables
        $this->_displayBrief = !(isset($_REQUEST['format']));
        $this->columns       = array(
                                'file_id',
                                'file_name',
                                'absolute_path',
                                'description',
                                'genomic_file_type',
                                'date_inserted',
                                'user_inserted',
                                'caveat',
                                'notes',
                               );

        // Chromosome from genome_loc table
        // INNER JOIN on table.
        // If a candidate has no CPG records, they will not appear.
        $this->query = " FROM genomic_file WHERE 1=1 ";

        $this->validFilters = array(
                               'file_id',
                               'file_name',
                               'description',
                               'genomic_file_type',
                               'date_inserted',
                               'caveat',
                               'notes',
                              );

        $this->formToFilter = array(
                               'file_name'      => 'file_name',
                               'description'   => 'description',
                               'genomic_file_type'      => 'genomic_file_type',
                               'date_inserted' => 'date_inserted',
                               'caveat'        => 'caveat',
                               'notes'         => 'notes',
                              );

        $this->EqualityFilters = array(
                                  'genomic_file_type',
                                  'caveat',
                                 );

        return true;
    }

    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return bool
     */
    function _setFilterForm()
    {
        // ------------------------------------------------------------
        // ----------------- Genomic Files Filters --------------------
        // ------------------------------------------------------------

        $this->addBasicText('file_name', 'Name:');

        $this->addBasicText('description', 'Description:');

        $this->addBasicText('date_inserted', 'Date inserted:');

        $this->addBasicText('notes', 'Notes:');

        $Base_options = $this->getDistinctValues(
            'genomic_file_type_enum',
            'genomic_file_type'
        );
        $this->addSelect('genomic_file_type', 'Type:', $Base_options);

        $this->tpl_data['genomic_file_type'] = $Base_options; 

        $Base_options = $this->getDistinctValues(
            'genomic_file',
            'caveat'
        );
        $this->addCheckbox('caveat', 'Caveat:', $Base_options);

        return true;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/genomic_browser/js/genomic_file_uploader.js",
            )
        );
    }

    /**
     * Provide an array of distinct value from a column in
     * the specified table. The first element has a null key and
     * its value is 'Any'.
     *
     * @param string $table  The tables name
     * @param string $column The column name
     *
     * @return array An array where value are keys as well as values
     */
    function getDistinctValues( $table, $column)
    {
        $DB      = Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[$value] = $value;
                }
                return $carry;
            },
            array(null => 'Any')
        );

    }
}
?>
