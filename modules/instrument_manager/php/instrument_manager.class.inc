<?php declare(strict_types=1);
namespace LORIS\instrument_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Contains functions used to view and manage instruments installed in LORIS.
 * LINST instruments can be uploaded and installed automatically.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Instrument_Manager extends \DataFrameworkMenu
{
    const PERMISSIONS = [
        'instrument_manager_read',
        'instrument_manager_write'
    ];
    // Error messages
    const ALREADY_INSTALLED     = 'This instrument already exists in the ' .
                                  'test battery.';
    const CANNOT_WRITE_FILES    = 'Automatic installation of instruments is ' .
                                  'not possible given the current server ' .
                                  'configuration. Please contact your ' .
                                  'administrator if you require this ' .
                                  'functionality.';
    const FILE_ALREADY_EXISTS   = 'This file has already been uploaded. ' .
                                  'Please contact your administrator to ' .
                                  'install the instrument.';
    const BAD_REQUEST           = 'Uploaded file is not of type LINST or is ' .
                                  'too large.';
    const UPLOAD_INSTALL_FAILED = 'File upload is successful but the ' .
                                  'installation failed. Please contact your ' .
                                  'administrator.';
    const UPLOAD_NO_INSTALL     = 'File upload is successful but the ' .
                                  'instrument needs to be installed manually.';
    private string $_path;
    /**
     * Checking permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(self::PERMISSIONS);
    }
    /**
     * Handle a PSR7 Request for that endpoint.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $method = $request->getMethod();
        if ($method == 'POST') {
            return $this->handlePOST($request);
        }

        return parent::handle($request);
    }

    /**
     * Handle a POST request for instrument upload. It moves the uploaded file
     * in the project/instruments directory then call the php script from the
     * tools directory to generate sql statement required for the installation
     * of the instrument. Finaly, it source the sql file to complete the
     * installation.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    protected function handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        // Ensure the user is allowed to upload.
        if (! $request->getAttribute('user')->hasPermission(
            'instrument_manager_write'
        )
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }
        // Ensure the server is properly configured.
        if (!$this->canWriteFiles()) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                self::CANNOT_WRITE_FILES
            );
        }

        $uploaded_file = $request->getUploadedFiles()['install_file'];
        $filename      = $uploaded_file->getClientFilename();
        $instrument    = pathinfo($filename)['filename'];
        $targetdir     = new \SplFileInfo($this->_path . 'project/instruments/');

        if ($this->instrumentExists($instrument)) {
            // An instrument with this name already exists in the test_names
            // table. Abort upload.
            return new \LORIS\Http\Response\JSON\Conflict(self::ALREADY_INSTALLED);
        }

        /* Although only .linst files should be uploaded to this module, and
         * they are just special text files, they are marked as
         * application/octet-stream upon upload.
         */
        $uploader = (new \LORIS\FilesUploadHandler($targetdir))
            ->withPermittedMIMETypes(
                'application/octet-stream'
            );

        $response = $uploader->handle($request);

        if (!in_array($response->getStatusCode(), [200, 201], true)) {
            if ($response->getStatusCode() == 409) {
                /* Don't update the file if it already exists on the back-end.
                 * Instead, inform users that an administrator must install it
                 * on their behalf.
                 * This should only happen for users on a system where automatic
                 * installation is disabled (ie. has no adminUser).
                 */
                return new \LORIS\Http\Response\JSON\Conflict(
                    self::FILE_ALREADY_EXISTS
                );
            }
            return $response;
        }

        try {

            $inst = \NDB_BVL_Instrument::factory(
                $this->loris,
                $instrument,
                '',
                '',
            );

            $DB = $this->loris->getDatabaseConnection();
            $DB->insert(
                "test_names",
                [
                    'test_name' => $instrument,
                    'Full_name' => $inst->getFullName(),
                    'Sub_group' => 1,
                ]
            );
            file_put_contents(
                \Utility::pathJoin(
                    $targetdir->getPath(),
                    $targetdir->getFilename(),
                    $instrument . ".meta"
                ),
                "jsondata{@}true\n"
            );

        } catch (\NotFound $e) {
            return (new \LORIS\Http\Response\JSON\NotFound(
                $e->getMessage()
            ));
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }
        return new \LORIS\Http\Response\JSON\Created(["ok"=>"ok"]);
    }
    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return null;
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool false
     */
    public function useProjectFilter() : bool
    {
        return false;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
        $db    = $this->loris->getDatabaseConnection();
        $perms = $db->pselectCol("SELECT code FROM permissions", []);
        return [
            'allPermissionCodes' => $perms,
            'writable'           => $this->canWriteFiles(),
        ];

    }
    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new InstrumentManagerProvisioner();
    }

    /**
     * Checks if the instruments and table_sql are writable
     *
     * @return bool True if both directories are writable
     */
    protected function canWriteFiles(): bool
    {
        $this->_path    =  $this->loris->getConfiguration()->getSetting('base');
        $instrument_dir = $this->_path . 'project/instruments';

        return is_writable($instrument_dir);
    }

    /**
     * Checks the test_names table for the existence of the instrument
     *
     * @param string $instrument The instrument name
     *
     * @return bool True if the name is found in the table
     */
    protected function instrumentExists(string $instrument): bool
    {
        $count = $this->loris->getDatabaseConnection()->pselectOne(
            'SELECT count(*) FROM test_names WHERE Test_name=:v_instrument',
            [':v_instrument' => $instrument]
        );
        return $count > 0;
    }

    /**
     * {@inheritDoc}
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/instrument_manager/js/instrumentManagerIndex.js",
            ]
        );
    }
}
