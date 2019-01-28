<?php
/**
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Editfile extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return (
            $user->hasPermission('document_repository_delete')
            || $user->hasPermission('document_repository_view')

        );
    }

    /**
     * Handle a post form
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod() == "POST") {
            $this->editDocFile();
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("updaite")
                    )
                );
        }
    }
    /**
 * Handles the document edit process
 *
 * @throws DatabaseException
 *
 * @return void
 */
    function editDocFile(): void
    {
        $db           = \Database::singleton();
        $user         = \User::singleton();
        $updateValues = [
                         'File_category' => $_POST['category'],
                         'For_site'      => $_POST['forSite'],
                         'Instrument'    => $_POST['instrument'],
                         'comments'      => $_POST['comments'],
                         'version'       => $_POST['version'],
                         'visitLabel'    => $_POST['visitLabel'],
                         'pscid'         => $_POST['pscid'],
                        ];
        try {
            $db->update(
                'document_repository',
                $updateValues,
                ['record_id' => $_POST['id']]
            );
        } catch (DatabaseException $e) {
            showError("Could not update the file. Please try again!");
        }
    }
}
