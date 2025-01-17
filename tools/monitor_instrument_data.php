<?php
/**
 * Runs ServerProcessMonitor for ParseInstrumentDataServerProcess
 * Checks and update status of running processes
 * Intended to be periodically run from cron
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\server_processes_manager;

require_once __DIR__ . "/generic_includes.php";

require_once __DIR__ . "/../modules/server_processes_manager/php/serverprocessesmonitor.class.inc";
require_once __DIR__ . "/../modules/server_processes_manager/php/idatabaseprovider.class.inc";
require_once __DIR__ . "/../modules/server_processes_manager/php/defaultdatabaseprovider.class.inc";
require_once __DIR__ . "/../modules/server_processes_manager/php/serverprocessfactory.class.inc";
require_once __DIR__ . "/../modules/server_processes_manager/php/abstractserverprocess.class.inc";
require_once __DIR__ . "/../modules/server_processes_manager/php/parseinstrumentdataserverprocess.class.inc";
require_once __DIR__ . "/../modules/server_processes_manager/php/mriuploadserverprocess.class.inc";


$spm = new ServerProcessesMonitor();
$d = $spm->getProcessesState(null, null, ParseInstrumentDataServerProcess::PROCESS_TYPE);

