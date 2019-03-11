<?php
/**
 * Examiner module: Form used to update examiner certification status
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\examiner;

/**
 * Examiner module: Form used to update examiner certification status
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class EditExaminer extends \NDB_Form
{
    /**
     * Checks if the user has access to the edit examiner form
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     * @throws \LorisException
     */
    function _hasAccess(\User $user) : bool
    {
        if (empty($_REQUEST['identifier'])) {
            throw new LorisException(
                "Incorrect URL: No examiner ID provided."
            );
        }
        $DB     = \Database::singleton();
        $config = \NDB_Config::singleton();

        $userFullName = $user->getFullname();
        $userCenter   = $user->getCenterIDs();

        $certification = $config->getSetting('Certification');

        if ($certification['EnableCertification'] ?? false) {
            $cids      = $DB->pselect(
                "SELECT epr.centerID 
                 FROM examiners e 
                  LEFT JOIN examiners_psc_rel epr ON (e.examinerID=epr.examinerID)
                 WHERE e.examinerID=:EID",
                array('EID' => $this->identifier)
            );
            $centerIDs =array();
            foreach ($cids as $k=>$row) {
                $centerIDs[] = $row['centerID'];
            }

            // Access is only granted if user sites are a superset of examiner sites
            // considering that certification changes affect all sites
            $permitted         = $user->hasPermission('examiner_view')
                && empty(array_diff($centerIDs, $user->getData('CenterIDs')));
            $permittedAllSites
                = $user->hasPermission('examiner_multisite');
            return $permitted || $permittedAllSites;
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
        $DB = \Database::singleton();

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
     * @return void
     */
    function _process($values)
    {
        $DB = \Database::singleton();

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
            // FIXME $visit_label should be set properly. This declaration
            // was only added to appease phan.
            $visit_label = '';

             // if certification for new instrument for the examiner
            if (empty($certID) && !empty($certStatus)) {
                // insert a new certification entry
                $data = array(
                         'examinerID' => $examinerID,
                         'testID'     => $testID,
                         'pass'       => $certStatus,
                         'comment'    => $comment,
                        );
                if ($date_cert != "") {
                    $data['date_cert'] = $date_cert;
                }
                $DB->insert(
                    'certification',
                    $data
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
                $data = array(
                         'col'         => 'pass',
                         'new'         => $certStatus,
                         'primaryVals' => $certID,
                         'testID'      => $testID,
                         'visit_label' => $visit_label,
                         'changeDate'  => date("Y-m-d H:i:s"),
                         'userID'      => $_SESSION['State']->getUsername(),
                         'type'        => 'I',
                        );
                if ($date_cert != "") {
                    $data['new_date'] = $date_cert;
                }

                $DB->insert(
                    'certification_history',
                    $data
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
                    $data = array(
                             'pass'    => $certStatus,
                             'comment' => $comment,
                            );
                    if ($date_cert != "") {
                        $data['date_cert'] = $date_cert;
                    }
                    $DB->update(
                        'certification',
                        $data,
                        array(
                         'examinerID' => $examinerID,
                         'testID'     => $testID,
                        )
                    );

                    // Add a new entry to the certification history table
                    if ($oldDate != $date_cert || $oldVal != $certStatus) {
                        $data = array(
                                 'col'         => 'pass',
                                 'old'         => $oldVal,
                                 'new'         => $certStatus,
                                 'primaryVals' => $certID,
                                 'testID'      => $testID,
                                 'visit_label' => $visit_label,
                                 'changeDate'  => date("Y-m-d H:i:s"),
                                 'userID'      => $_SESSION['State']->getUsername(),
                                 'type'        => 'U',
                                );
                        if ($oldDate != "") {
                            $data['old_date'] = $oldDate;
                        }
                        if ($date_cert != "") {
                            $data['new_date'] = $date_cert;
                        }
                        $DB->insert(
                            'certification_history',
                            $data
                        );
                    }
                }
            }
        }

        $baseurl = \NDB_Factory::singleton()->settings()->getBaseURL();
        $url     = "{$baseurl}/examiner/editExaminer/?identifier="
               . $examinerID;
        header("Location: " . $url, true, 303);
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
        $DB = \Database::singleton();

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

        $config = \NDB_Config::singleton();

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

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->Database();

        // Get the examiner name and site name, to be added the form panel header
        $row = $DB->pselectRow(
            "SELECT e.full_name
              FROM examiners e
              WHERE e.examinerID=:EID",
            array('EID' => $this->identifier)
        );
        // Get identifier, to be added to the Reset button href
        $this->tpl_data['identifier'] = $this->identifier;

        $this->tpl_data['examiner_name'] = $row['full_name'];

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
        $DB     = \Database::singleton();
        $errors = array();

        // check that there is both a status and a date (neither can be null)
        foreach ($values['certStatus'] as $instrumentID => $certificationStatus) {
            if (empty($certificationStatus)
                || empty($values['date_cert'][$instrumentID])
            ) {
                if (($certificationStatus == "certified")
                    && empty($values['date_cert'][$instrumentID])
                ) {
                    $errors['certStatus[' . $instrumentID .']'] = 'Both certification
                        status and date must be filled out';
                }
            }
        }

        // check if previously recorded certification are all present
        // (can not delete, only change status)
        $rows = $DB->pselect(
            "SELECT c.testID
              FROM certification c
              WHERE c.examinerID=:EID",
            array('EID' => $this->identifier)
        );
        foreach ($rows as $row) {
            if ($values['certStatus'][$row['testID']] == "") {
                $errors['certStatus['.$row['testID'].']']
                    = 'You can not delete a status';
            }
        }
        return $errors;
    }

    /**
     * Grabs the certification instruments from the config and creates an array.
     * The instrument id is the key, and the instrument label is the value.
     *
     * @return array of instruments requiring certification
     */
    function getCertificationInstruments()
    {
        $config = \NDB_Config::singleton();
        $DB     = \Database::singleton();

        // Get the instruments requiring certification from the config
        $certificationConfig      = $config->getSetting("Certification");
        $certificationInstruments = $certificationConfig['CertificationInstruments'];

        if (!isset($certificationInstruments['test'])) {
            return array();
        }
        $certificationInstruments['test']
            = \Utility::associativeToNumericArray($certificationInstruments['test']);
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
    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label = ucwords(str_replace('_', ' ', $this->name));
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb(
                'Edit Examiner',
                "/examiner/editExaminer/?identifier=$this->identifier"
            )
        );
    }
}

