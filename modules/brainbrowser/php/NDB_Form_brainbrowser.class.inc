<?php
/**
 * This is a stub class that permits Loris to load the BrainBrowser
 * module. Since BrainBrowser is implemented in Javascript on the
 * front end, it does nothing but check permissions.
 *
 * PHP Version 5
 *
 * @category BrainBrowser
 * @package  LorisModules
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once "NDB_Form.class.inc";

/**
 * Stub class for BrainBrowser module to load
 *
 * @category BrainBrowser
 * @package  LorisModules
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Form_Brainbrowser extends NDB_Form
{
    /**
     * Stub method so that LORIS doesn't throw an exception
     * about form named brainbrowser not found.
     *
     * @return none
     */
    function brainbrowser()
    {

    }
    /**
     * Everyone has access to the BrainBrowser module.
     *
     * @return boolean true if user has correct access permissions
     */
    function _hasAccess()
    {
        return true;
    }
}
?>
