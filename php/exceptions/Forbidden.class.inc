<?php declare(strict_types=1);
/**
 * This file contains the Forbidden exception type.
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
 * The Forbidden exception is thrown when the user making the request does
 * not have the necessary permissions for a resource or is attempting a
 * prohibited action. It maps to a 403 error.
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class Forbidden extends LorisException
{
}

