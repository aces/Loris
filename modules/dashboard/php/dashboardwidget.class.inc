<?php
namespace LORIS\dashboard;

interface DashboardWidget extends \LORIS\GUI\Widget {
    public function getSize() : string;
    public function getOrder() : int;
}
