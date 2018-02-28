<?php
/**
 * Training module: Allows examiners to undergo training in order
 * to receive certification to administer an instrument.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\training;
/**
 * Training module: Allows examiners to undergo training in order
 * to receive certification to administer an instrument.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Training extends \NDB_Form
{
    /**
     * Checks if the user has access to examiner forms (edit_examiner and training)
     *
     * @return boolean
     */
    function _hasAccess()
    {
        $user = \User::singleton();
        return $user->hasPermission('training');
    }
    /**
    * Loads the project page.
     *
    * @return none
    */
    function setup()
    {
        $instruments = $this->getCertificationInstruments();

        $certifications = array();

        $user         = \User::singleton();
        $userFullName = $user->getFullname();
        $userSite     = $user->getCenterIDs();

        $isExaminer = $this->isExaminer($userFullName, $userSite);

        foreach ($instruments as $instrumentID => $instrumentName) {
            $trainingExists = $this->getTrainingContentStatus($instrumentID);
            if ($trainingExists) {
                if ($isExaminer) {
                    $certificationStatus
                        = $this->getCertificationStatus($instrumentID);
                    if ($certificationStatus == 'certified') {
                        $certifications['certified'][$instrumentID]
                            = $instrumentName;
                    } else {
                        $certifications['not_certified'][$instrumentID]
                            = $instrumentName;
                    }
                } else {
                    $certifications['content'][$instrumentID] = $instrumentName;
                }
            } else {
                $certifications['no_content'][$instrumentID] = $instrumentName;
            }
        }
        $this->tpl_data['certifications'] = $certifications;
    }

    /**
     * Checks whether a user (identified by name and site) is an examiner.
     *
     * @param string $fullName Full name of the user
     * @param int    $site     ID of the user's site
     *
     * @return boolean
     */
    function isExaminer($fullName, $site)
    {
        $DB         = \Database::singleton();
        $examinerID = $DB->pselectOne(
            "SELECT examinerID 
             FROM examiners
             WHERE full_name=:FN",
            array('FN' => $fullName)
        );

        if (!empty($examinerID)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Grabs the certification instruments from the config and creates an array.
     * The instrument id id the key, and the instrument label is the value.
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
        $certificationInstruments['test']
            = \Utility::toArray($certificationInstruments['test']);
        $instruments = array();

        foreach ($certificationInstruments['test'] as $certificationInstrument) {
            $test_key = $certificationInstrument['@']['value'];
            $testID   = $DB->selectOne(
                "SELECT ID
                 FROM test_names
                 WHERE Test_name
                 LIKE '%$test_key%'"
            );
            $instruments[$testID] = $certificationInstrument['#'];
        }

        return $instruments;
    }

    /**
     * Check the certification status of the current user for a given instrument.
     *
     * @param int $instrumentID ID of the instrument
     *
     * @return string
     */
    function getCertificationStatus($instrumentID)
    {
        $user         = \User::singleton();
        $userFullName = $user->getFullname();
        $userCenter   = $user->getCenterIDs();

        $DB = \Database::singleton();
        $certificationStatus = $DB->pselectOne(
            "SELECT c.pass
             FROM certification c
             LEFT JOIN examiners e ON (c.examinerID=e.examinerID) 
             LEFT JOIN examiners_psc_rel epr ON (epr.examinerId=e.examinerID)
             WHERE e.full_name=:name 
             AND FIND_IN_SET(epr.centerID,:CID) AND c.testID=:TID",
            array(
             'name' => $userFullName,
             'CID'  => implode(',', $userCenter),
             'TID'  => $instrumentID,
            )
        );

        return $certificationStatus;
    }

    /**
     * Checks whether training content exists for a given instrument.
     *
     * @param int $instrumentID ID of the instrument
     *
     * @return boolean
     */
    function getTrainingContentStatus($instrumentID)
    {
        $DB = \Database::singleton();

        $trainingContent = $DB->pselectOne(
            "SELECT certification_training.TestID
             FROM certification_training
             WHERE TestID=:TID",
            array('TID' => $instrumentID)
        );

        if (empty($trainingContent)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Gathers JS dependecies and merge them with the parent
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
             $baseURL . "/training/js/training_helper.js",
            )
        );
    }

    /**
     * Gathers CSS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/training/css/training.css",
            )
        );
    }
}
?>
