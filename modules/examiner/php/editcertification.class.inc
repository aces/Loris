<?php
/**
 * Examiner module
 *
 * This processes the values of the Edit Certification form and
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
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This processes the values of the Edit Certification form and
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
class EditCertification extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Checks if the user has access to the edit examiner form
     *
     * @return bool
     */
    function _hasAccess()
    {
        $user = \User::singleton();
        return $user->hasPermission('examiner_view')
            && $user->hasPermission('examiner_multisite');
    }

    /**
     * This acts as an AJAX endpoint for submission.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // The parent handles things like hasAccess checks.
        $resp = parent::handle($request);
        switch ($resp->getStatusCode()) {
        case 200:
            // If it was a 200 code, it just means display was called and
            // access validated. We still need to do other validations
            // and add the result body.
            break;
        default:
            return $resp;
        }

        // Ensure it's a POST request.
        if ($request->getMethod() != "POST") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Only POST requests are allowed"
                    )
                );
        }

        // Ensure examinerID is passed.
        $posts = $request->getParsedBody();
        if (!isset($posts['identifier'])) {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(400)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Must provide identifier to validate."
                    )
                );
        }

        // Submit data.
        $this->submitData($posts);
        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200);
    }

    /**
     * Handles the processing of the submitted data to DB
     *
     * @param array $dataArray the array of decoded json object containing
     *                         certification data
     *
     * @return void
     */
    function submitData(array $dataArray) : void
    {
        // Get examinerID
        $examinerID = $dataArray['identifier'];
        $DB         = \NDB_Factory::singleton()->database();
        $user       = \User::singleton();

        unset($dataArray['identifier']);
        foreach ($dataArray as $testID=>$row) {

            $data = json_decode($dataArray[$testID], true) ?? null;

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

                $oldStatus   = $oldCertification['pass'] ?? null;
                $oldComments = $oldCertification['comment'] ?? null;
                $oldDate     = $oldCertification['date_cert'] ?? null;

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
    }
}
