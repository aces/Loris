<?php declare(strict_types=1);

namespace LORIS\Security;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\Security\OTP\HOTP;

/**
 * Group of tests for HMAC-based One Time Passwords (HOTP)
 * primarily based on RFC4226 test vectors.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class HOTP_Test extends TestCase
{
    /**
     * Test HOTP counter test vectors from RFC4226
     *
     * @return void
     */
    function testGetCounter() : void
    {
        $validValues = [
        // Values used by the RFC4226 tests
            0   => hex2bin('0000000000000000'),
            1   => hex2bin('0000000000000001'),
            2   => hex2bin('0000000000000002'),
            3   => hex2bin('0000000000000003'),
            4   => hex2bin('0000000000000004'),
            5   => hex2bin('0000000000000005'),
            6   => hex2bin('0000000000000006'),
            7   => hex2bin('0000000000000007'),
            8   => hex2bin('0000000000000008'),
            9   => hex2bin('0000000000000009'),

        // not used by RFC4226, but test non-decimal
            10  => hex2bin('000000000000000a'),
        // test padding > 1 byte should be
        // big endian
            256 => hex2bin('0000000000000100')
        ];
        foreach ($validValues as $i => $padded) {
            $this->assertEquals(HOTP::getPaddedCounter($i), $padded);
        }
    }

    /**
     * Test HOTP hash test vectors from RFC4226
     *
     * @return void
     */
    function testRFC4226GetHash() : void
    {
        // Secret and algorithm for RFC4226 test suite
        $hotp        = new HOTP("12345678901234567890", "sha1");
        $validValues = [
            0 => "cc93cf18508d94934c64b65d8ba7667fb7cde4b0",
            1 => "75a48a19d4cbe100644e8ac1397eea747a2d33ab",
            2 => "0bacb7fa082fef30782211938bc1c5e70416ff44",
            3 => "66c28227d03a2d5529262ff016a1e6ef76557ece",
            4 => "a904c900a64b35909874b33e61c5938a8e15ed1c",
            5 => "a37e783d7b7233c083d4f62926c7a25f238d0316",
            6 => "bc9cd28561042c83f219324d3c607256c03272ae",
            7 => "a4fb960c0bc06e1eabb804e5b397cdc4b45596fa",
            8 => "1b3c89f65e6c9e883012052823443f048b4332db",
            9 => "1637409809a679dc698207310c8c7fc07290d9e5"
        ];
        foreach ($validValues as $i => $hashstr) {
            $this->assertEquals($hotp->getHash($i), $hashstr);
        }

    }

    /**
     * Test HOTP decimal truncation test vector from RFC4226
     *
     * @return void
     */
    function testRFC4226Truncation() : void
    {
        // Secret and algorithm for RFC4226 test suite
        $hotp        = new HOTP("12345678901234567890", "sha1");
        $validValues = [
            0 => 1284755224,
            1 => 1094287082,
            2 => 137359152,
            3 => 1726969429,
            4 => 1640338314,
            5 => 868254676,
            6 => 1918287922,
            7 => 82162583,
            8 => 673399871,
            9 => 645520489
        ];
        foreach ($validValues as $i => $decval) {
            $this->assertEquals($hotp->getTruncatedDecimal($i), $decval);
        }

    }

    /**
     * Test HOTP test vector from RFC4226
     *
     * @return void
     */
    function testRFC4226Code() : void
    {
        // Secret and algorithm for RFC4226 test suite
        $hotp        = new HOTP("12345678901234567890", "sha1");
        $validValues = [
            0 => "755224",
            1 => "287082",
            2 => "359152",
            3 => "969429",
            4 => "338314",
            5 => "254676",
            6 => "287922",
            7 => "162583",
            8 => "399871",
            9 => "520489"
        ];
        foreach ($validValues as $i => $code) {
            $this->assertEquals($hotp->getCode($i, 6), $code);
        }

    }
}
