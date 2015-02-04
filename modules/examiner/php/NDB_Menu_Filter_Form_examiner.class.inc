<?php
/**
 * Examiner module
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris
 */

require_once 'NDB_Menu_Filter.class.inc';
require_once 'NDB_Form.class.inc';

/**
 * Examiner module
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class NDB_Menu_Filter_Form_examiner extends NDB_Menu_Filter_Form
{
    function _hasAccess()
    {

        // create user object
        $user = User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $DB =& Database::singleton();
        $username = $user->getFullname();
        $examiner = $DB->pselectOne("SELECT examinerID FROM examiners WHERE full_name=:user", array('user'=>$username));
        if (!empty($examiner)) {
            $config  = NDB_Config::singleton();
            $baseURL = $config->getSetting('url');
            header('Location: ' . $baseURL . '/main.php?test_name=examiner&subtest=training');
            exit();
        } else {
            //return $user->hasPermission('examiner');
            return true;
        }
    }

    function _setupVariables()
    {
        $config        = NDB_Config::singleton();
        $certification = $config->getSetting('EnableCertification');
        $certification = '1';
        
        // base queries
        $query              = " FROM examiners e LEFT JOIN psc ON (e.centerID=psc.CenterID)";
        $CertificationQuery = " LEFT JOIN certification c ON (c.examinerID = e.examinerID) LEFT JOIN test_names tn ON (c.testID = tn.ID)";

        if ($certification == '1') {
            $query .= $CertificationQuery;
        }

        // set the class variables
        $this->columns      = array('e.full_name as Examiner', 'psc.Name as Site',
                               'e.radiologist as Radiologist');
        $this->query        = $query;
        $this->order_by     = 'e.full_name';
        $this->headers      = array('Examiner','Site', 'Radiologist');
        $this->validFilters = array('e.full_name', 'e.centerID', 'COALESCE(e.radiologist, "0")');

        $this->formToFilter = array(
                'examiner'    => 'e.full_name',
                'site'        => 'e.centerID',
                'radiologist' => 'COALESCE(e.radiologist, "0")'
                );
        
        if ($certification == '1') {
            array_push($this->columns, 'tn.Full_name as Certification', 'e.examinerID as ID', 'c.pass as Pass');
            array_push($this->headers, 'Certification');
            array_push($this->validFilters, 'tn.Full_name');
            array_push($this->formToFilter, array('instrument' => 'tn.Full_name'));
        }
        return true;
    }


    function _setFilterForm()
    {
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if(Utility::isErrorX($sites)) {
                return PEAR::raiseError("DB Error: ".$sites->getMessage());
            }
            if(is_array($sites)) $sites = array('' => 'All') + $sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        $radiologist = array(null => 'All', 
            '1' => 'Yes', 
            '0' => 'No'
        );

        $config        = NDB_Config::singleton();
        $certification = $config->getSetting('EnableCertification');
        $certification = '1';

        // add form elements
        $this->addBasicText('examiner', 'Examiner:');
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('radiologist', 'Radiologist:', $radiologist);
        if ($certification == '1') {
            $this->addBasicText('instrument', 'Instrument:');
        }

        $this->addBasicText('addName', 'Name');
        $this->addSelect('addSite', 'Site', $sites);

        $this->form->addRule('Name', 'Name is required', 'required');
        $this->form->addRule('Site', 'Site is required', 'required');

        $this->tpl_data['certification'] = $certification;

        return true;
    }

    function _setDataTableRows($count)
    {
        // Code from old certification module
        $config        = NDB_Config::singleton();
        $certification = $config->getSetting('EnableCertification');
        $certification = '1';

        if ($certification == '1') {
            $IDs = array();
            $duplicates = array();
            $i = 0;

            foreach ($this->list as $li) {
                $id = $li['ID'];
                $certification = $li['Certification'];

                $str = explode(' ', $certification);
                $certification = $str[0];

                if (preg_match('/Mullen/', $certification)) {
                    $certification .= " " . $li['visit'];
                }

                if (array_key_exists($id, $IDs)) {
                    if ($li['Pass'] == 'certified') {
                        if ($IDs[$id] == 'none') {
                            $IDs[$id] = $certification;
                        }
                        else {
                            $IDs[$id] .= ", " . $certification;
                        }
                    }
                    array_push($duplicates, $i);
                }
                else {
                    if ($li['Pass'] == 'certified') {
                        $IDs[$id] = $certification;
                    }
                    else {
                        $IDs[$id] = "none";
                    }
                }
                $i++;
            }

            //create concatenated list of certifications for each examiner
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
                    $this->tpl_data['items'][$x][$i]['name']  = $key;
                    if ($val == 1) {
                        $this->tpl_data['items'][$x][$i]['value'] = 'Yes';
                    }
                    else {
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
        return true;
    }

    function _process($values)
    {
        $DB =& Database::singleton();

        $fullName    = $values['addName'];
        $siteID      = $values['addSite'];
        $radiologist = $values['radiologist'];

        $DB->insert('examiners', array('full_name' => $fullName, 'centerID' => $siteID, 'radiologist' => $radiologist));
    }
}
?>