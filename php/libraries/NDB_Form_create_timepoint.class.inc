<?php
require_once "NDB_Form.class.inc";

/**
 * The forms for the new profile menu
 * @package main
 */
class NDB_Form_create_timepoint extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $candidate =& Candidate::singleton($this->identifier);
        if (PEAR::isError($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        // check user permissions
    	return ($user->hasPermission('data_entry') && $user->getData('CenterID') == $candidate->getData('CenterID'));
    }

    function _getDefaults()
    {
        $candidate =& Candidate::singleton($this->identifier);
        if (PEAR::isError($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        $defaults['visitLabel'] = $candidate->getNextVisitLabel();
        if (PEAR::isError($defaults['visitLabel'])) {
            return PEAR::raiseError("create_timepoint::_getDefaults(): ".$defaults['visitLabel']->getMessage());
        }

        return $defaults;
    }

    function _process($values)
    {
        $success = TimePoint::createNew($this->identifier, $values['subprojectID'], $values['visitLabel']);
        if(PEAR::isError($success)) {
            return PEAR::raiseError("create_timepoint::_process(): ".$success->getMessage());
        }

        $this->tpl_data['success'] = true;

        // freeze it, just in case
        $this->form->freeze();
    }

    function create_timepoint()
    {
        $config =& NDB_Config::singleton();
              
        if(!empty($_GET['subprojectID']) && is_numeric($_GET['subprojectID'])){
            $this->subprojectID=$_GET['subprojectID'];
        }

        // cand ID
        $this->tpl_data['candID'] = $this->identifier;
        $this->form->addElement('hidden', 'candID', $this->identifier);
        
        
        // Sub Project
        $subprojectSettings= $config->getSetting('subprojects');
       
        //Loop through the subprojects to get an id out and to create the subproject drop down.
        $sp_labelOptions = array(null => '');
        foreach(Utility::toArray($subprojectSettings['subproject']) AS $subproject){
            // Leave default blank, don't take the first one
            //if($this->subprojectID==null){
            //    $this->subprojectID=$subproject['id'];
            //}
            $sp_labelOptions[$subproject['id']] = $subproject['title'];
        }
        
        $attributes=array("onchange"=>"location.href='main.php?test_name=create_timepoint&candID=".$this->identifier."&identifier=".$this->identifier."&subprojectID='+this[this.selectedIndex].value;");
        $this->form->addElement('select', 'subprojectID', 'Subproject', $sp_labelOptions, $attributes);
        $this->form->setDefaults(array("subprojectID"=>$this->subprojectID));
        
        
        // visit label
        $visitLabelSettings = $config->getSetting('visitLabel');

        foreach(Utility::toArray($visitLabelSettings) AS $visitLabel){
            if($visitLabel['@']['subprojectID']==$this->subprojectID){
                if ($visitLabel['generation'] == 'user') {
                    $this->form->addElement('text', 'visitLabel', 'Visit label', array('size' => $visitLabel['length'] + 1, 'maxlength' => $visitLabel['length']));
                } elseif ($visitLabel['generation'] == 'sequence') {
                    $labelOptions[''] = null;
                    foreach (Utility::toArray($visitLabel['labelSet']['item']) AS $item) {
                        $labelOptions[$item['@']['value']] = $item['#'];
                    }
                    $this->form->addElement('select', 'visitLabel', 'Visit label', $labelOptions);
                }
            }
        }
    
        // label rules
        $this->form->addRule('visitLabel', 'Visit label is required', 'required');

        $this->form->addFormRule(array(&$this, '_validate'));
    }
    
    
    
    function _validate($values)
    {
        $config =& NDB_Config::singleton();
        $visitLabelSettings = $config->getSetting('visitLabel');
        foreach($visitLabelSettings AS $visitLabel){
            if($visitLabel['@']['subprojectID']==$values['subprojectID']){
                $visitLabelSettings=$visitLabel;
                break;
            }
        }
        
        $errors = array();
        
        // This can happen if the user quickly clicks "Create Time Point" before the page has loaded
        // and the Visit Label dropdown hasn't been selected yet. The page will create "V1" when this
        // is the case without this check.
        if(empty($values['visitLabel'])) {
            $errors['visitLabel'] = 'A visit label is required for creating a timepoint.';
        }
        // make sure the user entered a valid visit label
        if ($visitLabelSettings['generation'] == 'user') {
            if (!preg_match($visitLabelSettings['regex'], $values['visitLabel'])) {
                $errors['visitLabel'] = 'This visit label does not match the required structure.  See your project manual for more details.';
            }
        }

        $candidate =& Candidate::singleton($this->identifier);
        if (PEAR::isError($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        $timePointArray = $candidate->getListOfVisitLabels();
        if (PEAR::isError($timePointArray)) {
            return PEAR::raiseError("create_timepoint::_validate(): ".$timePointArray->getMessage());
        }

        //If the visitLabel is already in use then let the user pick another
        foreach($timePointArray AS $used_label) {
            if(strcasecmp($values['visitLabel'], $used_label) == 0) {
                $errors['visitLabel'] = 'This visit label is not unique.';
            }
        }

        return $errors;
    }

}
?>
