<?php

class NullModule extends Module {
    public function __construct() {
        parent::__construct("", "");
    }

    public function getLongName() : string {
        return "";
    }
}
