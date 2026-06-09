<?php declare(strict_types=1);

namespace LORIS\login;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * GET request method for login summary statistics.
 *
 * @category Loris
 * @package  Login
 * @author   Saagar Arya <saagar.arya@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Summary_Statistics extends \NDB_Page implements ETagCalculator
{
    /**
     * This function will return a json object for login summary statistics module.
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
            $DB       = $this->loris->getDatabaseConnection();
            $response = $DB->pselect(
                "SELECT * FROM login_summary_statistics
                WHERE Value > 0
                ORDER BY QueryOrder ASC",
                [],
            );
            if (count($response) == 0) {
                return new \LORIS\Http\Response\JsonResponse(null);
            }
            $projects = $DB->pselectCol(
                "SELECT DISTINCT Project FROM login_summary_statistics",
                []
            );

            // csv version for exporting to clipboard
            $reusable_response = iterator_to_array($response);
            $csv = "Project,Statistic,Value\n";
            foreach ($reusable_response as &$row) {
                $csv .= $row['Project'].",".$row['Title'].",".$row['Value'] . "\n";
                // we just add an "s" for the plural form since the final
                // string will come from dngettext anyways
                $row['Title'] = dngettext(
                    "login",
                    $row['Title'],
                    $row['Title'] . 's',
                    $row['Value']
                );
            }

            return new \LORIS\Http\Response\JsonResponse(
                [
                    'statistics' => $reusable_response,
                    'projects'   => $projects,
                    'csv'        => $csv,
                ]
            );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode((string) $this->handle($request)->getBody()));
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
     * Returns true if the user has permission to access
     * the Login module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return true;
    }
}
