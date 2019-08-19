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
use \LORIS\Http\Client;
use \LORIS\Http\Request;

use ZxcvbnPhp\Zxcvbn;

/**
 * Represents a well-formed password for use in the LORIS software.
 * Automatically _validates that a password is well-formed, i.e. has a sufficient
 * length as well as complexity.
 * Does not _validate any state-related information such as whether a password
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
    private const MIN_PASSWORD_LENGTH = 8;

    /**
     * The result of running the $value through the password_hash algorithm.
     *
     * @var string
     */
    private $_hash;

    /**
     * Ensures that the value submitted as a potential new password is
     * long enough.
     *
     * @param string $value The proposed password value.
     *
     * @return bool Whether the submitted value has length of at least
     *              MIN_PASSWORD_LENGTH;
     */
    private function _hasSufficientLength(string $value): bool
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
     * @return bool Whether the submitted value meets the minimum score defined
     *              above and given by Zxcvbn.
     */
    private function _hasSufficientComplexity(string $value): bool
    {
        // Return true if the password's complexity score exceeds
        // MIN_COMPLEXITY_SCORE and false otherwise.
        $result = (new Zxcvbn())->passwordStrength($value);
        return $result['score'] >= self::MIN_COMPLEXITY_SCORE;
    }

    /**
     * Validates the $value param by examining its length and complexity.
     *
     * @param string $value The proposed password plaintext.
     *
     * @return void
     *
     * @throws \InvalidArgumentException When password is too short or weak.
     */
    private function _validate($value): void
    {
        // Check length and complexity separately in order to return a precise
        // error message upon failure.
        if (!$this->_hasSufficientLength($value)) {
            throw new \InvalidArgumentException('The password is too short');
        }
        if (!$this->_hasSufficientComplexity($value)) {
            throw new \InvalidArgumentException(
                'The password is not complex enough.'
            );
        }
        if ($this->pwned($value)) {
            throw new \InvalidArgumentException(
                'This password is known to be exposed in online data breaches.'
            );
        }
    }

    /**
     * Returns the minimum length required for a valid password.
     *
     * @return int The value of MIN_PASSWORD_LENGTH.
     */
    public static function getMinimumPasswordLength(): int
    {
        return self::MIN_PASSWORD_LENGTH;
    }

    /**
     * Use the Pwned Passwords API to determine whether a user is trying
     * to use a password that has been revealed in public data breaches.
     *
     * @param string $password The password to check for pwnage.
     *
     * @return bool Whether the password is known to be pwned.
     */
    private function pwned(string $password): bool
    {

        // If the project is configured to disable the Pwned Password check,
        // always return false (meanning that the password has not been pwned).
        if ('true' !== \NDB_Factory::singleton()->config()->getSetting(
            'usePwnedPasswordsAPI'
        )
        ) {
            return false;
        }

        /* The pwned passwords API searches a range of password hashes to
         * protect the actual SHA1 hash from being revealed.
         * More here: <https://haveibeenpwned.com/API/v2#PwnedPasswords>
         *
         * NOTE The webserver will need to be configured to allow outgoing
         * connections to the link below. If errors are encountered when this
         * setting is enabled, verify local firewall settings.
         */
        $hash       = sha1($password);
        $hashPrefix = substr(sha1($password), 0, 5);
        // $url        = "https://api.pwnedpasswords.com/range/$hashPrefix";

        $client   = new Client('https://api.pwnedpasswords.com');
        $response = $client->sendRequest(
            new Request('GET', "/range/$hashPrefix")
        );

        /* We don't want password changes to fail in case there is a
         * networking issue while making the request. If the API can't be
         * reached for any reason, we will skip the pwned password check.
         */
        if (!$response->getStatusCode() === 200) {
            return false;
        }
        $hashSuffixes = explode("\n", $response->getBody()->getContents());
        /* The response will be one long string consisting of suffixes matching
         * our hash prefix, followed by a colon and the number of times the
         * password has occurred in data breaches.
         * Here we iterate over all of the suffixes and check whether the prefix
         * and the whole suffix line together contain $hash as a substring at
         * the beginning of the line.
         * Check the API documentation linked above if you want more info.
         */
        foreach ($hashSuffixes as $suffix) {
            $line = strtolower($hashPrefix . $suffix);
            if ($hash == substr($line, 0, strlen($hash))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Creates a new Password object when the $value param is well-formed.
     * well-formed.
     *
     * @param string $value The proposed password value.
     *
     * @throws InvalidArgumentException When passsword is too short or too simple.
     */
    public final function __construct(string $value)
    {
        // Ensure proposed value is well-formed.
        $this->_validate($value);
        // Don't store the value in the object; instead use the hashed version
        // This mitigates the risk of accidentally revealing the plaintext.
        $this->_hash = password_hash($value, PASSWORD_DEFAULT);
    }

    /**
     * The hashed value of the original input.
     *
     * @return string The password hash.
     */
    public function __toString(): string
    {
        return $this->_hash;
    }
}
