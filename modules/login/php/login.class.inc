<?php
/**
 * Implements the ViewDetails subpage of the dicom_archive module.
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
 * Implements the ViewDetails subpage of the dicom_archive module.
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
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        return true;
    }

    function __construct()
    {
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

        $study_description = $config->getSetting('StudyDescription');
        $this->tpl_data['study_description'] = html_entity_decode($study_description);
    }
}
?>
