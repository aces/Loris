<?php declare(strict_types=1);

namespace LORIS\acknowledgements;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Post method handles updating a file.
 * Delete method handles deleting a file.
 * Get method handles getting a file.
 * Put method handles editing a file.
 * This class contains functions providing upload and edit functionality for
 * files in the acknowledgements.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Acknowledgementsprocess extends \NDB_Page
{

    public $AjaxModule   = true;
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
        return true;
    }

    /**
     * Handle how to operate all the files.
     * POST method uploads a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        switch ($request->getMethod()) {
        case "POST":
            return $this->createAcknowledgement($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }
    /**
     * Handles the document editing process
     *
     * @param ServerRequestInterface $req The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function createAcknowledgement(ServerRequestInterface $req): ResponseInterface
    {
        $DB           = $this->loris->getDatabaseConnection();
        $affiliations = "";
        $degrees      = "";
        $roles        = "";
        $values       = $req->getParsedBody();
        if (isset($values) && !is_null($values)) {
            if (isset($values['addPresent']) && $values['addPresent'] === 'Yes') {
                $values['addEndDate'] = null;
            }
            if (isset($values['addAffiliations'])
                && !is_null($values['addAffiliations'])
            ) {
                $affiliations = is_array($values['addAffiliations']) ?
                implode(', ', $values['addAffiliations']) :
                $values['addAffiliations'];
            }
            if (isset($values['addDegrees']) && !is_null($values['addDegrees'])) {
                $degrees = is_array($values['addDegrees']) ?
                implode(', ', $values['addDegrees']) :
                $values['addDegrees'];
            }
            if (isset($values['addRoles']) && !is_null($values['addRoles'])) {
                $roles = is_array($values['addRoles']) ?
                implode(', ', $values['addRoles']) :
                $values['addRoles'];
            }
            $results = [
                'ordering'      =>
                  isset($values['addOrdering']) ?$values['addOrdering'] : null,
                'full_name'     =>
                  isset($values['addFullName']) ? $values['addFullName'] : null,
                'citation_name' =>
                  isset($values['addCitationName'])?
                  $values['addCitationName'] : null,
                'affiliations'  => isset($affiliations) ? $affiliations: null,
                'degrees'       => isset($degrees) ? $degrees: null,
                'roles'         => isset($roles) ? $roles: null,
                'start_date'    =>
                  isset($values['addStartDate'])? $values['addStartDate'] : null,
                'end_date'      =>
                  isset($values['addEndDate'])? $values['addEndDate'] : null,
                'present'       =>
                  isset($values['addPresent'])? $values['addPresent'] : null,
            ];

            $DB->insert('acknowledgements', $results);
            unset($values);
                $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
            return (new \LORIS\Http\Response())
                ->withStatus(200)
                ->withHeader(
                    "Location",
                    "{$baseURL}/acknowledgements/"
                );
        }
    }
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'POST',
        ];
    }
}
