<?php
/**
 * This file verification image with random numbers for 
 * Request Account form
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Gnanasekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

session_start();
header('Content-type: image/jpeg');

$width  = 50;
$height = 24;

$my_image = imagecreatetruecolor($width, $height)
            or die('Cannot Initialize new GD image stream');
            
imagefill($my_image, 0, 0, 0xFFFFFF);

// add noise
for ($c = 0; $c < 40; $c++) {
    $x = rand(0, $width-1);
    $y = rand(0, $height-1);
    imagesetpixel($my_image, $x, $y, 0x000000);
}

$x = rand(1, 10);
$y = rand(1, 10);

$rand_string = $_REQUEST['num'];
imagestring($my_image, 5, $x, $y, $rand_string, 0x000000);
//setting session variable with the verification code
$_SESSION['tntcon'] = md5($rand_string).'a4xn';

imagejpeg($my_image);
imagedestroy($my_image);
?>
