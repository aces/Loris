<?
/**
 * @package garbage
 */

session_start();

///////////////////////////////////////////
///////////////////////////////////////////
// SESSION VARIABLES MANAGEMENT SECTION
// ////////////////////////////////////////
// SESSION VARIABLE FETCHED 
// these were set in main.php at login time
///////////////////////////////////////////
GLOBAL $database;         $database         = $NIHPD["database"];
GLOBAL $user_DB_access;   $user_DB_access   = $NIHPD["user_DB_access"]; 
GLOBAL $userID;           $userID           = $NIHPD["userID"];         // a user which is logged in
GLOBAL $user_password;    $user_password    = $NIHPD["user_password"];
GLOBAL $user_privilege;   $user_privilege   = $NIHPD["user_privilege"];
GLOBAL $user_PSCPI;       $user_PSCPI       = $NIHPD["user_PSCPI"];
GLOBAL $user_centerID;    $user_centerID    = $NIHPD["user_centerID"];
GLOBAL $PSCPrefix;        $PSCPrefix        = $NIHPD["PSCPrefix"];
GLOBAL $user_realName;    $user_realName    = $NIHPD["user_realName"];
GLOBAL $user_email;       $user_email       = $NIHPD["user_email"];
GLOBAL $user_center_area; $user_center_area = $NIHPD["user_center_area"];
GLOBAL $user_center_name; $user_center_name = $NIHPD["user_center_name"];
?>
<html>
<head><title>Quality Control</title></head>
<body>
<?
if (!session_is_registered("NIHPD"))
{
  echo "Please log in.";
}
else
{
  // to include the inc file with global (project) settings
  include $NIHPD['config_file'];
  
  // to include the inc file with connection parameters
  include  PHP_DIR."NIH_PD/utilities/connect.inc";
  
  // include library of functions
  include  PHP_DIR.'libraries/html_forms.inc';
  include  PHP_DIR.'libraries/candidate_profile_functions.inc';
  include  PHP_DIR.'libraries/errors.inc';
  
  if(!empty($NIHPD['commentID']))             // user is viewing a test
    {
      echo "test inside";
      if($submit_comments)
        {
          errors_save($NIHPD['commentID']);
        }
      echo "<form>";
      errors_input_text($NIHPD['commentID']);
      echo "<br><input type='submit' name='submit_comments' value='Save comments'></form>";
      errors_show_comments($NIHPD['commentID']);
    }
  elseif(!empty($NIHPD['sessionID']))         // user is viewing a session
    {
      echo "tests";
      // Show a list of tests with feedback.
      get_error_tests($NIHPD['candID'], $NIHPD['sessionID']);
    }
  elseif(!empty($NIHPD['candID']))            // user is viewing a candidate    
    {
      echo "visit";
      // Show a list of visits with feedback.
      get_error_visits($NIHPD['candID']);
    }
  else                                        // user has no candidate selected
    {
      echo "candidate";
      // Show a list of candidates with feedback.
      get_error_candidates();          
    }
}

?>
</body>
</html>