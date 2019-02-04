<?php
/**
 * This NDB_Config class is a stub that gets autoloaded by the LORIS installer.
 * At the time of installation, the config.xml isn't setup yet, so the real
 * NDB_Config class will fail if it gets autoloaded. Smarty tries to use
 * NDB_Config, and the installer uses smarty, so this is required to make things
 * not crash.
 *
 * PHP Version 5.4+
 *
 * @category Installer
 * @package  Installer
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Installer;

/**
 * This NDB_Config class is a stub that gets autoloaded by the LORIS installer.
 * At the time of installation, the config.xml isn't setup yet, so the real
 * NDB_Config class will fail if it gets autoloaded. Smarty tries to use
 * NDB_Config, and the installer uses smarty, so this is required to make things
 * not crash.
 *
 * PHP Version 5.4+
 *
 * @category Installer
 * @package  Installer
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Config
{
    /**
     * Returns a single NDB_Config object.
     *
     * @return NDB_Config
     */
    public static function singleton()
    {
        static $cfg = null;
        if (is_null($cfg)) {
            $cfg = new NDB_Config();
        }
        return $cfg;
    }


    /**
     * Get a setting used by the installer.
     *
     * @param string $setting The setting to retrieve. Must be "paths".
     *
     * @return mixed the setting value
     */
    public function getSetting($setting)
    {
        // the base path is used by smarty, so calculate it relative
        // to the current directory. Nothing else needs to be supported.
        if ($setting == "paths") {
            return [
                    "base" => __DIR__ . "/../../",
                   ];
        }
        return null;
    }
}

