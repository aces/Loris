<?php declare(strict_types=1);

namespace LORIS\behavioural_qc;

use LORIS\behavioural_qc\Provisioners\IncompleteProvisioner;
use LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * The Incomplete Class.
 *
 * GET request method for endpoint in behavioural_qc module.
 * Used for populating the Incomplete Forms table.
 *
 * @category Behavioural
 * @package  Loris
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Incomplete extends \NDB_Page implements ETagCalculator
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
     * "Incomplete Forms" form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $filter      = new HasAnyPermissionOrUserSiteMatch(
            ['access_all_profiles', 'behavioural_quality_control_view']
        );
        $provisioner = (new IncompleteProvisioner())->filter($filter);

        $user = $request->getAttribute('user');

        $data = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body = [
            'data'         => $data,
            'fieldOptions' => $this->_getFieldOptions(),
            'subprojects'  => \Utility::getSubprojectList(),
        ];
        return new \LORIS\Http\Response\JsonResponse($body);
    }

    /**
     * Provide the field options for the incomplete form.
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        return (new \LORIS\behavioural_qc\Views\Incomplete(
            \Utility::getVisitList(),
            \Utility::getAllInstruments(),
            $this->getProjectOptions(),
            $this->getSiteOptions()
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
     * the behavioural_qc module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('behavioural_quality_control_view');
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
