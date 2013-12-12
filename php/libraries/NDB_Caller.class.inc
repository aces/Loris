<?php
require_once 'PEAR.php';
require_once 'User.class.inc';

/**
 * Caller class
 *
 * Calls the right library to return HTML - either a menu, form or instrument
 * @package main
 */
class NDB_Caller extends PEAR
{
    /**
     * Identifies what type of script is being run (menu, form or instrument)
     * @var    string
     * @access public
     */
    var $type;

    /**
     * Singleton method
     *
     * @return NDB_Caller
     * @throws PEAR_Error
     * @access public
     * @static
     */
    static function &singleton()
    {
        static $instance;
        if (is_null($instance)) {
            $instance = new NDB_Caller();
        }
        return $instance;
    }

   /**
    * Renders the called menu, form or the instrument into html
    * @param string     the object type to load.  The test_name of the menu, form or instrument
    * @param string     the subtest.  The page of the form or instrument.
    * @return string    rendered object, as html
    *
    */
    function load($test_name, $subtest, $controlPanel=null)
    {
        // if no first argument, return
        if (empty($test_name)) {
            return;
        }

        // get the files path, aka the base directory
        $config =& NDB_Config::singleton();
        $base = $config->getSetting('base');

        // it is a menu
        if (empty($subtest) && ($this->existsAndRequire($base."project/libraries/NDB_Menu_$test_name.class.inc") 
                             || $this->existsAndRequire($base."php/libraries/NDB_Menu_$test_name.class.inc") 
                             || $this->existsAndRequire($base."project/libraries/NDB_Menu_Filter_$test_name.class.inc")
                             || $this->existsAndRequire($base."php/libraries/NDB_Menu_Filter_$test_name.class.inc"))
            ) {


                $mode = isset($_REQUEST['mode']) ? $_REQUEST['mode'] : '';
                $html = $this->loadMenu($test_name, $mode, $controlPanel);
            if (Utility::isErrorX($html)) {
                return PEAR::raiseError($html->getMessage());
            }
  
            $this->type = 'menu';
            return $html;
        }

        // it is a form
        if ($this->existsAndRequire($base."project/libraries/NDB_Form_$test_name.class.inc")
            || $this->existsAndRequire($base."php/libraries/NDB_Form_$test_name.class.inc")) {

            $identifier = isset($_REQUEST['identifier']) ? $_REQUEST['identifier'] : '';
            $html = $this->loadForm($test_name, $subtest, $identifier);
            if (Utility::isErrorX($html)) {
                return PEAR::raiseError($html->getMessage());
            }

            $this->type = 'form';
            return $html;
        }
        
        // it is a reliability form
          if ($this->existsAndRequire($base."project/libraries/NDB_Reliability_$test_name.class.inc")
              || $this->existsAndRequire($base."php/libraries/NDB_Reliability_$test_name.class.inc")) {

              $html = $this->loadReliability($test_name, $subtest, $_REQUEST['identifier'], $_REQUEST['reliability_center_id']);
              if (Utility::isErrorX($html)) {
                  return PEAR::raiseError($html->getMessage());
              }

              $this->type = 'reliability';
              return $html;
          }

        // it is an intrument
          if ($this->existsAndRequire($base."project/instruments/NDB_BVL_Instrument_$test_name.class.inc")
                || $test_name=='instrument_preview') {
    
            $html = $this->loadInstrument($test_name, $subtest, $_REQUEST['commentID']);
            if (Utility::isErrorX($html)) {
                return PEAR::raiseError($html->getMessage());
            }

            $this->type = 'instrument';
            return $html;
        } else if(file_exists($base."project/instruments/$test_name.linst")) {
            $html = $this->loadInstrument($test_name, $subtest, $_REQUEST['commentID']);
            if (PEAR::isError($html)) {
                return PEAR::raiseError($html->getMessage());
            }
            $this->type = 'instrument';
            return $html;
        }

        // it is nothing!
        return PEAR::raiseError("This page ($test_name) is under construction.", 404);
    }

   /**
    * Renders html for a Menu
    * @param string The Menu being loaded
    * @param string The Menu mode
    *
    */
    function loadMenu($menu, $mode, $controlPanel=null)
    {
        // make an instance of the menu's object
        $menu =& NDB_Menu::factory($menu, $mode, $controlPanel);
        if (Utility::isErrorX($menu)) {
            return PEAR::raiseError($menu->getMessage());
        }

        $success = $menu->setup();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("NDB_Caller::loadMenu() save: ".$success->getMessage());
        }

        if($controlPanel) {
            $menu->controlPanel = $controlPanel->display();
        }
        $html = $menu->display();
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError("NDB_Caller::loadMenu() display: ".$html->getMessage());
        }

        return $html;
    }

   /**
    * Renders html for a Form
    * @param string The Form to load
    * @param string The page of the Form to load
    * @param string The identifier of the Form
    */
    function loadForm($class, $page, $identifier)
    {
        // make an instance of the form's object
        $form = NDB_Form::factory($class, $page, $identifier);
        if (Utility::isErrorX($form)) {
            return PEAR::raiseError($form->getMessage());
        }
    
        $success = $form->save();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("NDB_Caller::loadForm() save: ".$success->getMessage());
        }

        $html = $form->display();
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError("NDB_Caller::loadForm() display: ".$html->getMessage());
        }

        return $html;
    }
    
    /**
     * Renders html for a Reliability Form
     * @param string The Form to load
     * @param string The page of the Form to load
     * @param string The identifier of the Form
     * @param string The id of the center at which the reliability test is being performed.
     */
     function loadReliability($class, $page, $identifier, $reliability_center_id)
     {
         // make an instance of the form's object
         $form = NDB_Reliability::factory($class, $page, $identifier, $reliability_center_id);
         if (Utility::isErrorX($form)) {
             return PEAR::raiseError($form->getMessage());
         }

         $success = $form->save();
         if (Utility::isErrorX($success)) {
             return PEAR::raiseError("NDB_Caller::loadReliability() save: ".$success->getMessage());
         }

         $html = $form->display();
         if (Utility::isErrorX($html)) {
             return PEAR::raiseError("NDB_Caller::loadReliability() display: ".$html->getMessage());
         }

         return $html;
     }

   /**
    * Renders html for a quickform Instrument
    * @param string name of the instrument to load
    * @param string page (subtest) of the instrument
    * @param string commentID of the instrument
    * @note: added a call to Timepoint class using $_REQUIEST['sessionID'] which implies that the instrument call must be made within the timepoint
    */
    function loadInstrument($instrument, $page, $commentID)
    {
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        if($_REQUEST['sessionID']) {
            $timepoint =& TimePoint::singleton($_REQUEST['sessionID']);
            if (Utility::isErrorX($timepoint)) {
                return PEAR::raiseError("NDB_Caller::loadInstrument, Timepoint Error: ".$timepoint->getMessage());
            }
        }

        // make an instance of the instrument's object
        $instrument =& NDB_BVL_Instrument::factory($instrument, $commentID, $page);
        if (Utility::isErrorX($instrument)) {
            return $instrument;
        }

        // save instrument form data
        $success = $instrument->save();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("NDB_Caller::loadInstrument() save: ".$success->getMessage());
        }

        // create an instrument status object
        $status = new NDB_BVL_InstrumentStatus;
        $success = $status->select($commentID);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Instrument Status Error ($commentID): ".$success->getMessage());
        }

        // freeze the form to prevent data entry
        if ($status->getDataEntryStatus() != 'In Progress' || !$user->hasPermission('data_entry') || $user->getData("CenterID") != $timepoint->getData("CenterID")) {
            if($instrument->preview !== true ) {
                $instrument->freeze();
            }
        }

        $html = $instrument->display();
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError("NDB_Caller::loadInstrument() display: ".$html->getMessage());
        }

        return $html;
    }

    /**
     * Checks if a library exists, and requires it if it does.
     * @param string    test_name of the menu, form or instrument
     * @return bool     true if file exists, otherwise false
     */
    function existsAndRequire($library) {
        if (file_exists($library)) {
            require_once $library;
            return true;
        }

        return false;
    }
}
?>
