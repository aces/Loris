<?php
/**
 * This is used by the Schedule Module to edit an already existing appointment
 *
 * PHP Version 7
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

/**
 * This function will the boolean value whether is valid date or not
 *
 * @param string $date   The data
 * @param string $format The date format
 *
 * @return bool boolean value whether is valid date or not
 */
function isDateValid($date, $format = 'Y-m-d H:i:s')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

