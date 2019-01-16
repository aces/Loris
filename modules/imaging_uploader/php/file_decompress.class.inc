<?php
/**
 * File_Decompress class file
 *
 * This class is used to detect the file using the extension and decompress
 * the file accordingly
 *
 * It can be instantiated as follows:
 * $file_decompress = new File_Decompress ($file_name, $destination_path)
 * by passing the path to the file to be decompressed ($file_name)
 * and the desintation folder where the file will be decompressed in
 * ($destination_path)
 *
 * This class currently only accepts the following file types:
 * - .tar
 * - .gz
 * - .tgz or .tar.gz
 * - .zip
 *
 *
 * PHP version >= 5.3
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
namespace LORIS\imaging_uploader;

/**
 * File_Decompress Class
 *
 * The class contains the function to decompress the file depending on the type
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class File_Decompress
{
    var $dest_path;
    var $file_name;

    /**
     * Constructor
     *
     * @param String $file_name        File to be decompressed
     * @param String $destination_path Path of the destination folder
     */
    function __construct(&$file_name, &$destination_path)
    {
        $this->file_name = $file_name;
        $this->dest_path = $destination_path;
    }

    /**
     *  This function will automatically detect the file-type
     * and will decompress the file by calling the appropriate function
     *
     * @return boolean returns false if the decompressiong fails
     *  and true otherwise
     */
    function decompressFile()
    {

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
     * The tgzDecompres
     *
     * Decompress and untars .tgz and tar.gz files
     *
     * @return String Returns the name of the decompressed folder
     */
    function tgzDecompres()
    {
        $decompressed_folder = null;
        $p = new PharData($this->file_name);
        $decompressed_folder = $p->decompress(); // creates /path/to/my.tar
        $is_extracted        = $p->extractTo(
            $this->dest_path,
            null,
            true
        );
        return $decompressed_folder;
    }

    /**
     * Decompress a gzipped file
     *
     * @return Boolean returns false if the decompression fails
     *  And true otherwise
     */
    function gzipDecompress()
    {
        $return_value = false;
        $decomp_file  = new PharData($this->file_name);
        // creates /path/to/my.tar
        $return_value = $decomp_file->decompress();
        return $return_value;
    }

    /**
     * The untar function
     * untar a file into the destination folder
     *
     * @return boolean
     */
    function untar()
    {
        $return_value = false;
        $p            = new PharData($this->file_name);
        $return_value = $p->extractTo($this->dest_path);
           //could remove the folder later once completed...
        return $return_value;
    }


    /**
     * Unzips a file by :
     * creating a Zip archive of the file, opening it,
     * extracting it to the destination folder and
     * then closing the zip-archive handler
     *
     * @return int
     */
    function unzip()
    {
        $result = false;
        $zip    = new ZipArchive;
        $result = $zip->open($this->file_name);
        if ($result === true) {
            $zip->extractTo($this->dest_path);
            $file_name = $zip->getNameIndex(0);
            $zip->close();
        }

        return $file_name;
    }
}

