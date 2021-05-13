<?php declare(strict_types=1);

namespace LORIS\genomic_browser;

use LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch;
use LORIS\genomic_browser\Provisioners\GwasProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * The GwasBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows gwasbrowser to be processed as part of the genomic browser.
 * Used for populating the Genomic Browser (GWAS FilterDataTable).
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class GwasBrowser extends \NDB_Page implements ETagCalculator
{

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
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $filter      = new HasAnyPermissionOrUserSiteMatch(
            ['genomic_browser_view_allsites']
        );
        $provisioner = (new GwasProvisioner())->filter($filter);
        $user        = $request->getAttribute('user');

        $data = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body = [
            'data'         => $data,
        ];
        return new \LORIS\Http\Response\JsonResponse($body);
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
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'genomic_browser_view_allsites',
                'genomic_browser_view_site'
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
        return ['GET'];
    }

}
