<?php declare(strict_types=1);

/**
 * File contains the acknowledgements class.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\acknowledgements;

/**
 * The acknowledgements provides the menu filter for the acknowledgements module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Acknowledgements extends \DataFrameworkMenu
{
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
        $yesNoOptions = [
            'Yes' => dgettext("loris", 'Yes'),
            'No'  => dgettext("loris", 'No'),
        ];

        return [
            'presents' => $yesNoOptions,

        ];

    }

    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new AcknowledgementsProvisioner($this->loris);
    }

    /**
     * Override the toJSON function to provide custom behavior.
     *
     * @return string A JSON-encoded string with custom data.
     */
    public function toJSON(): string
    {
        $table  = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisionerWithFilters());
        $arr    = array_map(
            function ($row) {
                return array_values($row);
            },
            json_decode($table->toJSON(\NDB_Factory::singleton()->user()), true)
        );
        $config = \NDB_Config::singleton();
        $m      = [];
        $m['citation_policy'] = $config->getSetting('citation_policy');
        $m['minYear']         = $config->getSetting('startYear');
        $m['maxYear']         = $config->getSetting('endYear');

        return json_encode(
            [
                'Data'         => $arr,
                'fieldOptions' => $this->getFieldOptions(),
                'meta'         => $m,
            ]
        );
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
                $baseURL . "/acknowledgements/js/acknowledgementsIndex.js",
            ]
        );
    }
}
