<?php
/**
 * Examiner module: Form used to update examiner certification status
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * Examiner module: Form used to update examiner certification status
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class NDB_Form_Examiner extends NDB_Form
{
    /**
     * Checks if the user has access to the edit examiner form
     *
     * @return bool
     * @throws ConfigurationException
     * @throws DatabaseException
     * @throws LorisException
     */
    function _hasAccess()
    {
        if (empty($_REQUEST['identifier'])) {
            throw new LorisException(
                "Incorrect URL: No examiner ID provided."
            );
        }
        $DB     = Database::singleton();
        $config = NDB_Config::singleton();

        $user         = User::singleton();
        $userFullName = $user->getFullname();
        $userCenter   = $user->getCenterID();

        $certification = $config->getSetting('Certification');
        if (isset($certification['EnableCertification'])) {
            $useCertification = $certification['EnableCertification'];
        } else {
            $useCertification = false;
        }

        if ($useCertification) {
            $centerID = $DB->pselectOne(
                "SELECT centerID 
                 FROM examiners
                 WHERE examinerID=:EID",
                array('EID' => $this->identifier)
            );

            return $user->hasPermission('examiner_view')
                && (($user->hasPermission('examiner_multisite')
                || $user->getData('CenterID') == $centerID));
        }
        return false;
    }

    /**
     * Fetches default certification form values from the database.
     * Creates the certification history table ("Change Log").
     *
     * @return array of default form values
     */
    function _getDefaults()
    {
        $DB = Database::singleton();

        // get the certification results for the given examiner
        $result = $DB->pselect(
            "SELECT testID, pass, date_cert, comment 
             FROM certification
             WHERE examinerID=:EID",
            array('EID' => $this->identifier)
        );

        // set the form defaults for the page
        foreach ($result as $row) {
            $defaults['date_cert[' . $row['testID'] . ']']       = $row['date_cert'];
            $defaults['certStatus['      . $row['testID'] . ']'] = $row['pass'];
            $defaults['comment['   . $row['testID'] . ']']       = $row['comment'];
        }

        return $defaults;
    }

    /**
     * Processes the certification form values and inserts updates into the database
     *
     * @param array $values Certification form values
     *
     * @return nothing
     */
    function _process($values)
    {
        $DB = Database::singleton();

        foreach ($values['certStatus'] as $testID => $certStatus) {

            $date_cert = $values['date_cert'][$testID];
            $comment   = trim($values['comment'][$testID]);

            // get the examinerID - edit_examiner passes the ID through
            // the identifier, training passes it as a value
            if (!empty($values['examiner'])) {
                $examinerID = $values['examiner'];
            } else {
                $examinerID = $this->identifier;
            }

            // Get the certificationID if it exists
            $certID = $DB->pselectOne(
                "SELECT certID 
                 FROM certification
                 WHERE examinerID=:EID AND testID=:TID",
                array(
                 'EID' => $examinerID,
                 'TID' => $testID,
                )
            );

             // if certification for new instrument for the examiner
            if (empty($certID) && !empty($certStatus)) {
                // insert a new certification entry
                $DB->insert(
                    'certification',
                    array(
                     'examinerID' => $examinerID,
                     'date_cert'  => $date_cert,
                     'testID'     => $testID,
                     'pass'       => $certStatus,
                     'comment'    => $comment,
                    )
                );
                $certID = $DB->pselectOne(
                    "SELECT certID 
                     FROM certification
                     WHERE examinerID =:EID and testID=:TID",
                    array(
                     'EID' => $examinerID,
                     'TID' => $testID,
                    )
                );
                // Add a new entry to the certification history table
                $DB->insert(
                    'certification_history',
                    array(
                     'col'         => 'pass',
                     'new'         => $certStatus,
                     'new_date'    => $date_cert,
                     'primaryVals' => $certID,
                     'testID'      => $testID,
                     'visit_label' => $visit_label,
                     'changeDate'  => date("Y-m-d H:i:s"),
                     'userID'      => $_SESSION['State']->getUsername(),
                     'type'        => 'I',
                    )
                );
            } else { // update to a test certification for the examiner

                //select history events
                $oldVals = $DB->pselectRow(
                    "SELECT ch.new, ch.new_date
                     FROM certification_history ch
                     LEFT JOIN certification c ON (c.certID=ch.primaryVals)
                     WHERE c.examinerID=:EID AND ch.testID=:TID
                     ORDER BY changeDate DESC",
                    array(
                     'EID' => $examinerID,
                     'TID' => $testID,
                    )
                );

                $oldVal  = $oldVals['new'];
                $oldDate = $oldVals['new_date'];

                $oldCertification = $DB->pselectRow(
                    "SELECT pass, date_cert, comment
                     FROM certification
                     WHERE examinerID=:EID AND testID=:TID",
                    array(
                     'EID' => $examinerID,
                     'TID' => $testID,
                    )
                );

                // If one of the values was changed
                if ($oldCertification['pass'] != $certStatus
                    || $oldCertification['comment'] != $comment
                    || $oldCertification['date_cert'] != $date_cert
                ) {
                    // Update the certification entry
                    $DB->update(
                        'certification',
                        array(
                         'date_cert' => $date_cert,
                         'pass'      => $certStatus,
                         'comment'   => $comment,
                        ),
                        array(
                         'examinerID' => $examinerID,
                         'testID'     => $testID,
                        )
                    );

                    // Add a new entry to the certification history table
                    if ($oldDate != $date_cert || $oldVal != $certStatus) {
                        $DB->insert(
                            'certification_history',
                            array(
                             'col'         => 'pass',
                             'old'         => $oldVal,
                             'old_date'    => $oldDate,
                             'new'         => $certStatus,
                             'new_date'    => $date_cert,
                             'primaryVals' => $certID,
                             'testID'      => $testID,
                             'visit_label' => $visit_label,
                             'changeDate'  => date("Y-m-d H:i:s"),
                             'userID'      => $_SESSION['State']->getUsername(),
                             'type'        => 'U',
                            )
                        );
                    }
                }
            }
        }
        $url = "{$baseurl}/examiner/editExaminer/?identifier="
               . $examinerID;
        header("Location: " . $url, true, 303);
    }

    /**
     * EditExaminer subtest.
     *
     * @return nothing
     */
    function editExaminer()
    {
        $DB = Database::singleton();

        // Get the certification history from the database
        $certification_history = $DB->pselect(
            "SELECT ch.userID, ch.changeDate, ch.old, ch.old_date,
             tn.Full_name as Measure, ch.primaryVals, ch.new, ch.new_date
             FROM certification_history ch
             LEFT JOIN test_names tn ON (ch.testID=tn.ID)
             LEFT JOIN certification c ON (c.certID=ch.primaryVals)
             WHERE c.examinerID=:EID
             ORDER BY changeDate DESC",
            array('EID' => $this->identifier)
        );

        $this->tpl_data['certification_history'] = $certification_history;

        $config = NDB_Config::singleton();

        $dateOptions   = array(
                          'language'       => 'en',
                          'format'         => 'YMd',
                          'addEmptyOption' => true,
                          'minYear'        => $config->getSetting('startYear'),
                          'maxYear'        => $config->getSetting('endYear'),
                         );
        $statusOptions = array(
                          null            => 'N/A',
                          'not_certified' => 'Not Certified',
                          'in_training'   => 'In Training',
                          'certified'     => 'Certified',
                         );

        // Get the list of certification instruments
        $instruments = $this->getCertificationInstruments();
        $this->tpl_data['instruments'] = $instruments;

        // Create the form elements for each certification instrument
        foreach ($instruments as $key => $value) {
            $group[] = $this->createSelect(
                'certStatus['.$key.']',
                'Status',
                $statusOptions
            );
            $group[] = $this->createDate(
                'date_cert['.$key.']',
                'Date',
                $dateOptions
            );
            $group[] = $this->createText(
                'comment['.$key.']',
                'Comment'
            );
            $this->addGroup(
                $group,
                $value,
                $value,
                '',
                array(
                 'prefix_wrapper'  => '<div class="col-md-3">',
                 'postfix_wrapper' => '</div>',
                )
            );
            unset($group);
        }

        $factory = NDB_Factory::singleton();
        $DB      = $factory->Database();

        // Get the examiner name and site name, to be added the form panel header
        $row = $DB->pselectRow(
            "SELECT full_name, psc.Name as site_name
              FROM examiners
               JOIN psc ON psc.CenterID = examiners.centerID
              WHERE examinerID=:EID",
            array('EID' => $this->identifier)
        );
        // Get identifier, to be added to the Reset button href
        $this->tpl_data['identifier'] = $this->identifier;

        $this->tpl_data['examiner_name'] = $row['full_name'];
        $this->tpl_data['site_name']     = $row['site_name'];

        $this->form->addFormRule(array(&$this, '_validateEditExaminer'));
    }


    /**
     * Validates the certification form values.
     *
     * @param array $values Certification form values
     *
     * @return array of error messages
     */
    function _validateEditExaminer($values)
    {
        $errors = array();

        // check that there is both a status and a date (neither can be null)
        foreach ($values['certStatus'] as $instrumentID => $certificationStatus) {
            if (empty($certificationStatus)
                || empty($values['date_cert'][$instrumentID])
            ) {
                if (!(empty($certificationStatus)
                    && empty($values['date_cert'][$instrumentID]))
                ) {
                    $errors['certStatus[' . $instrumentID .']'] = 'Both certification
                        status and date must be filled out';
                }
            }
        }

        return $errors;
    }

    /**
     * Grabs the certification instruments from the config and creates an array.
     * The instrument id id the key, and the instrument label is the value.
     *
     * @return array of instruments requiring certification
     */
    function getCertificationInstruments()
    {
        $config = NDB_Config::singleton();
        $DB     = Database::singleton();

        // Get the instruments requiring certification from the config
        $certificationConfig      = $config->getSetting("Certification");
        $certificationInstruments = $certificationConfig['CertificationInstruments'];

        $certificationInstruments['test']
            = Utility::toArray($certificationInstruments['test']);
        $instruments = array();

        foreach ($certificationInstruments['test'] as $certificationInstrument) {
            $testName = $certificationInstrument['@']['value'];
            $testID   = $DB->pselectOne(
                "SELECT ID
                 FROM test_names
                 WHERE Test_name
                 LIKE CONCAT('%', :testName, '%')",
                array('testName' => $testName)
            );
            $instruments[$testID] = $certificationInstrument['#'];
        }

        return $instruments;
    }
}
?>
