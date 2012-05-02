<?
/**
 * @version $Id: feedback_bvl_popup.php,v 3.13 2007/03/02 16:16:41 sebas Exp $
 * @package behavioural
 */
ob_start('ob_gzhandler');

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

$config =& NDB_Config::singleton();
$paths = $config->getSetting('paths');

// create user object
$user =& User::singleton();
if(PEAR::isError($user)) {
    die("Error creating user object: ".$user->getMessage());
}
$tpl_data['userID'] = $user->getData('UserID');

// set permissions
if ($user->hasPermission('bvl_feedback')) {
    $tpl_data['has_permission'] = true;
}

// create candidate object if we have a candID
if(!empty($_REQUEST['candID'])) {
    $candidate =& Candidate::singleton($_REQUEST['candID']);
    if(PEAR::isError($candidate)) {
        $tpl_data['error_message'][] = $candidate->getMessage();
    }
    $tpl_data['candID'] = $candidate->getCandID();
    $tpl_data['PSCID'] = $candidate->getPSCID();
}

// create timepoint object if we have a session ID
if(!empty($_REQUEST['sessionID'])) {
    $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
    if(PEAR::isError($timePoint)) {
        $tpl_data['error_message'][] = $timePoint->getMessage();
    } else {
        $tpl_data['visitLabel'] = $timePoint->getVisitLabel();
    }
    $tpl_data['sessionID'] = $_REQUEST['sessionID'];

}

if (!empty($_REQUEST['commentID'])) {
    
    $tpl_data['commentID'] = $_REQUEST["commentID"];

    if (!empty($_REQUEST['test_name'])) {
        if (file_exists($paths['base']."project/instruments/NDB_BVL_Instrument_$_REQUEST[test_name].class.inc")) {
            // otherwise create an instrument_<test_name> object
            include_once $paths['base']."project/instruments/NDB_BVL_Instrument_$_REQUEST[test_name].class.inc";

            $instrument =& NDB_BVL_Instrument::factory($_REQUEST['test_name'], $_REQUEST['commentID'], $_REQUEST['subtest']);
            if (PEAR::isError($instrument)) {
                $tpl_data['error_message'][] = $instrument->getMessage();
            }

            $tpl_data['instrument_name'] = $instrument->getFullName();
        } else {
            $tpl_data['instrument_name'] = $_REQUEST['test_name'];
        }
        
        ///get the fields names....
		// "Add Feedback" Form" - option array for select boxes - 2 arrays; one is for labels
		$field_names=Utility::getSourcefields($_REQUEST['test_name']);
		$Fields['Across All Fields'] = 'Across All Fields';
		foreach($field_names as $field_name){
			$Fields[$field_name['SourceField']] = $field_name['SourceField'];
		}

		$tpl_data['FieldNames'] = $Fields;
	}


}

/*
 * create feedback object
 */
if (!empty($_REQUEST['commentID'])) {
    $feedback = NDB_BVL_Feedback::singleton($user->getUsername(), null, null, $_REQUEST['commentID']);
} elseif(!empty($_REQUEST['sessionID'])) {
    $feedback = NDB_BVL_Feedback::singleton($user->getUsername(), null, $_REQUEST['sessionID']);
} elseif(!empty($_REQUEST['candID'])) {
    $feedback = NDB_BVL_Feedback::singleton($user->getUsername(), $_REQUEST['candID']);
} else {
}

if (PEAR::isError($feedback)) {

    // if feedback object return an error
    $tpl_data['error_message'][] = $feedback->getMessage();

} elseif (!is_object($feedback)) {

} else {

    // define feedback level
    $tpl_data['feedbackLevel'] = $feedback->getFeedbackLevel();

    // get list of types
    $feedbackTypes = NDB_BVL_Feedback::getFeedbackTypes();
    if (PEAR::isError($feedbackTypes)) {
        $tpl_data['error_message'][] = $feedbackTypes->getMessage();
    } else {
        $z = 0;
        foreach ($feedbackTypes as $val) {
            // Following are used for the "Add Feedback" Form      
            $tpl_data['threadTypes'][$z]['Type'] = $val['Type'];
            $tpl_data['threadTypes'][$z]['Label'] = $val['Label'];

            //These are for the update thread form
            $tpl_data['threadTypeIDArray'][] = $val['Type'];
            $tpl_data['threadTypeLabelArray'][] = $val['Label'];
            $z++;
        }
    }

    // "Add Feedback" Form" - option array for select boxes - 2 arrays; one is for labels
    $tpl_data['YNLabelArray'] = array('Y' => 'Yes', 'N' => 'No');
    $tpl_data['YNArray'] = array('Y' => 'Y', 'N' => 'N');

    /**
     * process form data
     */
    // add new threads
    if ($_REQUEST['add_new_thread_form_submit'] == 'Save Data') {
        foreach($_REQUEST['newFormThreadData'] as $type => $threadData) {
            if (!empty($threadData['Comment'])) {
                
                if (empty($threadData['Public'])) {
                    $tpl_data['form_error_message']['new'] = "Please select a 'Required Action?' value for every new type of feedback you want to create";
                    $tpl_data['new_thread_data'][$type]['CommentValue'] = $threadData['Comment'];
                    $tpl_data['new_thread_data'][$type]['FieldNameValue'] = $threadData['FieldName'];
                    $tpl_data['new_thread_data'][$type]['PublicValue']  = $threadData['Public'];
                } else {
                    // add the new thread
                    $success = $feedback->createThread($threadData['Level'], $threadData['Type'], $threadData['Comment'], $threadData['Public'],$threadData['FieldName']);
                    if (PEAR::isError($success)) {
                        // pass form data
                        $tpl_data['form_error_message']['new'] .= "Unable to create a new $type thread: ".$success->getMessage();
                        $tpl_data['new_thread_data'][$type]['CommentValue'] = $threadData['Comment'];
                        $tpl_data['new_thread_data'][$type]['PublicValue']  = $threadData['Public'];
                        $tpl_data['new_thread_data'][$type]['FieldNameValue']  = $threadData['FieldName'];
                    }
                    // unset the array to remove form data
                    unset($_REQUEST['new_thread_data'][$type]);
                }
            } else {
                // remove all form data for the elements with empty comment
                unset($_REQUEST['new_thread_data'][$type]);
            }
        }
        // unset Submit arg
        unset($_REQUEST['add_new_thread_form_submit']);
    }
    
    // activate threads
    if ($_REQUEST['activate_thread_form_submit'] == 'Post New Feedback') {
        $success = $feedback->activateThread();
        if (PEAR::isError($success)) {
            $tpl_data['form_error_message']['activate'] = "Unable to post new feedback: ".$success->getMessage();
        }
        // unset Submit arg
        unset($_REQUEST['activate_thread_form_submit']);
    }
    
    // close threads
    if ($_REQUEST['close_thread_form_submit'] == 'Close All Threads') {
        $success = $feedback->closeThread();
        if (PEAR::isError($success)) {
            $tpl_data['form_error_message']['close'] = "Unable to close threads: ".$success->getMessage();
        }
        // unset Submit arg
        unset($_REQUEST['close_thread_form_submit']);
    }

    // add entries and/or update threads
    if ($_REQUEST['existing_thread_form_submit'] == 'Save Data') {
        // if anything is passed by the thread form
        if (is_array($_REQUEST['formThreadData'])) {
            
            foreach ($_REQUEST['formThreadData'] as $threadIndex => $threadData) {
                
                // comment is required for any action
                if (!empty($threadData['Comment'])) {
                    $success = $feedback->updateThread($threadData['FeedbackID'], $threadData['Comment'], $threadData['Type'], $threadData['Public'], $threadData['Status'],$threadData['FieldName']);
                    if (PEAR::isError($success)) {
                        // pass form data
                        $tpl_data['form_error_message'][$threadIndex]['Text'] = "Data Not Saved. Error: ".$success->getMessage();
                        $tpl_data['existing_thread_data'][$threadIndex]['CommentValue'] = $threadData['Comment'];
                        $tpl_data['existing_thread_data'][$threadIndex]['Status'] = $threadData['Status'];
                        $tpl_data['existing_thread_data'][$threadIndex]['Public'] = $threadData['Public'];
                        $tpl_data['existing_thread_data'][$threadIndex]['Type'] = $threadData['Type'];
                    }
                    // unset form data for the successfully processed record
                    unset($_REQUEST['formThreadData'][$threadIndex]);
                } else {
                    // in case of missing comments preserve form entries
                    $tpl_data['existing_thread_data'][$threadIndex]['Public'] = $threadData['Public'];
                    $tpl_data['existing_thread_data'][$threadIndex]['Type'] = $threadData['Type'];
                    $tpl_data['existing_thread_data'][$threadIndex]['Status'] = $threadData['Status'];
                }
            } // end foreach
        }
        // unset Submit arg
        unset($_REQUEST['formThreadData']);
    }
    
    // get the summary of threads
    $success = $feedback->getSummaryOfThreads();
    if(PEAR::isError($success)) {
        $tpl_data['error_message'][] = $success->getMessage();
    } else {
        if (count($success) > 0) {
//            $tpl_data['PSCID'] = $success[0]["PSCID"];
//            $tpl_data['ethnicity'] = $success[0]["Ethnicity"];
//            $tpl_data['gender'] = $success[0]["Gender"];
            
            $tpl_data['thread_summary_headers'] = array_keys($success[0]);
            for($i=0;$i<count($success);$i++){
                $tpl_data['thread_summary_data'][$i]['QC_Class'] = $success[$i]['QC_Class'];
                $tpl_data['thread_summary_data'][$i]['No_Threads'] = $success[$i]['No_Threads'];
                $tpl_data['thread_summary_data'][$i]['Instrument'] = $success[$i]['Instrument'];
                $tpl_data['thread_summary_data'][$i]['CommentID'] = $success[$i]['CommentID'];
                $tpl_data['thread_summary_data'][$i]['Visit'] = $success[$i]['Visit'];
                $tpl_data['thread_summary_data'][$i]['SessionID'] = $success[$i]['SessionID'];
            }
        }
    }

    // get the list of threads
    $success = $feedback->getThreadList();
    if(PEAR::isError($success)) {
        $tpl_data['error_message'][] = $success->getMessage();
    } else {

       // assign thread data from the getThreadList()
       $tpl_data['thread_list_data'] = $success;
       
       $z = 0;
       foreach ($success as $thread) {

           if (empty($tpl_data['existing_thread_data'][$z]['Public'])) {
               $tpl_data['existing_thread_data'][$z]['Public'] = $thread['Public'];
           }
           if (empty($tpl_data['existing_thread_data'][$z]['FieldName'])) {
				$tpl_data['existing_thread_data'][$z]['FieldName'] = $thread['FieldName'];
			}
           if (empty($tpl_data['existing_thread_data'][$z]['Type'])) {
               $tpl_data['existing_thread_data'][$z]['Type'] = $thread['TypeID'];
           }
           if (empty($tpl_data['existing_thread_data'][$z]['Status'])) {
               $tpl_data['existing_thread_data'][$z]['Status'] = $thread['QC_status'];
           }
           
           // rules for managing thread status options
           $tpl_data['existing_thread_data'][$z]['doNotShowStatusField'] = TRUE;
           if ($user->hasPermission('bvl_feedback')) {
               // applicable only for users who can change status
               if ($thread['QC_status'] == 'opened') {
                   $tpl_data['existing_thread_data'][$z]['threadStatusArray'] = array('opened','closed');
                   $tpl_data['existing_thread_data'][$z]['threadStatusLabelArray'] = array('opened','close');
               } elseif ($thread['QC_status'] == 'answered') {
                   $tpl_data['existing_thread_data'][$z]['threadStatusArray'] = array('opened','closed');
                   $tpl_data['existing_thread_data'][$z]['threadStatusLabelArray'] = array('reopen','close');
               } elseif ($thread['QC_status'] == 'closed') {
                   $tpl_data['existing_thread_data'][$z]['threadStatusArray'] = array('opened','closed');
                   $tpl_data['existing_thread_data'][$z]['threadStatusLabelArray'] = array('reopen','closed');
               } else {
                   $tpl_data['existing_thread_data'][$z]['doNotShowStatusField'] = FALSE;
               }
           } else {
               // all other users
               if ($thread['QC_status'] == 'opened') {
                   $tpl_data['existing_thread_data'][$z]['threadStatusArray'] = 'answered';
               } else {
                   $tpl_data['existing_thread_data'][$z]['threadStatusArray'] = $thread['QC_status'];
               }
           }

           $tpl_data['form_error_message'][$thread["FeedbackID"]] = "my message ".$thread["FeedbackID"];
            
           $success1 = $feedback->getThreadEntries($thread["FeedbackID"]);
           if (PEAR::isError($success1)) {

               $tpl_data['thread_list_data'][$z]['error_message'] = $success1->getMessage();

           } else {
               $tpl_data['thread_entry'][] = $success1;
               $tpl_data['thread_list_data'][$z]['QC_color'] = $feedback->getThreadColor($thread['QC_status']);
           }
           $z++;
       }
    }
        
    // option array for select boxes - 2 arrays; one is for labels
    $tpl_data['threadYNLabelArray'] = array('Y' => 'Yes', 'N' => 'No');
    $tpl_data['threadYNArray'] = array('Y' => 'Y', 'N' => 'N');
}

/**
* prepare form data
*/
//define action url for the feedback form in the template
$tpl_data['formAction'] = $_SERVER['PHP_SELF']."?candID=".$_REQUEST['candID']."&";
if (!empty($_REQUEST['sessionID'])) {
    $tpl_data['formAction'] .= "sessionID=".$_REQUEST['sessionID']."&";
}
if (!empty($_REQUEST['commentID'])) {
    $tpl_data['formAction'] .= "commentID=".$_REQUEST['commentID']."&" . "test_name=".$_REQUEST['test_name']."";;
}

//set study name
$tpl_data['study_title'] = $config->getSetting('title');

//Output template using Smarty
$tpl_data['css']=$config->getSetting('css');
$smarty = new Smarty_neurodb;
if (is_array($tpl_data)) $smarty->assign($tpl_data);
$smarty->display('feedback_bvl_popup.tpl');

ob_end_flush();
?>