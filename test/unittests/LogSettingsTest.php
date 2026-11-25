<?php declare(strict_types=1);

/**
 * Unit tests for LogSettings.
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use PHPUnit\Framework\TestCase;

/**
 * Unit tests for LogSettings.
 *
 * @category Tests
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LogSettingsTest extends TestCase
{
    /**
     * Missing log levels should keep troubleshooting logs enabled.
     *
     * @return void
     */
    public function testMissingLogLevelsUseDefaults(): void
    {
        $settings = new LogSettings([]);

        $this->assertSame('warning', $settings->getDatabaseLogLevel());
        $this->assertSame('warning', $settings->getRequestLogLevel());
        $this->assertSame('warning', $settings->getExceptionLogLevel());
        $this->assertSame('none', $settings->getProfilerLogLevel());
    }

    /**
     * Null and blank database values should use defaults.
     *
     * @return void
     */
    public function testNullAndBlankLogLevelsUseDefaults(): void
    {
        $settings = new LogSettings(
            [
                'database_log_level'  => null,
                'request_log_level'   => '',
                'exception_log_level' => null,
                'profiler_log_level'  => '',
            ]
        );

        $this->assertSame('warning', $settings->getDatabaseLogLevel());
        $this->assertSame('warning', $settings->getRequestLogLevel());
        $this->assertSame('warning', $settings->getExceptionLogLevel());
        $this->assertSame('none', $settings->getProfilerLogLevel());
    }

    /**
     * Explicit configuration values should be respected.
     *
     * @return void
     */
    public function testConfiguredLogLevelsAreRespected(): void
    {
        $settings = new LogSettings(
            [
                'database_log_level'  => 'error',
                'request_log_level'   => 'none',
                'exception_log_level' => 'debug',
                'profiler_log_level'  => 'info',
            ]
        );

        $this->assertSame('error', $settings->getDatabaseLogLevel());
        $this->assertSame('none', $settings->getRequestLogLevel());
        $this->assertSame('debug', $settings->getExceptionLogLevel());
        $this->assertSame('info', $settings->getProfilerLogLevel());
    }
}
