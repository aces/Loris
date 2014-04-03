<?php
/**
 * File_Decompress class file
 * 
 * This class can be instantiated as follows:
 * $file_decompress = new File_Decompress ($file_name, $destination_path)
 * by passing the path to the file to be decompressed :$file_name
 * and the desintation folder where the file will be decompressed in
 * 
 * This class currently only accepts the following file types:
 * - .tar
 * - .gz
 * - .tgz or .tar.gz
 * - .zip
 * 
 * 
 * The function decompressFile() will automatically detect the file-type
 * and call the appropriate function (depending on the file-type) to 
 * decompress the file
 * 
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
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
     * @param String $destination_path Path of the destination folder
     * 
     * @return File_Decompress
     */

    function File_Decompress($file_name, $destination_path) 
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
        } elseif (preg_match("/.gz/", $this->file_name)) {
            return $this->gzipDecompress();
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
     * unzips the file by :
     * creating a Zip archive of the file, opening it, 
     * extracting it to the destination folder and
     * then closing the zip-archive handler
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
            return true;
        }
        return false;
    }
}
?>
