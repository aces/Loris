<?php declare(strict_types=1);

namespace LORIS\Security\OTP;

/* HOTP implements RFC 4226 */
class HOTP
{
    public function __construct(protected string $secret, protected string $algorithm = 'sha1')
    {
    }

    public static function getPaddedCounter(int $i) : string
    {
        $hex = dechex($i);
        $val = str_pad($hex, 16, "0", STR_PAD_LEFT);
        return hex2bin($val);
    }
    public function getHash(int $counter) : string
    {
        $counter = self::getPaddedCounter($counter);

        return hash_hmac($this->algorithm, $counter, $this->secret);
    }

    public function getTruncatedDecimal(int $counter) : int
    {
        $hash = $this->getHash($counter);
        // sha1 is 20 bytes (40 chars as hex) but other algorithms
        // can be longer for TOTP.
        $hashlen = strlen($hash);
        assert($hashlen >= 40);
        // RFC4226 is ambiguous about whether it should be the last
        // nibble of the hash or the last nibble of byte 20 because
        // it only deals with SHA1 (20 bytes long). RFC6238's tests
        // that use SHA256 and SHA512 only work with the last nibble
        // of the hash, hash-size dependent, so we use that interpretation.
        $offset = hexdec($hash[$hashlen-1]);

        // Convert from a byte offset to an offset into the string by
        // multiplying by 2, and then take next 4 bytes (or 8 characters
        // when encoded as a hex string)
        $truncated = substr($hash, $offset*2, 8);

        $decimal = hexdec($truncated);

        // Clear the top bit as per RFC4226
        $nosign = $decimal & ~(1<<31);

        return $nosign;
    }

    public function getCode(int $counter, int $len) : string
    {
        $dec = $this->getTruncatedDecimal($counter);
        return str_pad(strval($dec % pow(10, $len)), $len, "0", STR_PAD_LEFT);
    }
}
