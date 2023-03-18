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
        $loris = $request->getAttribute('loris');
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
        $fullpath      = $targetdir->getPathname() . '/' . $filename;

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

        // Scripts in tools/ often make relative imports, so we must change
        // our effective directory in order to use them.
        chdir($this->_path . "/tools");
        // Use tools/ script to generate an SQL patch file based on the
        // structure of the uploaded .linst file.
        exec(
            'php generate_tables_sql_and_testNames.php < '
            . escapeshellarg($fullpath)
        );

        if (!$this->isAdminUserConfigured()) {
            // If no adminUser is configured, automatic installation is not
            // possible, so this is the last step.
            return new \LORIS\Http\Response\JSON\OK(
                ['success' => self::UPLOAD_NO_INSTALL]
            );
        }

        // Install the instrument by directly sourcing the SQL file
        // generated by `generate_tables_sql_and_testNames.php` using bash.
        // If installation is successful, `exec` will complete
        // silently. Otherwise, it will return the exit code and error
        // messsage from MySQL. This will be stored in $result and
        // logged via LorisException.
        try {
            $table_name = \NDB_BVL_Instrument::factory(
                $this->loris,
                $instrument,
                '',
                '',
            )->table;
        } catch (\NotFound $e) {
            return (new \LORIS\Http\Response\JSON\NotFound(
                $e->getMessage()
            ));
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        $db_config = $loris->getConfiguration()->getSetting('database');
        exec(
            "mysql".
            " -h" . escapeshellarg($db_config['host']).
            " -u" . escapeshellarg($db_config['adminUser']).
            " -p" . escapeshellarg($db_config['adminPassword']).
            " " . escapeshellarg($db_config['database']).
            " < " . $this->_path . "project/tables_sql/".
            escapeshellarg($table_name . '.sql'),
            $output, // $output and $status are created automatically
            $status  // by `exec` and so need not be declared above.
        );
        // An exit code of 0 is a success and 1 means failure
        if ($status) {
            $this->logger->error(
                "The installation of $instrument.sql failed. "
                . "Either: the instrument table exists (but is not in the "
                . "test_names table), or "
                . "LORIS could not connect to the database using the "
                . "credentials supplied in the config file. "
                . "Exec output: `" . implode("\n", $output) . "`"
            );
            return new \LORIS\Http\Response\JSON\InternalServerError(
                self::UPLOAD_INSTALL_FAILED
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
            'caninstall'         => $this->isAdminUserConfigured()
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
        $table_dir      = $this->_path . 'project/tables_sql';

        return is_writable($instrument_dir) && is_writable($table_dir);
    }
    /**
     * Return whether the adminUser is properly configured, ie. credentials are
     * set and are valid.
     * The adminUser is a MySQL user with CREATE table permissions.
     * `empty` is used instead of `isset` as blank values in the config file
     * are still considered set.
     *
     * @return bool True if a adminUser is configured properly. False if not.
     */
    protected function isAdminUserConfigured() : bool
    {
        $db        = $this->loris->getDatabaseConnection();
        $db_config = $this->loris->getConfiguration()->getSetting('database');

        $credentials_set = !empty($db_config['adminUser'])
            && !empty($db_config['adminPassword']);
        if (!$credentials_set) {
            return false;
        }
        // Check if supplied credentials are valid by making a DB connection.
        // If the credentials are invalid, an error message will be logged to
        // the backend.
        try {
            $dbname = $db_config['database'];
            putenv("LORIS_{$dbname}_USERNAME=" . $db_config['adminUser']);
            putenv("LORIS_{$dbname}_PASSWORD=" . $db_config['adminPassword']);
            putenv("LORIS_{$dbname}_HOST=" . $db_config['host']);
            $connected = $db->connect(
                $dbname,
                false
            );
            putenv("LORIS_{$dbname}_USERNAME=");
            putenv("LORIS_{$dbname}_PASSWORD=");
            putenv("LORIS_{$dbname}_HOST=");
        } catch (\DatabaseException $e) {
            $connected = false;
        }
        return $connected;
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
