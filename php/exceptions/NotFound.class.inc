<?php
/**
 * This class is an Exception extension created to distinguish any
 * Exception from the case when a module can't be loaded because it is not a module
 * (instruments, forms, reliability forms,...)
 *
 * PHP Version 5
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * The LorisNoSuchModuleException class.
 *
 * @category Errors
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class NotFound extends LorisException
{
}
?>
