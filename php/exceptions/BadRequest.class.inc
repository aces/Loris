<?php declare(strict_types=1);
/**
 * This file contains the BadRequest exception type.
 *
 * PHP Version 7
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * The BadRequest exception is thrown when the server cannot or will not
 * process the request due to something that is perceived to be a client error
 * (e.g., malformed request syntax, invalid request message framing, or
 * deceptive request routing). It maps to a 400 error.
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class BadRequest extends LorisException
{
}

