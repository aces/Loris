<?php
require_once "NDB_Form.class.inc";

/**
 * The forms for the certification menu
 * @package behavioural
 */
class NDB_Form_certification extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $centerID = $DB->selectOne("SELECT centerID FROM examiners, cert_events WHERE examiners.examinerID = cert_events.examinerID AND cert_events.certID = '$this->identifier'");
        if (Utility::isErrorX($centerID)) {
            return PEAR::raiseError("DB Error: ".$centerID->getMessage());
        }

        return ($user->hasPermission('certification') && ($user->hasPermission('certification_multisite') || $user->getData('CenterID') == $centerID));
    }

    function _getDefaults()
    {
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $DB->select("SELECT ID FROM test_names", $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        /*
        foreach ($result as $row) {
            $defaults['pass['.$row['ID'].']'] = 'N/A';
        }
        */

        $defaults = array();

        if (!empty($this->identifier)) {
            // set the certificatione event details
            $DB->selectRow("SELECT examinerID, date_cert, candID, visit_label FROM cert_events WHERE certID = $this->identifier", $row);
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            // set the examiner ID
            $defaults['examinerID'] = $row['examinerID'];
            $defaults['cert_candID'] = $row['candID'];
            $defaults['cert_visit_label'] = $row['visit_label'];

            // set the date
            $date = explode('-', $row['date_cert']);
            $defaults['date_cert']['Y'] = $date[0];
            $defaults['date_cert']['M'] = $date[1];
            $defaults['date_cert']['d'] = $date[2];

            // set the certification results
            $DB->select("SELECT testID, pass, comment FROM cert_details WHERE certID = $this->identifier", $result);
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            foreach ($result as $row) {
                $defaults['pass['.$row['testID'].']'] = $row['pass'];
                $defaults['comment['.$row['testID'].']'] = $row['comment'];
            }


        }

        return $defaults;
    }


    function _process($values)
    {
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // format the date of certification
        $date_cert = sprintf("%04d-%02d-%02d", $values['date_cert']['Y'], $values['date_cert']['M'], $values['date_cert']['d']);

        if (empty($this->identifier)) {
            // insert the event
            $success = $DB->insert('cert_events', array(
                                                              'examinerID' => $values['examinerID'], 
                                                              'date_cert' => $date_cert,
                                                              'candID'    => $values['cert_candID'],
                                                              'visit_label'    => $values['cert_visit_label'],
                                                              ));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
            $this->identifier = $DB->lastInsertID;
        } else {
            // update the event
            $success = $DB->update('cert_events', array(
                                                              'examinerID' => $values['examinerID'], 
                                                              'date_cert' => $date_cert, 
                                                              'candID'    => $values['cert_candID'],
                                                              'visit_label'    => $values['cert_visit_label'],
                                                              ), array('certID' => $this->identifier));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }

        // delete the old event details
        $success = $DB->delete('cert_details', array('certID' => $this->identifier));
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        // insert the new event details
        foreach ($values['pass'] as $testID => $pass) {
            $values['comment'][$testID] = trim($values['comment'][$testID]);
            if (in_array($pass, array('Valid', 'Invalid', 'Invalid scoring')) || $values['comment'][$testID]!="") {
                $success = $DB->insert('cert_details', array(
                                                              'certID' => $this->identifier,
                                                              'testID' => $testID,
                                                              'pass' => $pass,
                                                              'comment' => $values['comment'][$testID]
                                                              ));
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
            }
        }

        $this->form->freeze();
    }

    function edit_event()
    {
        $this->redirect = "test_name=$this->name";

        //------------------------------------------------------------

        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');
        $dateOptions = array(
                             'language'        => 'en',
                             'format'          => 'YMd',
                             'addEmptyOption'  => true,
                             'minYear'         => $study['startYear'],
                             'maxYear'         => $study['endYear']
                             );

        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $DB->select("SELECT examinerID, concat(psc.Alias, ' - ', examiners.full_name) AS full_name FROM examiners, psc WHERE examiners.centerID=psc.CenterID ORDER BY full_name", $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
        $examinerOptions[0] = '';
        foreach ($result as $row) {
            $examinerOptions[$row['examinerID']] = $row['full_name'];
        }

        // examiner
        $this->addSelect('examinerID', 'Examiner', $examinerOptions); 
 // $this->addSelect('examinerID', 'Examiner', $examinerOptions);
        $this->addRule('examinerID', 'Examiner is required', 'required');

        // date of certification
        $this->addBasicDate('date_cert', "Date of testing", $dateOptions);
        $this->addRule('date_cert', 'Date of testing is required', 'required');

        // candid
        $this->addBasicText('cert_candID', 'DCCID');
        $this->addBasicText('cert_visit_label', 'Visit label');


        $DB->select("SELECT ID, Full_name FROM test_names ORDER BY Full_name", $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // table of tests
        $statusOptions = array(null=>'N/A',
                               'Valid'=>'Valid',
                               'Invalid'=>'Invalid',
                               'Invalid scoring'=>'Scoring Invalid',
                               'No QC'=>'No QC');
        
        foreach ($result as $row) {
            $this->addSelect('pass['.$row['ID'].']', $row['Full_name'], $statusOptions);
            //$this->form->addGroup($options, 'test_Group['.$row['ID'].']', $row['Full_name'], $this->_GUIDelimiter, FALSE);
            $this->addBasicText('comment['.$row['ID'].']', 'Comment');
        }

        $this->form->addFormRule(array(&$this, '_validate'));
    }

    function _validate($values)
    {
        $db =& Database::singleton();
        $errors = array();

        // make sure an examiner was selected
        if(empty($values['examinerID'])) $errors['examinerID'] = 'Examiner is required';

        // check date pairs
        if (empty($values['date_cert']['M']) && empty($values['date_cert']['d']) && empty($values['date_cert']['Y'])) {
            $errors['date_cert'] .= "Date is required. \n";
        }
        elseif (!_checkDate($values['date_cert'])) {
            $errors['date_cert'] = 'Date of testing is not a valid date.';
        }

        // check candid & visit_label
        if(!empty($values['cert_candID'])) {
            $idValid = $db->selectOne("SELECT COUNT(CandID) FROM candidate WHERE CandID=".$db->quote($values['cert_candID']));
            if(!$idValid) $errors['cert_candID'] = 'ID entered is not valid';

            if(empty($values['cert_visit_label'])) $errors['cert_visit_label'] = 'Visit label is required';
            else {
                $labelValid = $db->selectOne("SELECT COUNT(ID) FROM session WHERE CandID=".$db->quote($values['cert_candID'])." AND Visit_label=".$db->quote($values['cert_visit_label']));
                if(!$labelValid) $errors['cert_visit_label'] = 'Visit label entered is not valid';
            }
        }

        return $errors;
    }
}
?>
