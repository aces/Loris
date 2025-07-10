<?php declare(strict_types=1);
namespace LORIS\Security\OTP;

/* TOTP implements RFC 6238 */
class TOTP extends HOTP {

	public function __construct(protected string $secret, protected string $algorithm = 'sha1', protected int $timestep = 30) {
	}

	public function getTimeCounter(?\DateTimeImmutable $time = null) : int {
		if($time === null) {
			$time = new \DateTimeImmutable();
		}
		$ut = $time->getTimestamp();
		$count = (int )floor($ut / $this->timestep);
		return $count;
	}
}
