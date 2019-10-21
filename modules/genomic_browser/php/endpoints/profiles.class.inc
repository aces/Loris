<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Genomic_Browser.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser\endpoints;

use LORIS\genomic_browser\Provisioners\ProfileProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows profiles to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Profiles extends Endpoint implements ETagCalculator
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
        $provisioner = (new ProfileProvisioner())->forUser($user);

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

        $user = $request->getAttribute('user');
        // PSC
        if ($user->hasPermission('genomic_browser_view_allsites')) {
            // has access to all sites genomic data
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }
        $any_options = array(
                        'Y' => 'Yes',
                        'N' => 'No',
                       );
        return array(
                'centerID'     => parent::formElementObjectCreator(
                    'centerID',
                    'select',
                    'Site',
                    true,
                    $list_of_sites
                ),
                'DCCID'        => parent::formElementObjectCreator(
                    'DCCID',
                    'text',
                    'DCCID',
                    true,
                    null
                ),
                'PSCID'        => parent::formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    false,
                    null
                ),
                'Sex'          => parent::formElementObjectCreator(
                    'sex',
                    'select',
                    'Sex',
                    false,
                    array(
                     'Male'   => 'Male',
                     'Female' => 'Female',
                    )
                ),
                'SubprojectID' => parent::formElementObjectCreator(
                    'SubprojectID',
                    'select',
                    'Subproject',
                    false,
                    \Utility::getSubprojectList()
                ),
                'DoB'          => parent::formElementObjectCreator(
                    'dob',
                    'date',
                    'Date of Birth',
                    true,
                    array('maxlength' => 10)
                ),
                'External_ID'  => parent::formElementObjectCreator(
                    'External_ID',
                    'text',
                    'External ID',
                    true,
                    null
                ),
                'File'         => parent::formElementObjectCreator(
                    'File',
                    'select',
                    'Files',
                    false,
                    $any_options
                ),
                'SNP'          => parent::formElementObjectCreator(
                    'SNP',
                    'select',
                    'SNPs found',
                    false,
                    $any_options
                ),
                'CNV'          => parent::formElementObjectCreator(
                    'CNV',
                    'select',
                    'CNVs found',
                    false,
                    $any_options
                ),
                'CPG'          => parent::formElementObjectCreator(
                    'CPG',
                    'select',
                    'CPGs found',
                    false,
                    $any_options
                ),
               );
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
