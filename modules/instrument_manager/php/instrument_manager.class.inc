<?php declare(strict_types=1);
namespace LORIS\instrument_manager;

/**
 * Contains functions used to view and manage instruments installed in LORIS.
 * LINST instruments can be uploaded and installed automatically.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Instrument_Manager extends \DataFrameworkMenu
{
    private string $_path;
    private string $_factory;
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

        return [
            'writable'   => $this->canWriteFiles(),
        //            'caninstall' => $this->isAdminUserConfigured()
            'caninstall' => true
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
        $this->_factory = \NDB_Factory::singleton();
        $this->_path    = $this->_factory->config()->getSetting("base");

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
        $db        = $this->_factory->database();
        $db_config = $this->_factory->config()->getSetting('database');

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
