<?php

use PHPUnit\Framework\TestCase;

class TimeOut extends LorisIntegrationTest
{
    public function test_this_takes_really_long()
    {
        sleep(65);
        $this->assertTrue(true);
    }
}