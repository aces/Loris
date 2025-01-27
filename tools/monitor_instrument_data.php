<?php declare(strict_types=1);

/**
 * Runs ServerProcessMonitor for ParseInstrumentDataServerProcess
 * Checks and update status of running processes
 * Intended to be periodically run from cron
 *
 * PHP Version 8
 *
 * @category Main
 * @package  LORIS
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\server_processes_manager;

require_once __DIR__ . "/generic_includes.php";

$serverProcessManagerModuleDir = __DIR__ . "/../modules/server_processes_manager";

require_once $serverProcessManagerModuleDir .
    "/php/serverprocessesmonitor.class.inc";
require_once $serverProcessManagerModuleDir .
    "/php/idatabaseprovider.class.inc";
require_once $serverProcessManagerModuleDir .
    "/php/defaultdatabaseprovider.class.inc";
require_once $serverProcessManagerModuleDir .
    "/php/serverprocessfactory.class.inc";
require_once $serverProcessManagerModuleDir .
    "/php/abstractserverprocess.class.inc";
require_once $serverProcessManagerModuleDir .
    "/php/parseinstrumentdataserverprocess.class.inc";
require_once $serverProcessManagerModuleDir .
    "/php/mriuploadserverprocess.class.inc";


$spm = new ServerProcessesMonitor();
$spm->getProcessesState(
    null,
    null,
    ParseInstrumentDataServerProcess::PROCESS_TYPE
);

