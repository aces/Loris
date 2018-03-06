<?php
/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Survey
 * @author     Jordan Stirling <jstirling91@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
*/
namespace LORIS\survey_module;

/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Survey
 * @author     Jordan Stirling <jstirling91@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Survey_Module extends \NDB_Page
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

    /**
     * The constructor for login creates some basic tpl variables that are
     * used in the login template.
     *
     * @return none
     */
    function setup()
    {
        $client = new \NDB_Client();
        $client->makeCommandLine();
        $client->initialize();
        $factory  = \NDB_Factory::singleton();
        $config   = $factory->config();
        $settings = $factory->settings();
        $this->tpl_data['baseurl'] = $settings->getBaseURL();
        $this->key = $_REQUEST['key'];
        $DB = \Database::singleton();
        $this->SurveyInfo = $DB->pselect(
            "SELECT Status, Test_name, CommentID FROM participant_accounts
            WHERE OneTimePassword=:key",
            array('key' => $this->key)
        );
        error_log($this->key);
        if (empty($this->SurveyInfo)) {
            throw new Exception("The given survey doesn't exist", 404);
        } else if (count($this->SurveyInfo) > 1) {
            throw new Exception("Well looks like we made a mistake :(", 500);
        } else if ($this->SurveyInfo[0]['Status'] === 'Complete') {
            throw new Exception("Data has already been submitted.", 403);
        }
        $this->SurveyInfo = $this->SurveyInfo[0];

        // Handle GET
        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $this->SurveyInfo['Test_name'],
                $this->SurveyInfo['CommentID'],
                null,
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument not found", 405);
        }
        $this->tpl_data['InstrumentJSON'] = $this->Instrument->toDirectJSON();
        $Values = \NDB_BVL_Instrument::loadInstanceData($this->Instrument);
        unset($Values['CommentID']);
        unset($Values['UserID']);
        // unset($Values['Testdate']);
        unset($Values['Data_entry_completion_status']);
        $this->tpl_data['Values'] = json_encode($Values);


    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory         = \NDB_Factory::singleton();
        $baseurl         = $factory->settings()->getBaseURL();
        $depends         = parent::getJSDependencies();

        return array_merge(
            $depends,
            array(
             $baseurl . "/survey_module/js/DirectEntry.js",
            )
        );
    }
}
?>
