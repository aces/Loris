<?php
/**
 * This file contains the NDB_Form_create_timepoint class
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\create_timepoint;

/**
 * The forms for the new profile menu
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class Create_Timepoint extends \NDB_Form
{
    /**
     * The subprojectID being created
     */
    var $subprojectID;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();

        $candidate =& \Candidate::singleton($this->identifier);

        // check user permissions
        return (
            $user->hasPermission('data_entry') &&
            $user->getData('CenterID') == $candidate->getData('CenterID')
        );
    }

    /**
     * Returns the form-specific defaults
     *
     * @return array
     */
    function _getDefaults()
    {
        $candidate =& \Candidate::singleton($this->identifier);

        $defaults['visitLabel'] = $candidate->getNextVisitLabel();
        return $defaults;
    }

    /**
     * Processes the values and saves to database. Usually overridden
     * by form instance.
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        $success = \TimePoint::createNew(
            $this->identifier,
            $values['subprojectID'],
            $values['visitLabel']
        );

        $this->tpl_data['success'] = true;

        // freeze it, just in case
        $this->form->freeze();
    }

    /**
     * Does the setup required for this page.
     * Particularly creates all the form elements.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $config =& \NDB_Config::singleton();
        if (!empty($_GET['subprojectID']) && is_numeric($_GET['subprojectID'])) {
            $this->subprojectID =$_GET['subprojectID'];
        }

        // cand ID
        $this->tpl_data['candID'] = $this->identifier;

        $this->addHidden('candID', $this->identifier);

        $candidate   =& \Candidate::singleton($this->identifier);
        $subprojList = null;
        //List of valid subprojects for a given project
        if ($config->getSetting('useProjects') === 'true') {
            $subprojList = $candidate->getValidSubprojects();
        }
        // List of all subprojects from config file

        // Loop through the subprojects to get an id out and to create
        // the subproject drop down.
        $allSubprojects  = \Utility::getSubprojectList();
        $sp_labelOptions = array(null => '');

        foreach ($allSubprojects as $subprojectID => $title) {
            if (! empty($subprojList)) {
                if (in_array($subprojectID, $subprojList)) {
                    $sp_labelOptions[$subprojectID] = $title;
                }
            } else {
                $sp_labelOptions[$subprojectID] = $title;
            }
        }

        $attributes = array(
                       "onchange" => "location.href='?test_name=create_timepoint" .
                        "&candID=" . $this->identifier .
                        "&identifier=" . $this->identifier .
                        "&subprojectID='+this[this.selectedIndex].value;",
                      );
        $this->addSelect(
            'subprojectID',
            'Subproject',
            $sp_labelOptions,
            $attributes
        );
        $this->addRule('subprojectID', 'A Subproject ID is required', 'required');
        $this->_setDefaults(array("subprojectID" => $this->subprojectID));

        // visit label
        $visitLabelSettings = $config->getSetting('visitLabel');
        $visitLabelAdded    = false;

        foreach (\Utility::toArray($visitLabelSettings) as $visitLabel) {
            if ($visitLabel['@']['subprojectID']==$this->subprojectID) {
                if ($visitLabel['generation'] == 'user') {
                    error_log(
                        "DEPRECATION WARNING: User generated visit labels will ".
                        "no longer be supported in the next release of Loris. ".
                        "Please add the necessary entries to the config.xml file ".
                        "and set the generation to 'sequence'"
                    );
                    $this->addBasicText(
                        'visitLabel',
                        'Visit label',
                        array(
                         'size'      => $visitLabel['length'] + 1,
                         'maxlength' => $visitLabel['length'],
                        )
                    );
                    $visitLabelAdded = true;
                } elseif ($visitLabel['generation'] == 'sequence') {
                    $labelOptions[''] = null;
                    $items            = \Utility::toArray(
                        $visitLabel['labelSet']['item']
                    );
                    foreach ($items as $item) {
                        $labelOptions[$item['@']['value']] = $item['#'];
                    }
                    $this->addSelect('visitLabel', 'Visit label', $labelOptions);
                    $visitLabelAdded = true;
                }
            }
        }

        // label rules
        if ($visitLabelAdded) {
            $this->addRule('visitLabel', 'Visit label is required', 'required');
        }

        $this->form->addFormRule(array(&$this, '_validate'));

    }


    /**
     * Validates user form selection
     *
     * @param array $values array of form values
     *
     * @return array
     */
    function _validate($values)
    {
        $config =& \NDB_Config::singleton();
        $visitLabelSettings = $config->getSetting('visitLabel');
        foreach (\Utility::toArray($visitLabelSettings) as $visitLabel) {
            if ($visitLabel['@']['subprojectID'] == $values['subprojectID']) {
                $visitLabelSettings =$visitLabel;
                break;
            }
        }

        $errors = array();

        // This can happen if the user quickly clicks "Create Time Point" before the
        // page has loaded and the Visit Label dropdown hasn't been selected yet.
        // The page will create "V1" when this is the case without this check.
        if (empty($values['visitLabel'])) {
            $errors['visitLabel']
                = 'A visit label is required for creating a timepoint.';
        }
        // make sure the user entered a valid visit label
        if ($visitLabelSettings['generation'] == 'user') {
            if (!preg_match($visitLabelSettings['regex'], $values['visitLabel'])) {
                $errors['visitLabel'] = 'This visit label does not match the ' .
                    'required structure. See your project manual for more details.';
            }
        }

        $candidate =& \Candidate::singleton($this->identifier);

        $timePointArray = $candidate->getListOfVisitLabels();

        //If the visitLabel is already in use then let the user pick another
        foreach ($timePointArray AS $used_label) {
            if (strcasecmp($values['visitLabel'], $used_label) == 0) {
                $errors['visitLabel'] = 'This visit label is not unique.';
            }
        }

        return $errors;
    }

}
?>
