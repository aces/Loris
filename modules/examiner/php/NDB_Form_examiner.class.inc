<?php
require_once "NDB_Form.class.inc";

/**
 * The forms for the certification menu
 * @package behavioural
 */
class NDB_Form_examiner extends NDB_Form
{
    function _hasAccess()
    {
        $user = User::singleton();
        $DB   = Database::singleton();

        // edit_examiner page
        if ($this->page == 'edit_examiner') {

            $centerID = $DB->pselectOne(
                "SELECT centerID 
                 FROM examiners, certification 
                 WHERE examiners.examinerID = certification.examinerID AND certification.examinerID =:EID",
                 array('EID'=>$this->identifier)
            );

            return ($user->hasPermission('examiner') 
                && ($user->hasPermission('examiner_multisite') || $user->getData('CenterID') == $centerID));

        // training page
        } elseif ($this->page == 'training') {

            $examiner = $DB->pselectOne(
                "SELECT examinerID FROM examiners WHERE full_name=:user",
                array('user'=>$user->getFullname()));
            
            if (empty($examiner)) {
                return false;
            } else {
                return true;
            }
        }

        return false;

    }

    function _getDefaults()
    {
        $DB = Database::singleton();

        // Get the certification history from the database
        $certification_history = $DB->pselect(
            "SELECT ch.userID, ch.changeDate, ch.old, ch.old_date, tn.Full_name as Measure, ch.primaryVals, ch.new, ch.new_date
             FROM certification_history ch
             LEFT JOIN test_names tn ON (ch.testID=tn.ID)
             LEFT JOIN certification c ON (c.certID=ch.primaryVals)
             WHERE c.examinerID=:EID
             ORDER BY changeDate DESC",
             array('EID'=>$this->identifier));

        // Create the table html for the certification history
        if (empty($certification_history)) {
            $defaults['certification_history'] .= '<tr><td colspan="7">' . 'No changes have been made' . '</td></tr>';
        } else {
            foreach($certification_history as $history_item) {
                $defaults['certification_history'] .= '<tr><td>' . $history_item['changeDate'] . '</td><td>' . $history_item['userID'] . '</td><td>' . $history_item['Measure'] . '</td><td>' . $history_item['old'] . '</td><td>' .  $history_item['old_date'] . '</td><td>' . $history_item['new'] . '</td><td>' . $history_item['new_date'] . '</td></tr>';
            }
        }

        // get the certification results for the given examiner
        $result = $DB->pselect("SELECT testID, pass, date_cert, comment FROM certification WHERE examinerID =:EID", array('EID'=> $this->identifier));

        // set the form defaults for the page
        foreach ($result as $row) {
            $defaults['date_cert['.$row['testID'].']'] = $row['date_cert'];
            $defaults['pass['.$row['testID'].']'] = $row['pass'];
            $defaults['comment['.$row['testID'].']'] = $row['comment'];
        }

        return $defaults;
    }


    function _process($values)
    {
        $DB = Database::singleton();

        foreach ($values['pass'] as $testID => $pass) {

            $date                       = $values['date_cert'][$testID];
            $values['comment'][$testID] = trim($values['comment'][$testID]);
            $date_cert                  = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);

            //if date is empty when saving, set to null, otherwise drop-downs display odd behaviour (populated with Nov-30)
            if ($date_cert == '0000-00-00') {
                $date_cert = null;
            }

            $certID = $DB->pselectOne("SELECT certID from certification where examinerID =:EID and testID=:TID", array('EID'=>$this->identifier, 'TID'=>$testID));


            if (empty($certID) && !empty($pass)) { // new test certification for the examiner
                $DB->insert('certification', array(
                    'examinerID'  => $this->identifier, 
                    'date_cert'   => $date_cert,
                    'testID'      => $testID,
                    'pass'        => $pass,
                    'comment'     => $values['comment'][$testID]
                ));
                $certID = $DB->pselectOne("SELECT certID from certification where examinerID =:EID and testID=:TID", array('EID'=>$this->identifier, 'TID'=>$testID));
                $DB->insert('certification_history', array(
                    'col'         => 'pass',
                    'new'         => $pass,
                    'new_date'    => $date_cert,
                    'primaryVals' => $certID,
                    'testID'      => $testID,
                    'visit_label' => $visit_label,
                    'changeDate'  => date("Y-m-d H:i:s"),
                    'userID'      => $_SESSION['State']->getUsername(),
                    'type'        => 'I'
                ));
            } else { // update to a test certification for the examiner

                //select history events
                $oldVals = $DB->pselectRow(
                    "SELECT ch.new, ch.new_date
                     FROM certification_history ch
                     LEFT JOIN certification c ON (c.certID=ch.primaryVals)
                     WHERE c.examinerID=:EID AND ch.testID=:TID
                     ORDER BY changeDate DESC", array('EID'=>$this->identifier, 'TID'=>$testID));

                $oldVal                     = $oldVals['new'];
                $oldDate                    = $oldVals['new_date'];

                $oldCertification = $DB->pselect(
                    "SELECT pass, date_cert, comment
                     FROM certification
                     WHERE examinerID=:EID AND testID =:TID", 
                     array('EID'=>$this->identifier, 'TID'=>$testID));

                // If one of the values was changed
                if ($oldCertification['pass'] != $pass || $oldCertification['comment'] != $values['comment'][$testID] || $oldCertification['date_cert'] != $date_cert) {
                    $DB->update('certification', array(
                        'date_cert' => $date_cert,
                        'pass'      => $pass,
                        'comment'   => $values['comment'][$testID]
                    ), array(
                        'examinerID' => $this->identifier,
                        'testID'     => $testID,
                    ));

                    if ($oldDate != $date_cert || $oldVal != $pass) {
                        $DB->insert('certification_history', array(
                            'col'         => 'pass',
                            'old'         => $oldVal,
                            'old_date'    => $oldDate,
                            'new'         => $pass,
                            'new_date'    => $date_cert,
                            'primaryVals' => $certID,
                            'testID'      => $testID,
                            'visit_label' => $visit_label,
                            'changeDate'  => date("Y-m-d H:i:s"),
                            'userID'      => $_SESSION['State']->getUsername(),
                            'type'        => 'U'
                        ));
                    }
                }
            }
        }
        $this->form->freeze();
    }

    function edit_examiner()
    {

        $config = NDB_Config::singleton(); 

        $dateOptions = array(
            'language'        => 'en',
            'format'          => 'YMd',
            'addEmptyOption'  => true,
            'minYear'         => $config->getSetting('startYear'),
            'maxYear'         => $config->getSetting('endYear')
        );

        $DB = Database::singleton();

        $this->form->addElement('static', 'certification_history', '', '');

        $instruments = array();
        $instruments_query = "SELECT ID, Full_name FROM test_names WHERE Test_name like ";
        $certificationConfig = $config->getSetting("Certification");
        $certificationInstruments = $certificationConfig['CertificationInstruments'];
        foreach(Utility::toArray($certificationInstruments) AS $certificationInstrument){
            foreach (Utility::toArray($certificationInstrument['test']) AS $test) {
                $test_key = $test['@']['value'];
                $instruments_query .= "'%" . $test_key . "%' OR Test_name LIKE ";
                $testID = $DB->selectOne("SELECT ID FROM test_names WHERE Test_name like '%$test_key%'");
                if (PEAR::isError($result)) {
                    return PEAR::raiseError("DB Error: ".$result->getMessage());
                }
                $test_value = $test['#'];
                $instruments[$testID] = $test_value;
            }
        }

        if (preg_match('/OR Test_name LIKE $/', $instruments_query)) {
            $query = preg_replace('/OR Test_name LIKE $/', '', $instruments_query);
        }

        // table of tests
        $statusOptions = array(null=>'N/A',
            'not_certified'=>'Not Certified',
            'in_training'=>'In Training',
            'certified'=>'Certified'
        );

        foreach ($instruments as $key=>$value) {
            $this->addSelect('pass['.$key.']', $value, $statusOptions);
            $this->addBasicText('comment['.$key.']', 'Comment');
            $this->addBasicDate('date_cert['.$key.']', 'Date', $dateOptions);
        }

        $this->tpl_data['examiner_name'] = $DB->pselectOne("SELECT full_name FROM examiners WHERE examinerID=:EID", array('EID'=>$this->identifier));

        $this->form->addFormRule(array(&$this, '_validate_edit_examiner'));
    }

    function training() {
        $config = NDB_Config::singleton();
        $DB     = Database::singleton();

        $instruments = array();
        $instruments_query = "SELECT ID, Full_name FROM test_names WHERE Test_name like ";
        $certificationConfig = $config->getSetting("Certification");
        $certificationInstruments = $certificationConfig['CertificationInstruments'];
        foreach(Utility::toArray($certificationInstruments) AS $certificationInstrument){
            foreach (Utility::toArray($certificationInstrument['test']) AS $test) {
                $test_key = $test['@']['value'];
                $instruments_query .= "'%" . $test_key . "%' OR Test_name LIKE ";
                $testID = $DB->selectOne("SELECT ID FROM test_names WHERE Test_name like '%$test_key%'");
                $test_value = $test['#'];
                $instruments[$testID] = $test_value;
            }
        }

        $this->tpl_data['certification_instruments'] = $instruments;
    }

    function _validate_edit_examiner($values)
    {

        // check that there is both a status and a date (neither can be null)
        foreach ($values['pass'] as $key => $row) {
            if (empty($row) || $this->dateEmpty($values['date_cert'][$key])) {
                if (!(empty($row) && $this->dateEmpty($values['date_cert'][$key]))) {
                    return array('pass' => 'Both the certification status and date must be filled out');
                }
            }
        }

        // check that the date has been properly filled out
        foreach ($values['date_cert'] as $date) {
            if (empty($date['Y']) || empty($date['M']) || empty($date['d'])) {
                if (!(empty($date['Y']) && empty($date['M']) && empty($date['d']))) {
                    return array('date_cert' => 'The date entered is not valid');
                }
            }
        }

        return array();
    }

    function dateEmpty($date) {
        return (empty($date['Y']) && empty($date['M']) && empty($date['d']));
    }
}
?>
