<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * This class implements the /issues endpoint for redcap module.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Issues extends \NDB_Page
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'redcap_ui_view',
            ]
        );
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
        ];
    }

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Handle an incoming HTTP GET request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $db     = $this->loris->getDatabaseConnection();
        $issues = $db->pselect(
            "SELECT
                i.issueID,
                i.title,
                i.status,
                i.dateCreated,
                (
                    SELECT ic.issueComment
                    FROM issues_comments ic
                    WHERE ic.issueID = i.issueID
                    ORDER BY ic.dateAdded DESC
                    LIMIT 1
                ) as description
            FROM issues i
                JOIN modules m ON (m.ID = i.module)
            WHERE m.Name = 'redcap'
            ORDER BY i.dateCreated DESC
            LIMIT 10000
            ",
            []
        );

        if ($issues->count() === 0) {
            return new \LORIS\Http\Response\JSON\OK([]);
        }

        return new \LORIS\Http\Response\JSON\OK(
            array_map(
                fn($v) => array_values($v),
                iterator_to_array($issues->getIterator())
            )
        );
    }
}
