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
    var $dest_path;
    var $file_name;


    /**
     * Constructor
     *
     * @param String $file_name        File to be decompressed
     * @param String $destination_path Path of the destinationation folder
     * 
     * @return File_Decompress
     */

    function File_Decompress($file_name,$destination_path) 
    {
        $this->file_name = $file_name;
        $this->dest_path = $destination_path;
    }

    /**
     * decompress_file
     * decompresses the file for the given extension by 
     * calling the specific functions
     *
     * @return unknown
     */
    function decompressFile()
    {

        //if it's of type .tgz
        
        if ((preg_match("/.tgz/i", $this->file_name)) 
            || (preg_match("/.tar.gz/i", $this->file_name))
        ) {
            return $this->tgzDecompres();
        } elseif (preg_match("/.tar/", $this->file_name)) {
            return $this->untar();
        } elseif (preg_match("/.zip/", $this->file_name)) {
            return $this->unzip();
        }
        return false;
    }

    /**
     * tgzDecompres
     *
     * decompress and untars the .tgz and tar.gz files
     * 
     * @return boolean
     */
    function tgzDecompres() 
    {
        $decompressed_folder = null;
        try {
            $p = new PharData($this->file_name);
            $decompressed_folder = $p->decompress(); // creates /path/to/my.tar
            $is_extracted = $p->extractTo($this->dest_path);
            //could remove the folder later once completed...
        } catch (Exception $e) {
            print $e->getMessage();
            print "error";
            // handle errors
        }
        return $decompressed_folder;
    }
    
    /**
     * Decompress the gzipped file
     *
     * @return Boolean
     */
    function gzipDecompress() 
    {
        try {
            $p = new PharData($this->file_name);
            $r = $p->decompress(); // creates /path/to/my.tar
            return $r;
        } catch (Exception $e) {
            // handle errors
            print $e->getMessage();
            return false;
        }

        return false;
    }
    
    /**
     * untar 
     * untar the file into the destination folder
     *
     * @return boolean
     */
    function untar() 
    {

        try {
            $p = new PharData($this->file_name);
            $p->extractTo($this->dest_path);
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

    function unzip() 
    {
        $zip = new ZipArchive;
        $res = $zip->open($this->file_name);
        if ($res === true) {
            $zip->extractTo($this->dest_path);
            $zip->close();
            print "file is unzipped";
            return true;
        }
        return false;
    }
}
?>
