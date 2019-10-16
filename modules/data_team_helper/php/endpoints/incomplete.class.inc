<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Data_Team_Helper.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Data_Team_Helper
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\data_team_helper\endpoints;

use LORIS\data_team_helper\Provisioners\IncompleteProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_DataTeamHelper Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows profiles to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Data_Team_Helper
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Incomplete extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

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
            return new \LORIS\Http\Response\MethodNotAllowed(
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
        // Parse GET query params.
        $values = $request->getQueryParams();
        // User permission verification.
        $values = $this->_verifyPermissions($request, $values);
        if (isset($values['error'])) {
            switch ($values['error']) {
            case 'BadRequest':
                return new \LORIS\Http\Response\BadRequest(
                    'Failed to retrieve data for Profiles.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden();
            default:
                break;
            }
        }

        $user        = $request->getAttribute('user');
        $provisioner = (new IncompleteProvisioner())->forUser($user);

        $data         = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body         = array(
                         'data'         => $data,
                         'fieldOptions' => $this->_getFieldOptions($request),
                         'subprojects'  => \Utility::getSubprojectList(),
                        );
        $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        return $this->_cache;
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
        $user          = $request->getAttribute('user');
        $visit_array   = \Utility::getExistingVisitLabels();
        $visit_array   = array_combine($visit_array, $visit_array);
        $list_of_sites = array();
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = $list_of_sites;
            }
        } else {
            // allow only to view own study site data
            $list_of_sites = $user->getStudySites();
            $list_of_sites = $list_of_sites;
        }

        // PSC
        if ($user->hasPermission('data_team_helper')) {
            // has access to all sites genomic data
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }
        return array(
                'ID'          => parent::formElementObjectCreator(
                    'ID',
                    'text',
                    'ID',
                    true,
                    null
                ),
                'visit_label' => parent::formElementObjectCreator(
                    'visit_label',
                    'select',
                    'Visit',
                    false,
                    $visit_array
                ),
                'PSCID'       => parent::formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    false,
                    null
                ),
                'candid'      => parent::formElementObjectCreator(
                    'candid',
                    'text',
                    'DCCID',
                    false,
                    null
                ),
                'SessionID'   => parent::formElementObjectCreator(
                    'SessionID',
                    'text',
                    'SessionID',
                    true,
                    null
                ),
                'test_name'   => parent::formElementObjectCreator(
                    'test_name',
                    'text',
                    'test_name',
                    true,
                    null
                ),
                'data_entry'  => parent::formElementObjectCreator(
                    'data_entry',
                    'text',
                    'data_entry',
                    true,
                    null
                ),
                'commentid'   => parent::formElementObjectCreator(
                    'commentid',
                    'text',
                    'commentid',
                    true,
                    null
                ),
                'Full_name'   => parent::formElementObjectCreator(
                    'Full_name',
                    'text',
                    'Full_name',
                    true,
                    null
                ),
                'Instrument'  => parent::formElementObjectCreator(
                    'Instrument',
                    'select',
                    'Instrument',
                    false,
                    \Utility::getAllInstruments()
                ),
                'Project'     => parent::formElementObjectCreator(
                    'Project',
                    'select',
                    'Project',
                    true,
                    \Utility::getProjectList()
                ),
                'Site'        => parent::formElementObjectCreator(
                    'Site',
                    'select',
                    'Site',
                    true,
                    $list_of_sites
                ),
               );
    }

    /**
     * Permission verification.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     * @param array                  $values  The form values.
     *
     * @return array
     */
    private function _verifyPermissions(
        ServerRequestInterface $request,
        array $values
    ) : array {
        $user = $request->getAttribute('user');
        if (!$user->hasPermission('genomic_browser_view_site')
            || !$user->hasPermission('genomic_browser_view_allsites')
        ) {
            $values['error'] = 'Forbidden';
        }
        return $values;
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
        return ($user->hasPermission('genomic_browser_view_allsites')
            || $user->hasPermission('genomic_browser_view_site'));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return array('GET');
    }

    /**
     * Return a list of LORIS API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    protected function supportedVersions(): array
    {
        return array('unknown');
    }
}
