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

            return ($user->hasPermission('certification') 
                && ($user->hasPermission('certification_multisite') || $user->getData('CenterID') == $centerID));

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
        $DB =& Database::singleton();

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
        foreach($certification_history as $history_item)
        {
            $defaults['certification_history'] .= '<tr><td>' . $history_item['changeDate'] . '</td><td>' . $history_item['userID'] . '</td><td>' . $history_item['Measure'] . '</td><td>' . $history_item['old'] . '</td><td>' .  $history_item['old_date'] . '</td><td>' . $history_item['new'] . '</td><td>' . $history_item['new_date'] . '</td></tr>';
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
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        foreach ($values['pass'] as $testID => $pass) {
            $history_query = "SELECT ch.new, ch.new_date
                              FROM certification_history ch
                              LEFT JOIN certification c ON (c.certID=ch.primaryVals)
                              WHERE c.examinerID=:EID AND testID=:TID
                              ORDER BY changeDate DESC";
            $history_where = array('EID'=>$this->identifier, 'TID'=>$testID);

            //select history events
            $oldVals = $DB->pselectRow($history_query, $history_where);
            $oldVal = $oldVals['new'];
            $oldDate = $oldVals['new_date'];

            $measureID = $DB->pselectRow("SELECT testID from certification where examinerID=:EID AND testID =:tst_id", array('EID'=>$this->identifier, 'tst_id'=>$testID));
            $date = $values['date_cert'][$testID];
            $values['comment'][$testID] = trim($values['comment'][$testID]);
            $date_cert = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
            //if date is empty when saving, set to null, otherwise drop-downs display odd behaviour (populated with Nov-30)
            if ($date_cert == '0000-00-00') {
                $date_cert = null;
            }

            $certID = $DB->pselectOne("SELECT certID from certification where examinerID =:EID", array('EID'=>$this->identifier));
            $tests = $DB->pselect("SELECT testID from certification where examinerID=:EID", array('EID'=>$this->identifier));
            $testIDs = array();
            foreach($tests as $arr) {
                $i=1;
                array_push($testIDs, $arr['testID']);
                $i++;
            }
            $exists = in_array($testID, $testIDs);


            //for new certification events
            if (empty($certID) && !empty($pass)) {
                $success = $DB->insert('certification', array(
                            'examinerID'  => $values['examinerID'], 
                            'date_cert'   => $date_cert,
                            'visit_label' => $visit_label,
                            'testID'      => $testID,
                            'pass'        => $pass,
                            'comment'     => $values['comment'][$testID]
                        )
                    );
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
                $this->identifier = $DB->lastInsertID;
                unset($success);
                $success2 = $DB->insert('certification_history', array(
                            'col'         => 'pass',
                            'old'         => $oldVal,
                            'old_date'    => $oldDate,
                            'new'         => $pass,
                            'new_date'    => $date_cert,
                            'primaryVals' => $this->identifier,
                            'testID'      => $testID, 
                            'visit_label' => $visit_label,
                            'changeDate'  => date("Y-m-d H:i:s"),
                            'userID'      => $_SESSION['State']->getUsername(),
                            'type'        => 'I'
                            ));
                if (PEAR::isError($success2)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
            } else {
                if (empty($measureID) && in_array($pass, array('not_certified', 'in_training', 'certified'))) {
                    $success = $DB->replace('certification', array(
                                'certID'      => $certID,
                                'examinerID'  => $values['examinerID'],
                                'date_cert'   => $date_cert,
                                'visit_label' => $visit_label,
                                'pass'        => $pass, 
                                'testID'      => $testID,
                                'comment'     => $values['comment'][$testID]
                                ));
                    if (PEAR::isError($success)) {
                        return PEAR::raiseError("DB Error: ".$success->getMessage());
                    }
                    unset($success);
                    $success = $DB->insert('certification_history', array(
                                'col'         => 'pass',
                                'old'         => $oldVal,
                                'old_date'    => $oldDate,
                                'new'         => $pass,
                                'new_date'    => $date_cert,
                                'primaryVals' => $this->identifier, //certID,
                                'testID'      => $testID,
                                'visit_label' => $visit_label,
                                'changeDate'  => date("Y-m-d H:i:s"),
                                'userID'      => $_SESSION['State']->getUsername(),
                                'type'        => 'I'
                            ));
                    if (PEAR::isError($success)) {
                        return PEAR::raiseError("DB Error: ".$success->getMessage());
                    }

                    $this->identifier = $DB->lastInsertID;
                } elseif (!empty($measureID)) { //if entry for this examiner/measure combination exists
                    unset($test_certification); 
                    //check existing values and update accordingly if they are different
                    $test_certification = $DB->pselectOne(
                        "SELECT pass
                         FROM certification
                         WHERE certID=:crt_id AND testID =:tst_id", 
                         array('crt_id'=>$this->identifier, 'tst_id'=>$testID));
                    $date = $DB->pselectOne(
                        "SELECT date_cert
                         FROM certification
                         WHERE certID =:crt_id AND testID =:tst_id",
                         array('crt_id'=>$this->identifier, 'tst_id'=>$testID));
                    $comment = $DB->pselectOne(
                        "SELECT comment
                         FROM certification
                         WHERE certID =:crt_id AND testID =:tst_id", 
                         array('crt_id'=>$this->identifier, 'tst_id'=>$testID));


                    $where = array('certID' => $this->identifier, 'testID' => $testID);


                    $certification_exists = $DB->pselectOne("SELECT certID from certification where certID =:crt_id AND testID =:tst_id", array('crt_id'=>$this->identifier, 'tst_id'=>$testID));

                    if ($test_certification != $pass || $values['comment'][$testID] != $comment || $values['date_cert'][$testID] != $date_cert) {
                        $success = $DB->update('certification', array(
                            'date_cert'   => $date_cert,
                            'pass'        => $pass, //$values['pass'],
                            'comment'     => $values['comment'][$testID]
                        ), $where);
                        $type = 'U';

                        if (PEAR::isError($success)) {
                            return PEAR::raiseError("DB Error: ".$success->getMessage());
                        }
                    }
                    unset($success);
                    if ($oldDate != $date_cert || $oldVal != $pass) {
                        $success = $DB->insert('certification_history', array(
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
                            'type'        => $type
                        ));
                        if (PEAR::isError($success)) {
                            return PEAR::raiseError("DB Error: ".$success->getMessage());
                        }
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
        $this->form->addFormRule(array(&$this, '_validate'));
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

    function _validate($values)
    {

        // check that there is both a status and a date (neither can be null)
        foreach ($values['pass'] as $key => $row) {
            print_r($key);
            print_r($this->dateEmpty($values['date_cert'][$key]));
            print_r(empty($row));
            if (empty($row) || $this->dateEmpty($values['date_cert'][$key])) {
                if (!(empty($row) && $this->dateEmpty($values['date_cert'][$key]))) {
                    $errors['pass'] = 'Both the certification status and date must be filled out';
                }
            }
        }

        // check that the date has been properly filled out
        foreach ($values['date_cert'] as $date) {
            if (empty($date['Y']) || empty($date['M']) || empty($date['d'])) {
                if (!(empty($date['Y']) && empty($date['M']) && empty($date['d']))) {
                    $errors['date_cert'] = 'The date entered is not valid';
                }
            }
        }

        print_r($errors);
        return $errors;
    }

    function dateEmpty($date) {
        return (empty($date['Y']) || empty($date['M']) || empty($date['d']));
    }
}
?>
