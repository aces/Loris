<?php declare(strict_types=1);
/**
 * This file contains a class defining a well-formed (i.e. sufficiently complex)
 * password for LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
use ZxcvbnPhp\Zxcvbn;

/**
 * Represents a well-formed password for use in the LORIS software.
 * Automatically validates that a password is well-formed, i.e. has a sufficient
 * length as well as complexity.
 * Does not validate any state-related information such as whether a password
 * exists in the database, is expired, etc. This functionality is achieved by
 * the User class.
 *
 * @category Main
 * @package  Main
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Password
{
    /**
     * The minimum score needed to be considered a sufficiently complex password
     * as given by the Zxcvbn password strength estimator. Passwords are
     * evaluated by this package and scored on a scale of 0-5, with higher
     * scores representing stronger passwords.
     *
     * @var  int
     * @link https://github.com/bjeavons/zxcvbn-php
     */
    private const MIN_COMPLEXITY_SCORE = 3;

    /**
     * The minimum length of a valid password. This value does not need to be
     * too long if MIN_COMPLEXITY_SCORE is high enough.
     *
     * @var int
     */
    public const MIN_PASSWORD_LENGTH = 8;

    /**
     * The value of the password. This value must always remain private as it
     * represents the plaintext password.
     *
     * @var string
     */
    private $_value;

    /**
     * Ensures that the value submitted as a potential new password is
     * long enough.
     *
     * @param string $value The proposed password value.
     *
     * @return bool Whether the submitted value is valid.
     */
    protected function hasSufficientLength(string $value): bool
    {
        // Check length
        return strlen($value) >= self::MIN_PASSWORD_LENGTH;
    }

    /**
     * Ensures that the value submitted as a potential new password is
     * well-formed.
     *
     * @param string $value The proposed password value.
     *
     * @return bool Whether the submitted value is valid.
     */
    protected function hasSufficientComplexity(string $value): bool
    {
        // Return true if the password's complexity score exceeds
        // MIN_COMPLEXITY_SCORE and false otherwise.
        $result = (new Zxcvbn())->passwordStrength($value);
        return $result['score'] >= self::MIN_COMPLEXITY_SCORE;
    }

    /**
     * Creates a new Password object when the $value param is well-formed.
     * well-formed.
     *
     * @param string $value The proposed password value.
     *
     * @throws \DomainException When passsword is too short or too simple.
     */
    public function __construct(string $value)
    {
        // Check length and complexity separately in order to return a precise
        // error message upon failure.
        if (!$this->hasSufficientLength($value)) {
            throw new \DomainException('The password is too short');
        }
        if (!$this->hasSufficientComplexity($value)) {
            throw new \DomainException('The password is not complex enough.');
        }
        $this->_value = $value;
    }

    /**
     * Returns the $value variable as a string. This value has already been
     * hashed upon construction so the plaintext will not be revealed.
     *
     * @return string The password hash.
     */
    public function __toString(): string
    {
        return password_hash($this->_value, PASSWORD_DEFAULT);
    }
}
