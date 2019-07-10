<?php
/**
 * Will handle all client requests for information on specific tasks.
 * The information returned will contain
 *   - process state (running, success, error or unknown_pid)
 *   - process return code
 *   - process current progress text
 *   - process return text
 *
 * PHP Version 5
 *
 * @category TaskManager
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$user =& User::singleton();
if (!$user->hasPermission('server_processes_manager')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once "ServerProcessesMonitor.class.inc";

$pids   = explode('_', $_REQUEST['ids']);
$type   = $_REQUEST['type'];
$userid = User::singleton()->getUsername();

$serverProcessesMonitor = new ServerProcessesMonitor();
$processesState         = $serverProcessesMonitor->getProcessesState(
    $ids,
    $userid,
    $type
);

echo json_encode($processesState);


