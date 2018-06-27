<?php
namespace LORIS\integrationtests;

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once('HttpClient.php');

use \PHPUnit\Framework\TestCase;
use \Zend\Diactoros\Uri;

class ApiTestCase extends TestCase
{
    protected $httpclient;
    protected $factory;

    public function __construct()
    {
        parent::__construct();
        $this->factory  = \NDB_Factory::singleton();
 
        $config   = $this->factory->Config(CONFIG_XML);
        $dbconfig = $config->getSetting('database');

        $database = \Database::singleton(
            $dbconfig['database'],
            $dbconfig['username'],
            $dbconfig['password'],
            $dbconfig['host'],
            false
        );
        $this->factory->setDatabase($database);

        $this->httpclient = new \LORIS\tests\api\HttpClient(
            new Uri(
                $this->factory->settings()->getAPIURL() . '/api/v0.0.3-dev/'
            )
        );
    }

    /**
     * @test
     * @doesNotPerformAssertions
     */
    public function foo()
    {
    }
}

