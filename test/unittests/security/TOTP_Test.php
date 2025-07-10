<?php declare(strict_types=1);

/**
 * This file contains unit test for the CandID value object.
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Security;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\Security\OTP\TOTP;

/**
 * Unit test class for the CandID value object
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class TOTP_Test extends TestCase
{

    function testRFC6238Counters() : void
    {
	    $totp = new TOTP("abc", timestep: 30);
	    // Unix time => RFC6238 time based counter for HOTP
	    $validValues = [
		    59 => hexdec("0000000000000001"),
		    1111111109  => hexdec("00000000023523EC"),
		    1111111111 => hexdec("00000000023523ED"),
		    1234567890  => hexdec("000000000273EF07"),
		    2000000000  => hexdec("0000000003F940AA"),
		    20000000000 => hexdec("0000000027BC86AA"),
	    ];
	    foreach($validValues as $i => $counter) {
		    $this->assertEquals($totp->getTimeCounter(\DateTimeImmutable::createFromFormat("U", strval($i))), $counter);
	    }
    }

    public function testRFC6238Sha1Codes() : void {

	    $totp = new TOTP("12345678901234567890", timestep: 30, algorithm: 'sha1');
	    $validValues = [
		    59 => "94287082",
		    1111111109 => "07081804",
		    1111111111 => "14050471",
		    1234567890 => "89005924",
		    2000000000 => "69279037",
		    20000000000 => "65353130"
	    ];

	    foreach($validValues as $i => $code) {
		    $counter = $totp->getTimeCounter(\DateTimeImmutable::createFromFormat("U", strval($i)));
		    var_dump($counter);
		    $this->assertEquals($totp->getCode($counter, 8), $code);
	    }
    }

    public function testRFC6238Sha256Codes() : void {
	    // RFC6238's test values in Appendix B say the shared secret is
	    // 12345678901234567890, but the reference implementation in
	    // Appendix A uses different hash-size dependent shared keys. The
	    // test vectors only work when we use the secrets from the reference
	    // implementation.
	    $totp = new TOTP("12345678901234567890123456789012", timestep: 30, algorithm: 'sha256');
	    $validValues = [
		    59 => "46119246",
		    1111111109 => "68084774",
		    1111111111 => "67062674",
		    1234567890 => "91819424",
		    2000000000 => "90698825",
		    20000000000 => "77737706"
	    ];

	    foreach($validValues as $i => $code) {
		    $counter = $totp->getTimeCounter(\DateTimeImmutable::createFromFormat("U", strval($i)));
		    var_dump($counter);
		    $this->assertEquals($totp->getCode($counter, 8), $code);
	    }
    }

    public function testRFC6238Sha512Codes() : void {
	    // RFC6238's test values in Appendix B say the shared secret is
	    // 12345678901234567890, but the reference implementation in
	    // Appendix A uses different hash-size dependent shared keys. The
	    // test vectors only work when we use the secrets from the reference
	    // implementation.
	    $totp = new TOTP("12345678901234567890".
		    "12345678901234567890"
		    ."123456789012345678901234"
		    , timestep: 30, algorithm: 'sha512');
	    $validValues = [
		    59 => "90693936",
		    1111111109 => "25091201",
		    1111111111 => "99943326",
		    1234567890 => "93441116",
		    2000000000 => "38618901",
		    20000000000 => "47863826"
	    ];

	    foreach($validValues as $i => $code) {
		    $counter = $totp->getTimeCounter(\DateTimeImmutable::createFromFormat("U", strval($i)));
		    var_dump($counter);
		    $this->assertEquals($totp->getCode($counter, 8), $code);
	    }
    }
}
