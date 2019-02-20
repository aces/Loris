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

$user =& User::singleton();
if (!$user->hasPermission('training')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once __DIR__ . "/../../../vendor/autoload.php";

$DB = Database::singleton();

// Get the ID for the instrument that was selected
$instrumentID = $_REQUEST['instrument'];

$quizCorrect = markQuiz($instrumentID);

if ($quizCorrect == false) {
    print "incorrect";
    exit();
} else {
    $user = User::singleton();

    $userFullName = $user->getFullname();
    $userCenter   = implode(',', $user->getCenterIDs());
    $examinerID   = $DB->pselectOne(
        "SELECT examinerID 
         FROM examiners
         WHERE full_name=:FN",
        array('FN' => $userFullName)
    );

    $dateArray = array(
                  'Y' => date('Y'),
                  'M' => date('m'),
                  'd' => date('d'),
                 );

    $values = array(
               'pass'      => array($instrumentID => 'certified'),
               'date_cert' => array($instrumentID => $dateArray),
               'examiner'  => $examinerID,
              );

    process($values);

    print "correct";
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
        return true;
    } else {
        return false;
    }
}

/**
 * Iterates through the quiz questions and checks if the answer provided is correct
 *
 * @param int $instrumentID The ID of the instrument
 *
 * @return bool
 */
function markQuiz($instrumentID): bool
{
    $correct = true;
    foreach ($_POST as $question => $answer) {
        if ($question != 'instrument') {
            if (correct($instrumentID, $question, $answer) == false) {
                $correct = false;
                break;
            }
        }
    }
    return $correct;
}

/**
 * Inserts or updates the certification status for the examiner completing training
 *
 * @param array $values Certification form values
 *
 * @return void
 */
function process($values)
{
    $DB = Database::singleton();

    foreach ($values['pass'] as $testID => $pass) {

        $date      = $values['date_cert'][$testID];
        $comment   = trim($values['comment'][$testID]);
        $date_cert = sprintf(
            "%04d-%02d-%02d",
            $date['Y'],
            $date['M'],
            $date['d']
        );

        // get the examinerID - edit_examiner passes the ID through
        // the identifier, training passes it as a value
        if (!empty($values['examiner'])) {
            $examinerID = $values['examiner'];
        } else {
            $examinerID = $this->identifier;
        }

        // Get the certificationID if it exists
        $certID = $DB->pselectOne(
            "SELECT certID 
             FROM certification
             WHERE examinerID=:EID AND testID=:TID",
            array(
             'EID' => $examinerID,
             'TID' => $testID,
            )
        );

         // if certification for new instrument for the examiner
        if (empty($certID) && !empty($pass)) {
            // insert a new certification entry
            $DB->insert(
                'certification',
                array(
                 'examinerID' => $examinerID,
                 'date_cert'  => $date_cert,
                 'testID'     => $testID,
                 'pass'       => $pass,
                 'comment'    => $comment,
                )
            );
            $certID = $DB->pselectOne(
                "SELECT certID 
                 FROM certification
                 WHERE examinerID =:EID and testID=:TID",
                array(
                 'EID' => $examinerID,
                 'TID' => $testID,
                )
            );
            // Add a new entry to the certification history table
            $DB->insert(
                'certification_history',
                array(
                 'col'         => 'pass',
                 'new'         => $pass,
                 'new_date'    => $date_cert,
                 'primaryVals' => $certID,
                 'testID'      => $testID,
                 'visit_label' => $visit_label,
                 'changeDate'  => date("Y-m-d H:i:s"),
                 'userID'      => $_SESSION['State']->getUsername(),
                 'type'        => 'I',
                )
            );
        } else { // update to a test certification for the examiner

            //select history events
            $oldVals = $DB->pselectRow(
                "SELECT ch.new, ch.new_date
                 FROM certification_history ch
                 LEFT JOIN certification c ON (c.certID=ch.primaryVals)
                 WHERE c.examinerID=:EID AND ch.testID=:TID
                 ORDER BY changeDate DESC",
                array(
                 'EID' => $examinerID,
                 'TID' => $testID,
                )
            );

            $oldVal  = $oldVals['new'];
            $oldDate = $oldVals['new_date'];

            $oldCertification = $DB->pselect(
                "SELECT pass, date_cert, comment
                 FROM certification
                 WHERE examinerID=:EID AND testID=:TID",
                array(
                 'EID' => $examinerID,
                 'TID' => $testID,
                )
            );

            // If one of the values was changed
            if ($oldCertification['pass'] != $pass
                || $oldCertification['comment'] != $comment
                || $oldCertification['date_cert'] != $date_cert
            ) {
                // Update the certification entry
                $DB->update(
                    'certification',
                    array(
                     'date_cert' => $date_cert,
                     'pass'      => $pass,
                     'comment'   => $comment,
                    ),
                    array(
                     'examinerID' => $examinerID,
                     'testID'     => $testID,
                    )
                );

                // Add a new entry to the certification history table
                if ($oldDate != $date_cert || $oldVal != $pass) {
                    $DB->insert(
                        'certification_history',
                        array(
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
                         'type'        => 'U',
                        )
                    );
                }
            }
        }
    }
}

