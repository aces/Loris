<?php
/**
 * This class is an Exception extention created to distinguish any Exception
 * from the case when the API need to send HTTP status code 405. This is a 
 * special case because the server need to send a Allow header also.
 * the allowed method list should be contained in the message of the nested
 * previous excpetion as a comma separated list. This file contain that previous
 * nested excpetion.
 *
 * PHP Version 7
 *
 * @category Errors
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\RestAPI;
/**
 * The RestApiExceptionAllow class.
 *
 * @category Errors
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class RestApiExceptionAllow extends \LorisException
{
}
?>
