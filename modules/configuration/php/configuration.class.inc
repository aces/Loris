<?php declare(strict_types=1);

/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\configuration;

/**
 * Configuration Class
 *
 * This class is to configure the system settings
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class Configuration extends \NDB_Form
{
    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

     /**
      * Loads the main configuration module page.
      *
      * @return void
      */
    function setup()
    {
        parent::setup();
        $config = \NDB_Config::singleton();
        $DB     = $this->loris->getDatabaseConnection();

        $scans      = $DB->pselect(
            "SELECT MriScanTypeName FROM mri_scan_type",
            []
        );
        $scan_types = ['' => ''];
        foreach ($scans as $type) {
            $val = $type['MriScanTypeName'];
            $scan_types[$val] = $val;
        }

        $date_format = [
            ''    => '',
            'Ymd' => 'Ymd (EX: 2015-12-28)',
            'Ym'  => 'Ym (EX: 2015-12)'
        ];

        $instruments     = \NDB_BVL_Instrument::getInstrumentNamesList($this->loris);
        $instruments[''] = '';

        $this->tpl_data['parentMenuItems'] = $this->_getParentConfigLabels();
        $this->tpl_data['config']          = $this->_getConfigSettingTree();
        $this->tpl_data['instruments']     = $instruments;
        $this->tpl_data['sandbox']         = $config->getSetting("sandbox");
        $this->tpl_data['scan_types']      = $scan_types;
        $this->tpl_data['log_levels']      = [
            'none'      => 'None',
            'debug'     => 'Debug',
            'info'      => 'Info',
            'notice'    => 'Notice',
            'warning'   => 'Warning',
            'error'     => 'Error',
            'critical'  => 'Critical',
            'alert'     => 'Alert',
            'emergency' => 'Emergency',
        ];

        $this->tpl_data['date_format']   = $date_format;
        $this->tpl_data['lookup_center'] = [
            ''            => '',
            'PatientID'   => 'PatientID',
            'PatientName' => 'PatientName',
        ];
    }

    /**
     * Gets an array of the top level configuration items
     * This is used to create the configuration setting category menu
     *
     * @return array of parent config items
     */
    function _getParentConfigLabels()
    {
        $DB = $this->loris->getDatabaseConnection();

        $parentConfigItems = $DB->pselect(
            "SELECT Label, Name
             FROM ConfigCategories
             WHERE Visible=1 ORDER BY OrderNumber",
            []
        );

        return iterator_to_array($parentConfigItems);
    }

    /**
     * Returns an array of configuration settings in a tree format.
     * The array contains all of the settings that are in config table
     * in the database. However, if the value if overridden in the config.xml,
     * the value for that setting is replaced with the value from the config.xml
     *
     * @return array of config settings
     */
    function _getConfigSettingTree()
    {
        $config = \NDB_Config::singleton();
        $DB     = $this->loris->getDatabaseConnection();

        $categories = iterator_to_array(
            $DB->pselect(
                "SELECT ID, Name, Description, Visible, 0 AS AllowMultiple,
                    NULL AS DataType, NULL AS Parent, Label, OrderNumber,
                    0 AS Multilingual
                 FROM ConfigCategories
                 WHERE Visible=1
                 ORDER BY OrderNumber",
                []
            )
        );

        $configs = iterator_to_array(
            $DB->pselect(
                "SELECT *
                 FROM ConfigSettings
                 WHERE Visible=1
                 ORDER BY CategoryID, Parent, OrderNumber, ID",
                []
            )
        );

        $childrenByParent   = [];
        $settingsByCategory = [];
        foreach ($configs as $setting) {
            $setting = $this->_formatConfigSetting($setting, $config, $DB);
            if ($setting['Parent'] !== null) {
                $childrenByParent[strval($setting['Parent'])][] = $setting;
                continue;
            }

            if ($setting['CategoryID'] !== null) {
                $settingsByCategory[intval($setting['CategoryID'])][] = $setting;
            }
        }

        foreach ($categories as &$category) {
            $category['Disabled'] = 'No';
            $category['Value']    = [];
            $category['Children'] = [];
            $categorySettings     = $settingsByCategory[intval($category['ID'])]
                ?? [];
            foreach ($categorySettings as $setting) {
                $setting['Children'] = $this->_buildConfigSettingTree(
                    $childrenByParent,
                    intval($setting['ID'])
                );
                $category['Children'][] = $setting;
            }
        }
        unset($category);

        return $categories;
    }

    /**
     * Add value and override metadata to a config setting row.
     *
     * @param array       $setting The config setting row
     * @param \NDB_Config $config  Runtime configuration object
     * @param \Database   $DB      Database handle
     *
     * @return array
     */
    private function _formatConfigSetting(
        array $setting,
        \NDB_Config $config,
        \Database $DB
    ) : array {
        $setting['Children'] = [];
        $setting['Value']    = [];

        if ($setting['DataType'] === null) {
            $setting['Disabled'] = 'No';
            return $setting;
        }

        try {
            $setting['Disabled'] = 'Yes';
            $valueFromXML        = $config->getSettingFromXML($setting['Name']);
            if (!is_array($valueFromXML)) {
                $setting['Value'][0] = $valueFromXML;
            } else {
                $setting['Value'] = $valueFromXML;
            }
            return $setting;
        } catch (\ConfigurationException $e) {
            $setting['Disabled'] = 'No';
        }

        $values = $DB->pselect(
            "SELECT ID, Value FROM Config WHERE ConfigID=:ID",
            ['ID' => $setting['ID']]
        );
        foreach ($values as $subvalue) {
            $setting['Value'][$subvalue['ID']] = $subvalue['Value'];
        }

        return $setting;
    }

    /**
     * Build a recursive config setting tree from settings grouped by parent.
     *
     * @param array $childrenByParent Config settings grouped by parent ID
     * @param int   $parentID         Parent ID to build from
     *
     * @return array
     */
    private function _buildConfigSettingTree(
        array $childrenByParent,
        int $parentID
    ) : array {
        $settings = [];
        foreach ($childrenByParent[strval($parentID)] ?? [] as $setting) {
            $setting['Children'] = $this->_buildConfigSettingTree(
                $childrenByParent,
                intval($setting['ID'])
            );
            $settings[] = $setting;
        }
        return $settings;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/configuration/js/configuration_helper.js",
            ]
        );
    }

     /**
      * Include additional CSS files:
      *  1. configuration
      *
      * @return array of CSS to be inserted
      */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/configuration/css/configuration.css"]
        );
    }
}
