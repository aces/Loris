<?php
/**
 * This class handle file uploading for the genomic module
 *
 * PHP version 7
 *
 * @category    LORIS_Module
 * @package     Genomics
 * @author      Loris team <info-loris.mni@mcgill.ca>
 * @contributor Xavier <xavier.lecoursboucher@mcgill.ca>
 * @license     http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link        https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser;

/**
 * This class is to provide a uploader tool to keep genomic
 * files into LORIS.
 *
 * @category    LORIS_Module
 * @package     Genomics
 * @author      Loris team <info-loris.mni@mcgill.ca>
 * @contributor Xavier <xavier.lecoursboucher@mcgill.ca>
 * @license     http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link        https://github.com/aces/Loris
 */
class Genomic_File_Uploader extends \NDB_Menu_Filter
{

    var $AjaxModule = true;

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privileges
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            array(
                'genomic_browser_view_allsites',
                'genomic_browser_view_site',
            )
        );
    }


    /**
     * Function _setupVariables
     *
     * @return void
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns = array(
            'GenomicFileID',
            'FileName',
            'Description',
            'FileType',
            'Date_inserted',
            'InsertedByUserID',
            'Caveat',
            'Notes',
        );

        // This variable will be used by the columnFormatter javascript
        // to set the default hidden columns in the data table.
        $this->tpl_data['hiddenHeaders'] = json_encode(
            array_map(
                function ($header) {
                        return ucwords(str_replace('_', ' ', $header));
                },
                array()
            )
        );

        $this->query = " FROM genomic_files WHERE 1=1 ";

        $this->validFilters = array(
            'GenomicFileID',
            'FileName',
            'Description',
            'FileType',
            'Date_inserted',
            'InsertedByUserID',
            'Caveat',
            'Notes',
        );

        $this->formToFilter = array(
            'file_name'         => 'FileName',
            'description'       => 'Description',
            'genomic_file_type' => 'FileType',
            'date_inserted'     => 'Date_inserted',
            'caveat'            => 'Caveat',
            'notes'             => 'Notes',
        );

        $this->EqualityFilters = array(
            'FileType',
            'Caveat',
        );

    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        // ------------------------------------------------------------
        // ----------------- Genomic Files Filters --------------------
        // ------------------------------------------------------------

        $this->addBasicText('file_name', 'Name:');

        $this->addBasicText('description', 'Description:');

        $this->addBasicText('date_inserted', 'Date inserted:');

        $this->addBasicText('notes', 'Notes:');

        $this->addBasicText('genomic_file_type', 'Type:');

        $Base_options = $this->getDistinctValues(
            'genomic_files',
            'Caveat'
        );
        $this->addCheckbox('caveat', 'Caveat:', $Base_options);

        $user = \User::singleton();
        $this->tpl_data['user']           = $user->getUsername();
        $this->tpl_data['upload_allowed'] = $user->hasPermission(
            'genomic_data_manager'
        );

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
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/genomic_browser/js/genomic_browser.js",
                $baseURL . "/genomic_browser/js/genomic_file_uploader.js",
                $baseURL . "/genomic_browser/js/FileUploadModal.js",
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
        $DB      = \Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[str_replace(' ', '_', $value)] = $value;
                }
                return $carry;
            },
            array(null => 'Any')
        );

    }
}

