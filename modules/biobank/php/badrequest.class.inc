<?php declare(strict_types=1);

/**
 * This file contains the BadRequest exception type.
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\biobank;

/**
 * The BadRequest exception is thrown when a resource has invalid data.
 *
 * TODO: this should eventually be replaced with a error message accumulator and
 * return a BadRequest response without throwing an exception.
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class BadRequest extends \LorisException
{
}
