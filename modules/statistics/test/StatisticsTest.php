<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class StatisticsTest extends LorisIntegrationTest
{
   




    public function StatisticsTest_Load()
    {
        

            $this->safeGet($this->url . '/statistics/');
            
            $assertContent = $this->webDriver->findElement(WebDriverBy::cssSelector("#page > h2")).getText();
            
            $this->assertContains("Welcome to the statistics page", $assertContent);
        }


    // Tests that, when loading the statistics module, click the Demographic Statistics, it shows General statistics
    public function StatisticsTest_DemographicStatistics()
    {
        

            $this->safeGet($this->url . '/statistics/demographic/?dynamictabs=dynamictabs');
            
            $assertContent = $this->webDriver->findElement(WebDriverBy::cssSelector("#demographics > h2:nth-child(1)")).getText();
            
            $this->assertContains("General statistics", $assertContent);
        }


    // Tests that, when loading the Behavioural Statistics module, click the Demographic Statistics, it shows Data Entry Statistics
    public function StatisticsTest_BehaviouralStatistics()
    {
        

            $this->safeGet($this->url . '/statistics/behavioural/?dynamictabs=dynamictabs');
            
            $assertContent = $this->webDriver->findElement(WebDriverBy::cssSelector("#data_entry > h2:nth-child(1)")).getText();
            
            $this->assertContains("Data Entry Statistics", $assertContent);

    }
      

    // Tests that, when loading the Reliability Statistics module, click the Demographic Statistics, it shows Reliability Statistics
    public function StatisticsTest_ReliabilityStatistics()
    {
        

            $this->safeGet($this->url . '/statistics/reliability/?dynamictabs=dynamictabs');
            
            $assertContent = $this->webDriver->findElement(WebDriverBy::cssSelector("#reliability > h2")).getText();
            
            $this->assertContains("Reliability Statistics", $assertContent);

     }

    // Tests that, when loading the Imaging Statistics module, click the Demographic Statistics, it shows General Statistics with QC Status for
    public function StatisticsTest_ImagingStatistics()
    {
        

            $this->safeGet($this->url . '/statistics/MRI/?dynamictabs=dynamictabs');
            
            $assertContent = $this->webDriver->findElement(WebDriverBy::cssSelector("#mri > h2:nth-child(1)")).getText();
            
            $this->assertContains("General Statistics with QC Status for", $assertContent);

    }

}
?>
