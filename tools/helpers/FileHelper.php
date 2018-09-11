<?php
/**
 * PHP class implementing file handling functions. This class should be used to
 * standardize our tools when possible.
 *
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class FileHelper {

    /**
     * Helper function that writes a string supplied in the parameters to a filepath
     * specified in the parameters using the indicated mode. This function should be
     * used as a standard in the tools PHP scripts.
     *
     * @param string $filePath Desired path for the generated file (including extension)
     * @param string $output   String to be written to the file specified in $filePath
     * @param string $mode     Creation mode of the file
     */
    public static function writeToFile(string $filePath, string $output, string $mode = "w")
    {
        $fp = fopen($filePath, $mode);
        fwrite($fp, $output);
        fclose($fp);
    }

}