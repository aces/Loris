<?php declare(strict_types=1);

namespace LORIS\AWS;

/**
 * An AWS\Client handles access to an AWS S3 service connecting
 * with credentials coming from a LORIS database
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Client
{
    protected $s3client;

    /**
     * Constructor for \LORIS\AWS\Client
     *
     * @param \LORIS\LorisInstance $loris The LorisInstance with AWS
     *                                    credentials
     */
    public function __construct(protected \LORIS\LorisInstance $loris)
    {
        // AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
        // should both be set as environment variables
        // for the AWS SDK
        if (getenv('AWS_ACCESS_KEY_ID') === false) {
            throw new \Exception("No AWS_ACCESS_KEY_ID defined");
        }
        if (getenv('AWS_SECRET_ACCESS_KEY') === false) {
            throw new \Exception("No AWS_SECRET_ACCESS_KEY defined");
        }
        $config   = $loris->getConfiguration();
        $s3config = ['version' => '2006-03-01'];
        $endpoint = $config->getSetting('AWS_S3_Endpoint');
        if (!empty($endpoint)) {
            $s3config['region']   = '';
            $s3config['endpoint'] = $endpoint;
        } else {
            $s3config['region'] = $config->getSetting('AWS_S3_Region');
        }

        $this->s3client = new \Aws\S3\S3Client($s3config);

        // Register the stream wrapper so that s3:// urls can be
        // treated as regular files.
    }

    /**
     * Register an AWS stream wrapper so that s3:// urls can be treated
     * as regular files by PHP.
     *
     * @return void
     */
    public function registerStreamWrapper()
    {
        $this->s3client->registerStreamWrapper();
    }
}
