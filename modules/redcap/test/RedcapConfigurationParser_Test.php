<?php declare(strict_types=1);

/**
 * This contains tests relevant to the REDCap module - configuration parser section
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Tests
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\redcap\Test;

require_once __DIR__ . "/../../../tools/generic_includes.php";

use LORIS\redcap\config\RedcapConfigParser;
use \PHPUnit\Framework\TestCase;

/**
 * PHPUnit class for REDCap Configuration tests
 *
 * @category REDCap
 * @package  Tests
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfigurationParser_Test extends TestCase
{
    private static ?\LORIS\LorisInstance $_loris;

    private static string $_RBConfigFile
        = __DIR__ . "/../../../raisinbread/config/config.xml";

    /**
     * Provide an autoloader for the redcap module namespace.
     *
     * @return void
     */
    public static function setUpBeforeClass(): void
    {
        // force reset the configInstance for this test.
        \NDB_Config::$configInstance = null;
        // default RB config file
        self::$_loris = new \LORIS\LorisInstance(
            \NDB_Factory::singleton()->database(),
            \NDB_Config::singleton(self::$_RBConfigFile),
            [
                __DIR__ . "/../../../project/modules",
                __DIR__ . "/../../../modules/",
            ],
        );

        // load redcap module to use the client
        self::$_loris->getModule('redcap')->registerAutoloader();
    }

    /**
     * Set up.
     *
     * @return void
     */
    public function setUp(): void
    {
        // force reset the configInstance for this test.
        \NDB_Config::$configInstance = null;
        // default RB config file
        self::$_loris = new \LORIS\LorisInstance(
            \NDB_Factory::singleton()->database(),
            \NDB_Config::singleton(self::$_RBConfigFile),
            [
                __DIR__ . "/../../../project/modules",
                __DIR__ . "/../../../modules/",
            ],
        );
    }

    /**
     * Tear down
     *
     * @return void
     */
    public function tearDown(): void
    {
        self::$_loris = null;
    }

    /**
     * Change the config file.
     *
     * @param string $configFile the config file to use.
     *
     * @throws \Error
     *
     * @return \LORIS\LorisInstance a new loris instance with the given config file.
     */
    public static function setConfigFile(string $configFile): \LORIS\LorisInstance
    {
        if (empty($configFile)) {
            throw new \Error("[redcap][test] New config file cannot be empty.");
        }
        // force reset the configInstance for this test.
        \NDB_Config::$configInstance = null;

        // default RB config file
        return new \LORIS\LorisInstance(
            \NDB_Factory::singleton()->database(),
            \NDB_Config::singleton($configFile),
            [
                __DIR__ . "/../../../project/modules",
                __DIR__ . "/../../../modules/",
            ],
        );
    }

    // --------------------------------------------------

    /**
     * TestNoDefaultREDCapInstance
     *
     * @return void
     */
    public function testNoDefaultREDCapInstance(): void
    {
        // default file does not have any accessible REDCap
        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            "[redcap][config] none of the REDCap configurations declared"
            . " in 'config.xml' file can be accessed."
        );
        new RedcapConfigParser(self::$_loris, 'https://someURL.com', '111');
    }

    /**
     * TestNoREDCapTagConfigFile
     *
     * @return void
     */
    public function testNoREDCapTagConfigFile(): void
    {
        // TODO: this is not expected and should be changed in the NDB_Config file.
        $this->expectException(\TypeError::class);
        $this->expectExceptionMessage("Unsupported operand types: array + string");
        $configFile    = __DIR__ . "/config/configNoREDCap.xml";
        $lorisInstance = self::setConfigFile($configFile);
        //
        new RedcapConfigParser($lorisInstance, 'https://someURL.com', '111');
    }

    /**
     * TestNoAssigneeConfigFile
     *
     * @return void
     */
    public function testNoAssigneeConfigFile(): void
    {
        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            "[redcap][config] no REDCap issue assignee in configuration."
        );
        $configFile    = __DIR__ . "/config/configNoAssignee.xml";
        $lorisInstance = self::setConfigFile($configFile);
        //
        new RedcapConfigParser($lorisInstance, 'https://someURL.com', '111');
    }

    /**
     * TestNoInstanceConfigFile
     *
     * @return void
     */
    public function testNoInstanceConfigFile(): void
    {
        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            "[redcap][init] no REDCap instance in configuration."
        );
        $configFile    = __DIR__ . "/config/configNoInstance.xml";
        $lorisInstance = self::setConfigFile($configFile);
        //
        new RedcapConfigParser($lorisInstance, 'https://someURL.com', '111');
    }

    /**
     * TestNoProjectConfigFile
     *
     * @return void
     */
    public function testNoProjectConfigFile(): void
    {
        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            "[redcap][init] wrong REDCap configuration: no projects for"
            . " instance 'aaa'."
        );
        $configFile    = __DIR__ . "/config/configNoProject.xml";
        $lorisInstance = self::setConfigFile($configFile);
        //
        new RedcapConfigParser($lorisInstance, 'https://someURL.com', '111');
    }
}
