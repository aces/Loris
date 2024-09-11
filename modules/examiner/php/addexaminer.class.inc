<?php declare(strict_types=1);
namespace LORIS\examiner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Post method handles add an examiner.
 * This class contains functions providing add and edit functionality.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class AddExaminer extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true only if the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'examiner_view',
                'examiner_multisite'
            ]
        );
    }

    /**
     * Handle how to operate all the files.
     * POST method uploads a file.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        switch ($request->getMethod()) {
        case "POST":
            return $this->addExaminer($request);
        default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["POST"]
            ));
        }
    }
    /**
     * Handles the document editing process
     *
     * @param ServerRequestInterface $req The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function addExaminer(ServerRequestInterface $req): ResponseInterface
    {
        $values = $req->getParsedBody();
        //Get centerID
        $fullName = $values['addName'] ?? '';
        $siteID   = $values['addSite'] ?? '';

        // check for site permissions
        $user = \User::singleton();
        if (!$user->hasPermission('examiner_multisite')
            && !in_array($siteID, $user->getCenterIDs())
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'Permission denied: You cannot assign examiner to this Site.'
            );
        };

        if ($this->examinerExists($fullName, $siteID)) {
            return  new \LORIS\Http\Response\JSON\Conflict(
                'This examiner already exists.'
            );
        }

        //Get radiologist value
        $radiologist = 0;
        if (isset($values['addRadiologist'])
            && $values['addRadiologist'] === 'true'
        ) {
            $radiologist = 1;
        }
            $DB = $this->loris->getDatabaseConnection();

        // Check if examiner is already in the database 'examiners', if not add them
        // Assumption made that only non-users are added to the table here
        // Otherwise, would need more information to identify which loris user
        // the name refers to
        $examinerID = $DB->pselectOne(
            "SELECT examinerID
             FROM examiners
             WHERE full_name=:fullName
             AND userID IS NULL",
            ['fullName' => $fullName]
        );

        if (empty($examinerID)) {
            $DB->insert(
                'examiners',
                [
                    'full_name'   => $fullName,
                    'radiologist' => $radiologist
                ]
            );
        } else {
            $DB->update(
                'examiners',
                ['radiologist' => $radiologist],
                ['examinerID' => $examinerID]
            );
        }

        $DB->insert(
            'examiners_psc_rel',
            [
                'examinerID' => $this->getExaminerID($fullName),
                'centerID'   => $siteID,
            ]
        );
        return (new \LORIS\Http\Response())
            ->withStatus(200)
            ->withHeader("Content-Type", "text/plain")
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode("Added!")
                )
            );
    }
    /**
     * Check the examiner name from the database
     *
     * @param string $fullName name associated to examiner in the DB table
     * @param string $siteID   site ID
     *
     * @return bool true or false
     */
    function examinerExists($fullName, $siteID): bool
    {
        $DB         = \NDB_Factory::singleton()->database();
        $examinerID = $DB->pselectOne(
            "SELECT e.examinerID
             FROM examiners e
                  LEFT JOIN examiners_psc_rel epr ON (e.examinerID=epr.examinerID)
             WHERE e.full_name=:fullName
             AND epr.centerID=:siteID
             AND e.userID IS NULL",
            [
                'fullName' => $fullName,
                'siteID'   => $siteID,
            ]
        );

        return !empty($examinerID);
    }
    /**
     * Getter for the examinerID value from the database
     *
     * @param string $fullName name associated to examiner in the DB table
     *
     * @return ?string   ID of the examiner
     */
    function getExaminerID($fullName): ?string
    {
        $DB = \NDB_Factory::singleton()->database();
        return $DB->pselectOne(
            "SELECT examinerID
             FROM examiners
             WHERE full_name=:fullName AND userID IS NULL",
            ['fullName' => $fullName]
        );
    }
}
