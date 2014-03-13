#!/usr/bin/php
<?php
/**
 * File_Decompress class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
*/

require_once 'PEAR.php';

/**
 * File_Decompress Class
 *
 * The class contains the function to decompress the file depending on the type
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
*/
class File_Decompress extends PEAR
{
    var $path;
    var $file_name;


    /**
     * Constructor
     *
     * @param String $path Path of the destinationation folder
     * @param String $file_name File to be decompressed
     * @return File_Decompress
     */

    function File_Decompress($path,$file_name) {
        $this->path = $path;
        $this->file_name = $file_name;
    }

    
  /**
    * decompress_file
    * decompresses the file for the given extension by
    * calling the specific functions
    *
  */

    function decompress_file()
    {

        //if it's of type .tgz
        if ((preg_match("/.tgz/i",$file_name)) ||
        (preg_match("/.tar.gz/i",$file_name)))
        {
            $this->tgz_decompress();
        }

        elseif (preg_match("/.tar/",$file_name))
        {
            $this->untar();
        }
        elseif (preg_match("/.zip/",$file_name)){
            $this->unzip();
        }

    }

    /**
     * tgz_decompress
     *
     * decompress and untars the .tgz and tar.gz files
     * @return boolean
     */
    function tgz_decompress() {

        try {
            $p = new PharData($this->file_name);
            $p->decompress(); // creates /path/to/my.tar
            $p->extractTo($this->path);
            //could remove the folder later once completed...
        } catch (Exception $e) {
            print $e->getMessage();
            // handle errors
            return false;
        }

        return true;
    }
    
    /**
     * untar 
     * untar the file into the destination folder
     *
     * @return boolean
     */
    function untar() {

        try {
            $p = new PharData($this->file_name);
            $p->extractTo($this->path);
            //could remove the folder later once completed...
        } catch (Exception $e) {
            print $e->getMessage();
            return false;
        }

        return true;

    }


    /**
     * unzip
     *
     * @return booean
     */

    function unzip() {
        $zip = new ZipArchive;
        $res = $zip->open($this->file_name);
        if ($res === TRUE) {
            $zip->extractTo($this->path);
            $zip->close();
            print "file is unzipped";
            return true;
        }
        return false;
    }
}
?>