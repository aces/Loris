<?php declare(strict_types=1);

namespace LORIS\Security\OTP;

/* TOTP implements RFC 6238 */
class TOTP extends HOTP
{

    /**
     * Construct a TOTP authenticator
     *
     * @param string $secret The secret shared key for the authenticator
     * @param string $algorithm The HMAC algorithm to use for TOTP
     * @param int $timestep The counter timestep to use
     */
    public function __construct(
        protected string $secret,
        protected string $algorithm = 'sha1',
        protected int $timestep = 30
    ) {
    }

    /**
     * Convert a PHP DateTime to a TOTP iteration counter.
     *
     * @param ?\DateTimeImmutable $time The time to convert
     *
     * @return int
     */
    public function getTimeCounter(?\DateTimeImmutable $time = null) : int
    {
        if ($time === null) {
            $time = new \DateTimeImmutable();
        }
        $ut    = $time->getTimestamp();
        $count = (int )floor($ut / $this->timestep);
        return $count;
    }
}
