<?php

interface ModuleAPI
{
    /**
     * Adds routes or middleware to the passed in App
     *
     * @param  \Slim\App $app
     * @return void
     */
    public function addRoutes(\LorisApp $app);
}