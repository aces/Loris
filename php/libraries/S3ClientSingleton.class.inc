<?php
/**
 * This file contains the S3ClientSingleton
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * S3ClientSingleton will create a defaul S3Client for user to use
 *
 * @category Main
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use Aws\S3\S3Client;

/**
 * S3ClientSingleton will create a defaul S3Client for user to use
 *
 * @category Main
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class S3ClientSingleton
{
    private static $_instance = null;
    private $_s3Client;
    /**
     * __construct function
     *
     * @param $accessKey = null,
     * @param $secretKey = null,
     * @param $region    = null
     */
    private function __construct(
        $accessKey = null,
        $secretKey = null,
        $region = null
    ) {
        $config   = \NDB_Config::singleton();
        $region   = $config->getSetting('AWS_S3_Region');
        $s3Config = [
            'version'     => 'latest',
            'region'      => $region ?? 'us-east-1',
            'credentials' => [
                'key'    => $accessKey ?? getenv('AWS_ACCESS_KEY_ID'),
                'secret' => $secretKey ?? getenv('AWS_SECRET_ACCESS_KEY'),
            ],
        ];

        $this->_s3Client = new S3Client($s3Config);
    }
    /**
     * GetInstance function
     *
     * @param string $accessKey The accessKey 
     * @param string $secretKey The secretKey
     * @param string $region    region
     *
     * @return S3ClientSingleton 
     */
    public static function getInstance(
        $accessKey = null,
        $secretKey = null,
        $region = null
    ) {
        if (self::$_instance === null) {
            self::$_instance = new self($accessKey, $secretKey, $region);
        }

        return self::$_instance;
    }
    /**
     * GetS3Client funtion
     *
     * @return S3ClientSingleton 
     */
    public function getS3Client()
    {
        return $this->_s3Client;
    }
    /**
     * The s3download function
     *
     * @param string $bucketName The bucketName
     * @param string $folderName The folderName
     * @param string $fileName   fileName
     *
     * @return bool it will return true or false 
     */
    public function s3download($bucketName, $folderName, $fileName)
    {
        try {
            // Use the provided bucketName and folderName to construct S3object key
            $objectKey = ($folderName ? $folderName . '/' : '') . $fileName;

            // Get the S3 object
            $s3Object = $this->_s3Client->getObject(
                [
                    'Bucket' => $bucketName,
                    'Key'    => $objectKey,
                ]
            );
            // Set headers to indicate a file download
            header('Content-Type: ' . $s3Object['ContentType']);
            header('Content-Disposition: attachment; filename="' . $fileName . '"');

            // Output the file content
            echo $s3Object['Body'];

            return true;
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            return false;
        }
    }
    /**
     * The s3uploadfile function
     *
     * @param string $bucketName    The bucketName
     * @param string $folderName    The folderName
     * @param string $fileName      fileName
     * @param string $localFilePath localFilePath
     *
     * @return bool it will return true or false 
     */    
    public function s3uploadfile($bucketName, $folderName, $fileName, $localFilePath)
    {
        try {
            // Use the bucketName, folderName, and fileName to construct S3object key
            $objectKey = ($folderName ? $folderName . '/' : '') . $fileName;

            $this->_s3Client->putObject(
                [
                    'Bucket'     => $bucketName,
                    'Key'        => $objectKey,
                    'SourceFile' => $localFilePath,
                ]
            );

            return true;
        } catch (Exception $e) {
            // Handle any errors that occurred during the upload
            error_log("Error: " . $e->getMessage());

            return false;
        }
    }
    /**
     * The checkS3FileExist function
     *
     * @param string $bucketName The bucketName
     * @param string $folderName The folderName
     * @param string $fileName   fileName
     *
     * @return bool it will return true or false 
     */
    public function checkS3FileExist($bucketName, $folderName, $fileName)
    {
        try {
            // Use bucketName, folderName, and fileName to construct S3 object key
            $objectKey = ($folderName ? $folderName . '/' : '') . $fileName;

            $result = $this->_s3Client->doesObjectExist($bucketName, $objectKey);

            return $result;
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());

            return false;
        }
    }
    /**
     * The s3DeleteFile function
     *
     * @param string $bucketName The bucketName
     * @param string $folderName The folderName
     * @param string $fileName   fileName
     *
     * @return bool it will return true or false 
     */    
    public function s3DeleteFile($bucketName, $folderName, $fileName)
    {
        try {
            // Use bucketName, folderName, and fileName to construct S3 object key
            $objectKey = ($folderName ? $folderName . '/' : '') . $fileName;

            // Delete the file from the S3 bucket
            $this->_s3Client->deleteObject(
                [
                    'Bucket' => $bucketName,
                    'Key'    => $objectKey,
                ]
            );

            return true;
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());

            return false;
        }
    }
}

