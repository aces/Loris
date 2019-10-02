<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Genomic Browser.
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

use LORIS\genomic_browser\Provisioners\FilesProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows filemanager to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FileManager extends Endpoint implements ETagCalculator
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
        case 'POST':
            return $this->_handlePOST($request);
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
                    'Failed to retrieve data for create timepoint.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden(
                    'Forbidden'
                );
            default:
                break;
            }
        }
        $user        = $request->getAttribute('user');
        $provisioner = (new FilesProvisioner())->forUser($user);
        // $provisioner = (new FilesProvisioner())->filter();
        $data         = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body         = array(
                         'data'         => $data,
                         'fieldOptions' => $this->_getFieldOptions(),
                         'subprojects'  => \Utility::getSubprojectList(),
                         'permissions'  => [
                                            'user'           => $user->getUsername(),
                                            'upload_allowed' => $user->hasPermission(
                                                'genomic_data_manager'
                                            ),
                                           ],
                        );
        $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        return $this->_cache;
    }

    /**
     * Provide the select inputs options
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        return array(
                'genomic_file_id' => $this->_formElementObjectCreator(
                    'genomic_file_id',
                    'text',
                    'Type',
                    null
                ),
                'file_name'         => $this->_formElementObjectCreator(
                    'file_name',
                    'text',
                    'Name',
                    null
                ),
                'description'       => $this->_formElementObjectCreator(
                    'description',
                    'text',
                    'Description',
                    null
                ),
                'genomic_file_type' => $this->_formElementObjectCreator(
                    'genomic_file_type',
                    'text',
                    'Type',
                    null
                ),
                'date_inserted'     => $this->_formElementObjectCreator(
                    'date_inserted',
                    'text',
                    'Date inserted',
                    null
                ),
                'inserted_by_user_id' => $this->_formElementObjectCreator(
                    'inserted_by_user_id',
                    'text',
                    'Inserted by User',
                    null
                ),
                'caveat'            => $this->_formElementObjectCreator(
                    'caveat',
                    'select',
                    'Caveat',
                    $this->getDistinctValues(
                        'genomic_files',
                        'Caveat'
                    )
                ),
                'notes'             => $this->_formElementObjectCreator(
                    'notes',
                    'text',
                    'Notes',
                    null
                ),
               );
    }

    /**
     * Provide an array of distinct value from a column in
     * the specified table. The first element has a null key and
     * its value is 'Any'.
     *
     * @param string $table  The tables name
     * @param string $column The column name
     *
     * @return array An array where value are keys as well as values
     */
    function getDistinctValues( $table, $column)
    {
        $DB      = \Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[str_replace(' ', '_', $value)] = $value;
                }
                return $carry;
            },
            array(null => 'Any')
        );
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = $request->getParsedBody();

        // User permission verification.
        $values = $this->_verifyPermissions($request, $values);

        if (isset($values['error'])) {
            switch ($values['error']) {
            case 'BadRequest':
                return new \LORIS\Http\Response\BadRequest(
                    'Failed to retrieve data for create timepoint.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden(
                    'Forbidden'
                );
            default:
                break;
            }
        }

        // Genomic File for uploading.
        $genomicFile = new uploading\genomicfile();

        $genomicFile->setupUploading(
            $request->getAttribute('user'), // user
            $_FILES, // file data
            $values,
        );

        return new \LORIS\Http\Response\JsonResponse(
            $this->_values
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
            return $values;
        }
        return $values;
    }

    /**
     * Used to create (select, text, ...) element for form filter.
     *
     * @param string     $name   for element
     * @param string     $type   for element
     * @param string     $label  for element
     * @param array|null $values for element
     *
     * @return object
     */
    private function _formElementObjectCreator(
        string $name,
        string $type,
        string $label,
        ?array $values
    ) : object {
        $element        = new \stdClass();
        $element->name  = $name;
        $element->type  = $type;
        $element->label = $label;
        if (isset($values)) {
            $element->options = $values;
        }
        return $element;
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
        return array(
                'GET',
                'POST',
               );
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
