<?php
require_once "NDB_Form.class.inc";

/**
 * The forms for the new profile menu
 * @package main
 */
class NDB_Form_demographics extends NDB_Form
{
    
    var $_settableValues = array('Gender','Ethnicity','ZIP','Sibling1','Sibling2','Sibling3');
    
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // check that the $candID is passed b/c the profile needs to be opened
        if ($this->identifier != $_REQUEST['candID']) {
            return PEAR::raiseError("NDB_Form_demographics::_access: Candidate Profile Error (".$_REQUEST['candID']."): ");
        }

        $candidate =& Candidate::singleton($this->identifier);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        // check user permissions
    	return ($user->hasPermission('data_entry') && $user->getData('CenterID') == $candidate->getData('CenterID'));
    }

    function _getDefaults()
    {
        $candidate =& Candidate::singleton($this->identifier);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        foreach ($this->_settableValues as $val) {
            $defaults[$val] = $candidate->getData($val);
            if (Utility::isErrorX($defaults[$val])) {
                return PEAR::raiseError("NDB_Form_demographics::_getDefaults: ".$defaults[$val]->getMessage());
            }
        }

        return $defaults;
    }

    function _process($values)
    {
        if(!is_array($values) || count($values) ==0) {
        	return true;
        }

        $candidate =& Candidate::singleton($this->identifier);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        // save the values
        $success = $candidate->setData($values);
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("NDB_Form_demographics::_process: ".$success->getMessage());
        }

        $this->tpl_data['success'] = true;

        // freeze it, just in case
        $this->form->freeze();
    }

    function demographics()
    {
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }

        $ethnicityList = array(null=>'');
        $success = Utility::getEthnicityList();
        if (Utility::isErrorX($success)) {
        	return PEAR::raiseError("Utility::getEthnicityList error: ".$success->getMessage());
        }
        $ethnicityList = array_merge($ethnicityList,$success);
        unset($success);
        
        $candidate =& Candidate::singleton($this->identifier);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        // candID
        $this->tpl_data['candID'] = $candidate->getData('CandID');

        // gender
//        $this->form->addElement('select', 'Gender', "Gender:", array(null=>'', 'Male'=>'Male', 'Female'=>'Female'));
//        $this->form->addRule('Gender', 'Gender is required', 'required');

        // ethnicity
        $this->form->addElement('select', 'Ethnicity', 'Ethnicity:', $ethnicityList);
        $this->form->addRule('Ethnicity', 'Ethnicity is required', 'required');
    
        // ZIP code
        $this->form->addElement('text', 'ZIP', 'ZIP CODE:', array("size"=>13, "maxlength"=>12));
        
        // siblings
        $this->form->addElement('text', 'Sibling1', "Candidate's sibling (study participant):", array("size"=>7, "maxlength"=>6));
        $this->form->addElement('text', 'Sibling2', "Candidate's sibling (study participant):", array("size"=>7, "maxlength"=>6));
        $this->form->addElement('text', 'Sibling3', "Candidate's sibling (study participant):", array("size"=>7, "maxlength"=>6));
        $this->form->addRule('Sibling1', 'numbers only!', 'numeric');
        $this->form->addRule('Sibling2', 'numbers only!', 'numeric');
        $this->form->addRule('Sibling3', 'numbers only!', 'numeric');
    }
}
?>
