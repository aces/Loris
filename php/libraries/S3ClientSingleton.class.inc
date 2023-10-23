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

class S3ClientSingleton
{
    private static $instance = null;
    private $s3Client;

    private function __construct(
        $accessKey = null,
        $secretKey = null,
        $region = null,
    ) {
        $config      = \NDB_Config::singleton();
        $region = $config->getSetting('AWS_S3_Region');	
        $s3Config = [
            'version' => 'latest',
            'region' => $region ?? 'us-east-1',
            'credentials' => [
                'key' => $accessKey ?? getenv('AWS_ACCESS_KEY_ID'),
                'secret' => $secretKey ?? getenv('AWS_SECRET_ACCESS_KEY'),
            ],
        ];

	$this->s3Client = new S3Client($s3Config);
    }

    public static function getInstance(
        $accessKey = null,
        $secretKey = null,
        $region = null,
    ) {
        if (self::$instance === null) {
            self::$instance = new self($accessKey, $secretKey, $region);
        }

        return self::$instance;
    }

    public function getS3Client()
    {
        return $this->s3Client;
    }
}

