<?php declare(strict_types=1);

namespace Loris\Tests;

set_include_path(get_include_path() . ":" . __DIR__ . "/../../php/libraries");

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../modules/instruments/php/dictionaryitem.class.inc';
require_once __DIR__ . '/../../php/libraries/NDB_BVL_Instrument_LINST.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Config.class.inc';

use PHPUnit\Framework\TestCase;

class QueryStub extends \LORIS\Database\Query
{
    private array $rows = [];

    public function __construct(array $rows = [])
    {
        $this->rows = $rows;
    }

    public function getAll(): array
    {
        return $this->rows;
    }

    public function getFirstRow(): array
    {
        return $this->rows[0] ?? [];
    }
}

class SessionStub
{
    public function getProperty($name)
    {
        return null;
    }

    public function setProperty($name, $value)
    {
    }

    public function getUsername()
    {
        return "tester";
    }

    public function isLoggedIn()
    {
        return true;
    }
}

class NDB_BVL_Instrument_LINST_ToJSON_Test extends TestCase
{
    protected \Loris\Behavioural\NDB_BVL_Instrument_LINST $i;
    protected \NDB_Client $Client;

    protected function setUp(): void
    {
        global $_SESSION;

        if (!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }

        date_default_timezone_set("UTC");

        $session = new SessionStub();

        $_SESSION = ['State' => $session];

        // -----------------------------
        // Mock factory with DB and Config
        // -----------------------------
        $factory = \NDB_Factory::singleton();

        $mockdb = $this->createMock(\Database::class);
        $mockconfig = $this->createMock(\NDB_Config::class);

        // pselect returns QueryStub instead of raw array
        $mockdb->method('pselect')->willReturn(new QueryStub([]));
        $mockdb->method('pselectOne')->willReturn('999');

        $factory->setDatabase($mockdb);
        $factory->setConfig($mockconfig);

        // -----------------------------
        // Client
        // -----------------------------
        $this->Client = new \NDB_Client();
        $this->Client->makeCommandLine();

        // -----------------------------
        // Instrument stub
        // -----------------------------
        $i = $this->getMockBuilder('\Loris\Behavioural\NDB_BVL_Instrument_LINST')
            ->disableOriginalConstructor()
            ->onlyMethods(['getFullName', 'getSessionID'])
            ->getMock();

        $i->method('getFullName')->willReturn("Test Instrument");
        $i->method('getSessionID')->willReturn(new \SessionID("123456"));

        $i->form = new \LorisForm();
        $i->testName = "Test";

        $this->i = $i;
    }

    // -----------------------------
    // Example test: metadata
    // -----------------------------
    public function testMetaData(): void
    {
        $instrument = "table{@}Test\ntitle{@}Test Instrument";
        $base64 = "data://text/plain;base64," . base64_encode($instrument);

        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
            // ignore
        }

        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);

        $ExpectedMeta = [
            'InstrumentVersion'       => "1l",
            'InstrumentFormatVersion' => "v0.0.1a-dev",
            "ShortName"               => "Test",
            "LongName"                => "Test Instrument",
            "IncludeMetaDataFields"   => "true",
        ];

        $this->assertEquals($ExpectedMeta, $outArray['Meta']);
    }

    // -----------------------------
    // Test all elements
    // -----------------------------
    public function testAllElements(): void
    {
        $instrument = "table{@}Test\n";
        $instrument .= "title{@}Test Instrument\n";
        $base64 = "data://text/plain;base64," . base64_encode($instrument);

        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
        }

        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);

        $this->assertArrayHasKey('Meta', $outArray);
        $this->assertArrayHasKey('Elements', $outArray);
    }

    // -----------------------------
    // Test page element
    // -----------------------------
    public function testPageElement(): void
    {
        $instrument = "table{@}Test\ntitle{@}Test Instrument\nheader{@}{@}Page 1";
        $base64 = "data://text/plain;base64," . base64_encode($instrument);

        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
        }

        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);

        $this->assertArrayHasKey('Meta', $outArray);
        $this->assertArrayHasKey('Elements', $outArray);
    }
}

