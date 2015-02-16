<?php
/**
 * Examiner module menu filter form
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

require_once 'NDB_Menu_Filter.class.inc';
require_once 'NDB_Form.class.inc';

/**
 * Examiner module menu filter form
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class NDB_Menu_Filter_Form_Examiner extends NDB_Menu_Filter_Form
{
    /**
     * Checks if the user has access to examiner menu filter
     * Redirects to the training module if useTraining is true
     * and if the user an examiner.
     *
     * @return boolean
     */
    function _hasAccess()
    {
        $user   = User::singleton();
        $DB     = Database::singleton();
        $config = NDB_Config::singleton();

        $username = $user->getFullname();
        $examiner = $DB->pselectOne(
            "SELECT examinerID FROM examiners WHERE full_name=:user",
            array('user' => $username)
        );

        // If the user is an examiner and the useTraining setting is on,
        // redirect to the training module
        if (!empty($examiner) && $config->getSetting('useTraining')) {
            $config  = NDB_Config::singleton();
            $baseURL = $config->getSetting('url');
            header(
                'Location: '
                . $baseURL
                . '/main.php?test_name=examiner&subtest=training'
            );
            exit();
        } else {
            return $user->hasPermission('examiner');
        }
    }

    /**
     * Sets the menu filter class variables.
     *
     * @return boolean
     */
    function _setupVariables()
    {
        $config           = NDB_Config::singleton();
        $certification    = $config->getSetting('Certification');
        $useCertification = $certification['EnableCertification'];

        // base queries
        $query     = " FROM examiners e LEFT JOIN psc ON (e.centerID=psc.CenterID)";
        $certQuery = " LEFT JOIN certification c ON (c.examinerID = e.examinerID) 
            LEFT JOIN test_names tn ON (c.testID = tn.ID)";

        if ($useCertification == '1') {
            $query .= $certQuery;
        }

        $query .= ' WHERE 1=1';

        // set the class variables
        $this->columns      = array(
                               'e.full_name as Examiner',
                               'psc.Name as Site',
                               'e.radiologist as Radiologist',
                              );
        $this->query        = $query;
        $this->order_by     = 'e.full_name';
        $this->headers      = array(
                               'Examiner',
                               'Site',
                               'Radiologist',
                              );
        $this->validFilters = array(
                               'e.full_name',
                               'e.centerID',
                               'COALESCE(e.radiologist, "0")',
                              );

        $this->formToFilter = array(
                               'examiner'    => 'e.full_name',
                               'site'        => 'e.centerID',
                               'radiologist' => 'COALESCE(e.radiologist, "0")',
                              );

        // If certification is turned on, update the class variables to include
        // certification information
        if ($useCertification == '1') {
            array_push(
                $this->columns,
                'tn.Full_name as Certification',
                'e.examinerID as ID',
                'c.pass as Pass'
            );
            array_push($this->headers, 'Certification');
            array_push($this->validFilters, 'tn.Full_name');
            array_push($this->formToFilter, array('instrument' => 'tn.Full_name'));
        }
        return true;
    }

    /**
     * Sets the menu filter class variables.
     *
     * @return void
     */
    function _setFilterForm()
    {
        $user = User::singleton();

        // Get site options
        if ($user->hasPermission('examiner_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if (is_array($sites)) {
                $sites = array('' => '') + $sites;
            }
        } else {
            // allow only to view own site data
            $site = Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // Radiologist options
        $radiologist = array(
                        null => 'All',
                        '1'  => 'Yes',
                        '0'  => 'No',
                       );

        // menu filter form elements
        $this->addBasicText('examiner', 'Examiner:');
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('radiologist', 'Radiologist:', $radiologist);

        // add examiner form elements
        $this->addBasicText('addName', 'Name');
        $this->addSelect('addSite', 'Site', $sites);

        // Add a useCertification template variable so that the template
        // rendering can depend on the EnableCertification setting
        $config                          = NDB_Config::singleton();
        $certification                   = $config->getSetting('Certification');
        $useCertification                = $certification['EnableCertification'];
        $this->tpl_data['certification'] = $useCertification;

    }

    /**
     * Sets the template data for the data table's rows
     *
     * @param int $count Page offset
     *
     * @return void
     */
    function _setDataTableRows($count)
    {
        // Code from old certification module
        $config           = NDB_Config::singleton();
        $certification    = $config->getSetting('Certification');
        $useCertification = $certification['EnableCertification'];

        if ($useCertification == '1') {
            $IDs        = array();
            $duplicates = array();
            $i          = 0;

            foreach ($this->list as $li) {
                $id            = $li['ID'];
                $certification = $li['Certification'];

                $str           = explode(' ', $certification);
                $certification = $str[0];

                if (array_key_exists($id, $IDs)) {
                    if ($li['Pass'] == 'certified') {
                        if ($IDs[$id] == 'none') {
                            $IDs[$id] = $certification;
                        } else {
                            $IDs[$id] .= ", " . $certification;
                        }
                    }
                    array_push($duplicates, $i);
                } else {
                    if ($li['Pass'] == 'certified') {
                        $IDs[$id] = $certification;
                    } else {
                        $IDs[$id] = "none";
                    }
                }
                $i++;
            }

            // create concatenated list of certifications for each examiner
            foreach ($this->list as &$l) {
                if (array_key_exists($l['ID'], $IDs)) {
                    $l['Certification'] = $IDs[$l['ID']];
                }
            }

            $list =& $this->list;
            foreach ($duplicates as $k=>$v) {
                unset($list[$v]);

            }
        }

        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'Examiner') {
                    $this->tpl_data['items'][$x][$i]['ID'] = $item['ID'];
                }

                if ($key == 'Radiologist') {
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    if ($val == 1) {
                        $this->tpl_data['items'][$x][$i]['value'] = 'Yes';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = 'No';
                    }
                } else if ($key != 'ID' && $key != 'Pass') {
                    $this->tpl_data['items'][$x][$i]['name']  = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }
                $i++;
            }
            $x++;
        }
    }

    /**
     * Processes the add examiner form values
     *
     * @param array $values add examiner form values
     *
     * @return void
     */
    function _process($values)
    {
        $DB = Database::singleton();

        $fullName    = $values['addName'];
        $siteID      = $values['addSite'];
        $radiologist = $values['radiologist'];

        // In the future, add validation so that errors are returned here
        if (!empty($fullName) && !empty($siteID)) {
            $DB->insert(
                'examiners',
                array(
                 'full_name'   => $fullName,
                 'centerID'    => $siteID,
                 'radiologist' => $radiologist,
                )
            );
        }
    }
}
?>