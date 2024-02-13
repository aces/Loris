<?php

/**
 * Survey_Handle
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Participant Portal
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\participant_portal;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Participant_Portal
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Survey_Handle extends \NDB_Form
{
    public $skipTemplate = true;
    /**
     * GET method gets a list of Participant's categories and
     * the children's categories.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod()=='POST') {
            $values = $request->getParsedBody();
            $result = $this->_validate($values);
            if ($result) {
                return (new \LORIS\Http\Response())
                    ->withHeader("Content-Type", "text/plain")
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode($result)
                        )
                    );
            }
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("no survey found.")
                    )
                );
        }
    }
    /**
     * GET method gets a list of participant's categroies and
     * the children's categories.
     *
     * @param Array $values The values need to be validated
     *
     * @return mixed the outgoing response
     */
    function _validate($values)
    {
            $db = \NDB_Factory::singleton()->database();

            $surveys = $db->pselect(
                "SELECT Visit_label, Test_name, Status, OneTimePassword 
                 FROM participant_accounts p
                 JOIN session s ON (p.SessionID=s.ID)
                 JOIN candidate c ON (c.CandID=s.CandID)
                 JOIN participant_emails pe ON (p.Test_name=pe.Test_name)
                 WHERE pe.Email=:surv_email AND c.ParticipantID=:pid",
                [
                    'surv_email' => $values['email'],
                    'pid'        => $values['participantID'],
                ]
            );
        if (empty($surveys)) {
            return null;
        }
        return $surveys;

    }
}
