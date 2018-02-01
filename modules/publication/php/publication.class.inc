<?php
/**
 * Publications module class
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   David Blader  <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/mohadesz/Loris-Trunk
 */
namespace LORIS\publication;

/**
 * Module for viewing research project proposals and their respective publications
 *
 * @category Behavioural
 * @package  Main
 * @author   David Blader  <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Publication extends \NDB_Menu_Filter_Form
{
    public $AjaxModule   = true;
    public $skipTemplate = true;
    /**
     * The _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user = \User::singleton();
        return ($user->hasPermission('publication_view')
            || $user->hasPermission('publication_propose')
            || $user->hasPermission('publication_approve')
        );
    }

    /**
     * Sets up the Filter Variables
     *
     * @return boolean
     */
    function _setupVariables()

    {
        $query = " FROM publication p ".
            "LEFT JOIN publication_status ps ON ps.PublicationStatusID=p.PublicationStatusID ".
            "LEFT JOIN publication_parameter_type_rel pptr ON p.PublicationID=pptr.PublicationID ".
            "LEFT JOIN parameter_type pt ON pt.ParameterTypeID=pptr.ParameterTypeID " .
            "LEFT JOIN publication_keyword_rel pkr ON p.PublicationID=pkr.PublicationID ".
            "LEFT JOIN publication_keyword pk ON pkr.PublicationKeywordID=pk.PublicationKeywordID ";
        $query .= " WHERE 1=1 ";
        $query .= " GROUP BY p.PublicationID ";

        $this->columns = array(
            'p.Title',
            'p.LeadInvestigator',
            'p.DateProposed',
            'ps.Label',
            'p.Description',
            'GROUP_CONCAT(pt.Name)', // Variables of Interest
            'GROUP_CONCAT(pk.Label)', // Keywords
            'p.PublicationID',
        );

        $this->query = $query;
        $this->headers = array(
            'Title',
            'Lead Investigator',
            'Date Proposed',
            'Approval Status',
            'Description',
            'Variables Of Interest',
            'Keywords',
            'Publication ID'
        );


        $this->validFilters = array(
            'p.Title',
            'p.ApprovalStatus',
            'pk.Label',
            'p.LeadInvestigator',
            'pt.Name',
        );

        $this->formToFilter = array(
            'titleOrDescription'  => 'p.Title',
            'approvalStatus'      => 'ps.Label',
            'keywords'            => 'pk.Label',
            'variablesOfInterest' => 'pt.Name',
            'leadInvestigator'    => 'p.LeadInvestigator',
        );
        return true;
    }

    /**
     * Sets up the smarty menu filter items for publication
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return bool
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $db = \Database::singleton();
        $rawStatus = $db->pselectCol(
            'SELECT Label FROM publication_status',
            array()
        );
        $statusOptions = array();
        foreach($rawStatus as $rs) {
            $statusOptions[$rs] = $rs;
        }

        $this->addBasicText(
            'title',
            'Title'
        );
        $this->addSelect(
            'approvalStatus',
            'Approval Status',
            $statusOptions
        );

        $this->addBasicText(
            'leadInvestigator',
            'Lead Investigator'
        );

        $this->addBasicText(
            'keywords',
            'Keywords'
        );
        $this->addBasicText(
            'voi',
            'Variables of Interest'
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
                $baseURL . '/publication/js/publicationIndex.js'
            )
        );
    }

    /**
     * Include additional CSS files:
     *  imaging_uploader.css
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . '/publication/css/publication.css'
            )
        );
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result            = $this->toArray();
        $result['form']    = $this->form->form;

        return json_encode($result);
    }
}
?>
