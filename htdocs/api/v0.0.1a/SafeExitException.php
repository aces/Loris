<?php
namespace Loris\API;
class SafeExitException extends \Exception {
    var $Object;

    function __construct($message, $exitStatus, $obj) {
        parent::__construct($message, $exitStatus);
        $this->Object = $obj;
    }
}
?>
