<?php
/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\login;

/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Login extends \NDB_Page
{
    /**
     * The constructor for login creates some basic tpl variables that are
     * used in the login template.
     *
     * @return void
     */
    function setup()
    {
        $login = $_SESSION['State']->getProperty('login');
        if (!empty($login->_lastError)) {
            $this->tpl_data['error_message'] = $login->_lastError;
        }
        $config =& \NDB_Config::singleton();

        $study_links = $config->getExternalLinks('Studylinks');
        foreach ($study_links as $label => $url) {
            $WindowName = md5($url);
            $this->tpl_data['studylinks'][] = array(
                'url'        => $url,
                'label'      => $label,
                'windowName' => $WindowName,
            );
        }

        $this->tpl_data['study_description'] = html_entity_decode(
            $config->getSetting("StudyDescription")
        );

        $this->tpl_data['study_title'] = $config->getSetting('title');

        try {
            $this->tpl_data['study_logo'] = $config->getSetting('studylogo');
        } catch(\ConfigurationException $e) {
            $this->tpl_data['study_logo'] = '';
        }

    }
}

