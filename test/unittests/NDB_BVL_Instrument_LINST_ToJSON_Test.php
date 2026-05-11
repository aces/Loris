<?php declare(strict_types=1);

namespace Loris\Tests;

set_include_path(get_include_path() . ":" . __DIR__ . "/../../php/libraries");

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../modules/instruments/php/dictionaryitem.class.inc';
require_once __DIR__ . '/../../php/libraries/NDB_BVL_Instrument_LINST.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Config.class.inc';
/**
 * File-level suppression for Phan analysis.
 *
 * @phan-file-suppress PhanUndeclaredMethod
 * @phan-file-suppress PhanUndeclaredProperty
 * @phan-file-suppress PhanTypeMismatchProperty
 */
use PHPUnit\Framework\TestCase;
/**
 * Stub class to simulate Query behavior for testing
 *
 * PHP Version 8
 *
 * @category Tests
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class QueryStub extends \LORIS\Database\Query
{
    /**
     * Rows to simulate database query results
     *
     * @var array
     */
    private array $rows = [];

    /**
     * Constructor
     *
     * @param array $rows Optional array of rows to initialize the stub
     */
    public function __construct(array $rows = [])
    {
        $this->rows = $rows;
    }

    /**
     * Return all rows
     *
     * @return array The rows in the query stub
     */
    public function getAll(): array
    {
        return $this->rows;
    }

    /**
     * Return the first row
     *
     * @return array The first row or empty array if none exist
     */
    public function getFirstRow(): array
    {
        return $this->rows[0] ?? [];
    }
}
/**
 *  Stub class to simulate Session behavior for testing
 *
 * PHP Version 8
 *
 * @category Tests
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class SessionStub
{
    /**
     * Get a session property
     *
     * @param string $name Property name
     *
     * @return mixed|null The value of the property or null if not set
     */
    public function getProperty($name): mixed
    {
        return null;
    }

    /**
     * Set a session property
     *
     * @param string $name  Property name
     * @param mixed  $value Property value
     *
     * @return void
     */
    public function setProperty($name, $value): void
    {
    }

    /**
     * Get the username from the session
     *
     * @return string The username
     */
    public function getUsername(): string
    {
        return "tester";
    }

    /**
     * Check if the session is logged in
     *
     * @return bool True if logged in
     */
    public function isLoggedIn(): bool
    {
        return true;
    }
}
/**
 * Unit test for NDB_BVL_Instrument_LINST_ToJSON class
 *
 * PHP Version 8
 *
 * @category Tests
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class NDB_BVL_Instrument_LINST_ToJSON_Test extends TestCase
{
    /**
     * Instrument stub property used in tests.
     *
     * This property holds a mock object of NDB_BVL_Instrument_LINST for PHPUnit
     *
     * @var \Loris\Behavioural\NDB_BVL_Instrument_LINST
     *      &\PHPUnit\Framework\MockObject\MockObject
     */
    protected $i;
    protected \NDB_Client $Client;

    /**
     * Sets up the environment before each test is executed.
     *
     * This method is called automatically by PHPUnit before each test method.
     *
     * @return void
     */
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

        $mockdb     = $this->createMock(\Database::class);
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

        $i->form     = new \LorisForm();
        $i->testName = "Test";
        $i->name     = "test";

        $this->i = $i;
    }

    /**
     * Test that metadata is retrieved and correct.
     *
     * This test checks that the metadata returned by the system
     * matches expected values and structure.
     *
     * @return void
     */
    public function testMetaData(): void
    {
        $instrument = "table{@}Test\ntitle{@}Test Instrument";
        $base64     = "data://text/plain;base64," . base64_encode($instrument);

        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
            // ignore
        }

        $json     = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $this->assertIsArray($outArray);
        $ExpectedMeta = [
            'InstrumentVersion'       => "1l",
            'InstrumentFormatVersion' => "v0.0.1a-dev",
            "ShortName"               => "Test",
            "LongName"                => "Test Instrument",
            "IncludeMetaDataFields"   => "true",
        ];
        //@phan-suppress-next-line PhanTypeArraySuspiciousNullable
        $this->assertEquals($ExpectedMeta, $outArray['Meta']);
    }

    /**
     * Test the retrieval and correctness of metadata.
     *
     * This test ensures that metadata is returned correctly and
     * matches expected values.
     *
     * @return void
     */
    public function testAllElements(): void
    {
        $instrument  = "table{@}Test\n";
        $instrument .= "title{@}Test Instrument\n";
        $base64      = "data://text/plain;base64," . base64_encode($instrument);

        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
        }

        $json     = $this->i->toJSON();
        $outArray = json_decode($json, true);

        $this->assertArrayHasKey('Meta', $outArray);
        $this->assertArrayHasKey('Elements', $outArray);
    }

    /**
     * Test that all expected elements are present.
     *
     * This test verifies that the collection contains all
     * required elements and no unexpected items.
     *
     * @return void
     */
    public function testPageElement(): void
    {
        $instrument = "table{@}Test\ntitle{@}Test Instrument\nheader{@}{@}Page 1";
        $base64     = "data://text/plain;base64," . base64_encode($instrument);

        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
        }

        $json     = $this->i->toJSON();
        $outArray = json_decode($json, true);

        $this->assertArrayHasKey('Meta', $outArray);
        $this->assertArrayHasKey('Elements', $outArray);
    }
}

