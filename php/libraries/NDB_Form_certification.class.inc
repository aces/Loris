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

        $centerID = $DB->pselectOne("SELECT centerID FROM examiners, certification WHERE examiners.examinerID = certification.examinerID AND certification.certID =:crt_id", array('crt_id'=>$this->identifier));
        if (PEAR::isError($centerID)) {
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

        $DB->select('SELECT userID, changeDate, old, old_date, Full_name as Measure, visit_label, primaryVals, new, new_date FROM certification_history JOIN test_names on certification_history.testID = test_names.ID WHERE primaryVals=' . $DB->quote($this->identifier) . ' ORDER BY changeDate DESC', &$certification_history );

        foreach($certification_history as &$history_item)
        {
            if (!preg_match('/mullen/', $history_item['Measure'])) {
                $item = explode(' ', $history_item['Measure']);
                $history_item['Measure'] = $item[0];
            }
            $history_display .= '<tr><td>' . $history_item['changeDate'] . '</td><td>' . $history_item['userID'] .  '</td><td>' . $history_item['Measure'] . '</td><td>' . $history_item['visit_label'] . '</td><td>' . $history_item['old'] . '</td><td>' .  $history_item['old_date'] . '</td><td>' . $history_item['new'] . '</td><td>' . $history_item['new_date'] . '</td></tr>';
        }

        $defaults = array();
        $defaults['certification_history'] = $history_display;

        if (!empty($this->identifier)) {
            // set the certificatione event details
            $row = $DB->pselect("SELECT examinerID FROM certification WHERE certID =:crt_id", array('crt_id'=>$this->identifier));
            if (Utility::isErrorX($row)) {
                return PEAR::raiseError("DB Error: ".$row->getMessage());
            }

            // set the examiner ID
            foreach ($row as $r) { 
               $defaults['examinerID'] = $r['examinerID'];
            }

            // set the certification results
            $result = $DB->pselect("SELECT testID, pass, date_cert, comment FROM certification WHERE certID =:crt_id", array('crt_id'=> $this->identifier));
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            foreach ($result as $row) {
                $defaults['date_cert['.$row['testID'].']'] = $row['date_cert'];
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


        foreach ($values['pass'] as $testID => $pass) {
            $history_query = "SELECT new, new_date from certification_history where primaryVals =:crt_id AND testID =:tst_id ORDER BY changeDate DESC";
            $history_where = array('crt_id'=>$this->identifier, 'tst_id'=>$testID);
            //set visit labels for the mullen
            if ($testID  == "15_3_9" ) {
                $visit_label = '3-9mo';
                $history_query = "SELECT new, new_date from certification_history where primaryVals =:crt_id AND testID =:tst_id AND visit_label =:vst ORDER BY changeDate DESC"; 
                $history_where['vst'] = $visit_label;
            }
            elseif ($testID == '15_12_15') {
                $visit_label = '12-15mo';
                $history_query = "SELECT new, new_date from certification_history where primaryVals =:crt_id AND testID =:tst_id AND visit_label =:vst ORDER BY changeDate DESC"; 
                $history_where['vst'] = $visit_label;
            }
            elseif ($testID == '15_24_36') {
                $visit_label = '24-36mo';
                $history_query = "SELECT new, new_date from certification_history where primaryVals =:crt_id AND testID =:tst_id AND visit_label =:vst ORDER BY changeDate DESC"; 
                $history_where['vst'] = $visit_label;
            }

            //select history events
            $oldVals = $DB->pselectRow($history_query, $history_where);
            $oldVal = $oldVals['new'];
            $oldDate = $oldVals['new_date'];

            $measureID = $DB->pselectRow("SELECT testID from certification where certID=:crt_id AND testID =:tst_id", array('crt_id'=>$this->identifier, 'tst_id'=>$testID));
            $date = $values['date_cert'][$testID];
            $values['comment'][$testID] = trim($values['comment'][$testID]);
            $date_cert = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
            //if date is empty when saving, set to null, otherwise drop-downs display odd behaviour (populated with Nov-30)
            if ($date_cert == '0000-00-00') {
                $date_cert = null;
            }

            $certID = $DB->pselectOne("SELECT certID from certification where examinerID =:eid", array('eid'=>$values['examinerID']));
            $tests = $DB->pselect("SELECT testID from certification where certID=:crt_id", array('crt_id'=>$this->identifier));
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
                    $test_certification = $DB->pselectOne("SELECT pass from certification where certID=:crt_id AND testID =:tst_id", array('crt_id'=>$this->identifier, 'tst_id'=>$testID));
                    $date = $DB->pselectOne("SELECT date_cert from certification where certID =:crt_id AND testID =:tst_id", array('crt_id'=>$this->identifier, 'tst_id'=>$testID));
                    $comment = $DB->pselectOne("SELECT comment from certification where certID =:crt_id AND testID =:tst_id", array('crt_id'=>$this->identifier, 'tst_id'=>$testID));

                    if ($testID == '15_3_9' || $testID == '15_12_15' || $testID == '15_24_36') {
                        $where = array('certID' => $this->identifier, 'testID' => $testID, 'visit_label' => $visit_label);
                    }
                    else {
                        $where = array('certID' => $this->identifier, 'testID' => $testID);
                    }

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

        $visits = Utility::getVisitList();

        // examiner
        $this->form->addElement('select', 'examinerID', 'Examiner', $examinerOptions);
        $this->form->addRule('examinerID', 'Examiner is required', 'required');
        $this->form->addElement('static', 'certification_history', '', '');

        $instruments = array();
        $instruments_query = "SELECT ID, Full_name FROM test_names WHERE Test_name like ";
        $certificationConfig = $config->getSetting("Certification");
        $certificationInstruments = $certificationConfig['CertificationInstruments'];
        foreach(Utility::toArray($certificationInstruments) AS $certificationInstrument){
            foreach (Utility::toArray($certificationInstrument['test']) AS $test) {
                $test_key = $test['@']['value'];
                if (preg_match('/mullen/', $test_key)) {
                    $test_key = 'mullen';
                }
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
            if (preg_match("/Mullen/", $value)) {
                $v = explode(' ', $value);
                $value = $v[0];
                $this->form->addElement('select', 'pass['.$key.'_3_9]', $value . " 3-9mo", $statusOptions);
                $this->form->addElement('text', 'comment['.$key.'_3_9]', 'Comment');
                $this->form->addElement('date', 'date_cert['.$key.'_3_9]', 'Date', $dateOptions);
                $this->form->addElement('select', 'pass['.$key.'_12_15]', $value . " 12-15mo", $statusOptions);
                $this->form->addElement('text', 'comment['.$key.'_12_15]', 'Comment');
                $this->form->addElement('date', 'date_cert['.$key.'_12_15]', 'Date', $dateOptions);
                $this->form->addElement('select', 'pass['.$key.'_24_36]', $value . " 24-36mo", $statusOptions);
                $this->form->addElement('text', 'comment['.$key.'_24_36]', 'Comment');
                $this->form->addElement('date', 'date_cert['.$key.'_24_36]', 'Date', $dateOptions);
            }
            else {
                $this->form->addElement('select', 'pass['.$key.']', $value, $statusOptions);
                $this->form->addElement('text', 'comment['.$key.']', 'Comment');
                $this->form->addElement('date', 'date_cert['.$key.']', 'Date', $dateOptions);
            }
        }
        $this->form->addFormRule(array(&$this, '_validate'));
    }

    function _validate($values)
    {
        $db =& Database::singleton();
        $errors = array();

        // make sure an examiner was selected
        if(empty($values['examinerID'])) {
            $errors['examinerID'] = 'Examiner is required';
        }
        // check candid & visit_label
        if(!empty($values['cert_candID'])) {
            $idValid = $db->pselectOne("SELECT COUNT(CandID) FROM candidate WHERE CandID=:cnd_id", array('cnd_id'=>$db->quote($values['cert_candID'])));
            if(!$idValid) {
                $errors['cert_candID'] = 'ID entered is not valid';
            }

            if(empty($values['cert_visit_label'])) {
                $errors['cert_visit_label'] = 'Visit label is required';
            } else {
                $labelValid = $db->pselectOne("SELECT COUNT(ID) FROM session WHERE CandID=:cnd_id AND Visit_label=:vst", array('cnd_id'=>$db->quote($values['cert_candID']), 'vst'=>$db->quote($values['cert_visit_label'])));
                if(!$labelValid) $errors['cert_visit_label'] = 'Visit label entered is not valid';
            }
        }

        return $errors;
    }
}
?>
