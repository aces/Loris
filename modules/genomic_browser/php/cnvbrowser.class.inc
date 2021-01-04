<?php declare(strict_types=1);

namespace LORIS\genomic_browser;

use LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch;
use LORIS\genomic_browser\Provisioners\CnvProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * The CnvBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows cnvbrowser to be processed as part of the genomic browser.
 * Used for populating the Genomic Browser (CNV FilterDataTable).
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CnvBrowser extends \NDB_Page implements ETagCalculator
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
        // Ensure GET request.
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
        $provisioner = (new CnvProvisioner())->filter($filter);
        $user        = $request->getAttribute('user');

        $data = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body = [
            'data'         => $data,
            'fieldOptions' => $this->_getFieldOptions($request),
            'subprojects'  => \Utility::getSubprojectList(),
        ];
        return new \LORIS\Http\Response\JsonResponse($body);
    }

    /**
     * Provide the select inputs options
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions(
        ServerRequestInterface $request
    ) : array {
        $user = $request->getAttribute('user');
        // centerID
        $list_of_sites = $user->hasPermission('genomic_browser_view_allsites')
            ? \Utility::getSiteList()
            : $user->getStudySites();
        $list_of_sites = array_combine($list_of_sites, $list_of_sites);
        // Platform
        $DB = \Database::singleton();
        $platform_results = $DB->pselect(
            "SELECT distinct Name FROM genotyping_platform",
            []
        );
        $platform_options = [];
        foreach ($platform_results as $row) {
            $name = $row['Name'];
            $platform_options[$name] = $name;
        }

        return (new \LORIS\genomic_browser\Views\CNV(
            $platform_options,
            \Utility::getSubprojectList(),
            $list_of_sites
        ))->toArray();
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
