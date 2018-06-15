<?php
/**
 * Processes the Edit Certification form values and
 * inserts updates into the database.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\examiner;

$user = \User::singleton();
if (!($user->hasPermission('examiner_view') && $user->hasPermission('examiner_multisite'))) {
    header("HTTP/1.1 403 Forbidden");
    exit(
        "You do not have the correct permissions for this operation."
    );
}
$DB = \NDB_Factory::singleton()->database();

// get the examinerID - edit_examiner passes the ID through
// the identifier
$examinerID = $_POST['identifier'] ?? null;

// Get the list of certification instruments
$instruments = EditExaminer::getCertificationInstruments();

foreach($instruments as $testID=>$row) {

    $data = json_decode($_POST[$testID], true) ?? null;

    $comments = $data['comments'] ?? null;
    $date     = $data['date'] ?? null;
    $status   = $data['status'] ?? null;

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
    if (empty($certID) && !empty($status)) {

        // Insert a new certification entry
        $newData = array(
                 'examinerID' => $examinerID,
                 'testID'     => $testID,
                 'pass'       => $status,
                 'comment'    => $comments,
                );
        if ($date != "") {
            $newData['date_cert'] = $date;
        }
        $DB->insert(
            'certification',
            $newData
        );

        // Add a new entry to the certification history table
        $data = array(
                 'col'         => 'pass',
                 'new'         => $status,
                 'primaryVals' => $certID,
                 'testID'      => $testID,
                 'visit_label' => null,
                 'changeDate'  => date("Y-m-d H:i:s"),
                 'userID'      => $user->getUsername(),
                 'type'        => 'I',
                );
        if ($date != "") {
            $data['new_date'] = $date;
        }

        $DB->insert(
            'certification_history',
            $data
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

        $oldVal  = $oldVals['new'] ?? null;
        $oldDate = $oldVals['new_date'] ?? null;

        $oldCertification = $DB->pselectRow(
            "SELECT pass, date_cert, comment
             FROM certification
             WHERE examinerID=:EID AND testID=:TID",
            array(
             'EID' => $examinerID,
             'TID' => $testID,
            )
        );

        $oldStatus = $oldCertification['pass'] ?? null;
        $oldComments = $oldCertification['comment'] ?? null;
        $oldDate = $oldCertification['date_cert'] ?? null;

        // If one of the values was changed
        if ($oldStatus != $status
            || $oldComments != $comments
            || $oldDate != $date
        ) {
            // Update the certification entry
            $data = array(
                     'pass'    => $status,
                     'comment' => $comments,
                    );
            if ($date != "") {
                $data['date_cert'] = $date;
            }
            $DB->update(
                'certification',
                $data,
                array(
                 'examinerID' => $examinerID,
                 'testID'     => $testID,
                )
            );

            // Add a new entry to the certification history table
            if ($oldDate != $date || $oldVal != $status) {
                $data = array(
                         'col'         => 'pass',
                         'old'         => $oldVal,
                         'new'         => $status,
                         'primaryVals' => $certID,
                         'testID'      => $testID,
                         'visit_label' => null,
                         'changeDate'  => date("Y-m-d H:i:s"),
                         'userID'      => $user->getUsername(),
                         'type'        => 'U',
                        );
                if ($oldDate != "") {
                    $data['old_date'] = $oldDate;
                }
                if ($date != "") {
                    $data['new_date'] = $date;
                }
                $DB->insert(
                    'certification_history',
                    $data
                );
            }
        }
    }
}
