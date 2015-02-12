<?php
/**
 * Certification training: Checks if the answers given for training quiz are correct.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";

$DB = Database::singleton();

// Get the ID for the instrument that was selected
$instrumentID = $_REQUEST['instrument'];

// iterate over instruments
$quizCorrect = 1;
foreach ($_POST as $question => $answer) {
    if (is_numeric($question)) {
        if (correct($instrumentID, $question, $answer) == 0) {
            $quizCorrect = 0;
            break;
        }
    }
}

if ($quizCorrect == 0) {
    print 0;
    exit();
} else {
    $user = User::singleton();

    $userFullName = $user->getFullname();
    $userCenter   = $user->getCenterID();
    $examinerID   = $DB->pselectOne(
        "SELECT examinerID 
         FROM examiners
         WHERE full_name=:FN AND centerID=:CID",
        array(
         'FN' => $userFullName,
         'CID' => $userCenter,
        )
    );
    
    $values = array(
        'pass'       => array($instrumentID => 'certified'),
        'date_cert'  => array($instrumentID => array('Y' => date("Y"), 'M' => date("m"), 'd' => date("d"))),
        'examiner'   => $examinerID
    );

    process($values);

    print 1;
    exit();
}

/**
 * Determines if an answer is correct for a question from the training quiz
 *
 * @param string $instrumentID The ID of the instrument
 * @param string $question     The question number
 * @param string $answer       The answer number provided by the user
 *
 * @return int
 */
function correct($instrumentID, $question, $answer)
{
    $DB            = Database::singleton();
    $correctAnswer = $DB->pselectOne(
        "SELECT a.OrderNumber as Answer 
         FROM certification_training_quiz_questions q 
         LEFT JOIN certification_training_quiz_answers a
         ON (q.ID=a.QuestionID)
         WHERE q.TestID=:TID AND a.Correct=1 AND q.OrderNumber=:QNO",
        array(
         'TID' => $instrumentID,
         'QNO' => $question,
        )
    );
    if ($correctAnswer == $answer) {
        return 1;
    } else {
        return 0;
    }
}

function process($values)
{
    $DB = Database::singleton();

    foreach ($values['pass'] as $testID => $pass) {

        $date       = $values['date_cert'][$testID];
        $comment    = trim($values['comment'][$testID]);
        $date_cert  = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);

        if (!empty($values['examiner'])) {
            $examinerID = $values['examiner'];
        } else {
            $examinerID = $this->identifier;
        }

        //if date is empty when saving, set to null, otherwise drop-downs display odd behaviour (populated with Nov-30)
        if ($date_cert == '0000-00-00') {
            $date_cert = null;
        }

        $certID = $DB->pselectOne("SELECT certID from certification where examinerID =:EID and testID=:TID", array('EID'=>$examinerID, 'TID'=>$testID));

        if (empty($certID) && !empty($pass)) { // new test certification for the examiner
            $DB->insert('certification', array(
                'examinerID' => $examinerID, 
                'date_cert'  => $date_cert,
                'testID'     => $testID,
                'pass'       => $pass,
                'comment'    => $comment
            ));
            $certID = $DB->pselectOne("SELECT certID from certification where examinerID=:EID and testID=:TID", array('EID'=>$examinerID, 'TID'=>$testID));
            $DB->insert('certification_history', array(
                'col'         => 'pass',
                'new'         => $pass,
                'new_date'    => $date_cert,
                'primaryVals' => $certID,
                'testID'      => $testID,
                'visit_label' => $visit_label,
                'changeDate'  => date("Y-m-d H:i:s"),
                'userID'      => $_SESSION['State']->getUsername(),
                'type'        => 'I'
            ));
        } else { // update to a test certification for the examiner

            //select history events
            $oldVals = $DB->pselectRow(
                "SELECT ch.new, ch.new_date
                 FROM certification_history ch
                 LEFT JOIN certification c ON (c.certID=ch.primaryVals)
                 WHERE c.examinerID=:EID AND ch.testID=:TID
                 ORDER BY changeDate DESC", array('EID'=>$examinerID, 'TID'=>$testID));

            $oldVal  = $oldVals['new'];
            $oldDate = $oldVals['new_date'];

            $oldCertification = $DB->pselect(
                "SELECT pass, date_cert, comment
                 FROM certification
                 WHERE examinerID=:EID AND testID =:TID", 
                 array('EID'=>$examinerID, 'TID'=>$testID));

            // If one of the values was changed
            if ($oldCertification['pass'] != $pass || $oldCertification['comment'] != $comment || $oldCertification['date_cert'] != $date_cert) {
                $DB->update('certification', array(
                    'date_cert' => $date_cert,
                    'pass'      => $pass,
                    'comment'   => $comment
                ), array(
                    'examinerID' => $examinerID,
                    'testID'     => $testID,
                ));

                if ($oldDate != $date_cert || $oldVal != $pass) {
                    $DB->insert('certification_history', array(
                        'col'         => 'pass',
                        'old'         => $oldVal,
                        'old_date'    => $oldDate,
                        'new'         => $pass,
                        'new_date'    => $date_cert,
                        'primaryVals' => $certID,
                        'testID'      => $testID,
                        'visit_label' => $visit_label,
                        'changeDate'  => date("Y-m-d H:i:s"),
                        'userID'      => $_SESSION['State']->getUsername(),
                        'type'        => 'U'
                    ));
                }
            }
        }
    }
}
?>