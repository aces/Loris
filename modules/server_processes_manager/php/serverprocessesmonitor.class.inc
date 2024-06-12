<?php
/**
 * This class is used to monitor the state of server processes that are
 * (or were) running on the server. In doing so, the ServerProcessMonitor
 * may if necessary update some of the informations stored in the database
 * for the monitored processes if they are not in sync with whatever the
 * monitor computes
 *
 * PHP Version 5
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\server_processes_manager;

/**
 * The ServerProcessesMonitor class.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class ServerProcessesMonitor
{
    /**
     * Will provide access to the database
     *
     * @var IDatabaseProvider
     */
    private $_databaseProvider;

    /**
     * Mutator for field databaseProvider.
     *
     * @param IDatabaseProvider $databaseProvider new value for field
     *                                            _databaseProvider.
     *
     * @return void
     */
    public function setDatabaseProvider($databaseProvider)
    {
        $this->_databaseProvider = $databaseProvider;
    }

    /**
     * Accessor for field $databaseProvider.
     *
     * @return DefaultDatabaseProvider|IDatabaseProvider (value of
     *                                                   field $databaseProvider)
     */
    public function getDatabaseProvider()
    {
        // Lazy initialization of field
        if (is_null($this->_databaseProvider)) {
            $this->_databaseProvider = new DefaultDatabaseProvider();
        }

        return $this->_databaseProvider;
    }

    /**
     * Obtain the state of a given set of server processes, identified by their IDs
     * and userids. If, while getting the state information for a given process, the
     * monitor finds that the information computed is not in sync with
     * whatever is stored in the database for that process, the information
     * stored in the database is updated to reflect the current process state.
     *
     * @param array       $idsToMonitor IDs of the server processes to monitor.
     *                                  If null, then the state of all the
     *                                  processes stored in the database is
     *                                  returned.
     * @param string|null $userid       Only the processes run by the user with name
     *                                  $userid are considered. If null, then the
     *                                  userid check is not performed.
     * @param string|null $type         The type of server processes to retrieve. If
     *                                  null then all types are considered.
     *
     * @return array (associative) of the current state of the processes.
     * @throws \DatabaseException if connection to the database cannot be
     *                           established.
     */
    public function getProcessesState(
        $idsToMonitor = null, $userid = null, $type = null
    ) {
        //------------------------------------------------------
        // Connect to database and fetch the requested processes
        //------------------------------------------------------
        $db = $this->getDatabaseProvider()->getDatabase();

        $query = "SELECT id, pid, type, userid, stdout_file, stderr_file,
                         exit_code_file, exit_code, start_time, end_time,
                         exit_text
                  FROM server_processes
                  WHERE 1=1";

        // Build ID where clause if needed
        $idInClause = '';
        if (!is_null($idsToMonitor)) {
            $idInClause = implode(',', $idsToMonitor);
            $query      = "$query AND id IN ($idInClause)";
        }

        // Build userid where clause if needed
        $params = [];
        if (!is_null($userid)) {
            $query = "$query AND userid =:requestUserid";
            $params['requestUserid'] = $userid;
        }

        // Build type clause if needed
        if (!is_null($type)) {
            $query          = "$query AND type =:type";
            $params['type'] = $type;
        }

        // Try to fetch the requested processes
        try {
            $rows = $db->pselect($query, $params);
        } catch (\DatabaseException $exception) {
            // If this fails, log the error and return the exception to the caller
            error_log(
                "Failed to retrieve processes to monitor: "
                . (is_null($idsToMonitor) ? "All ids "      : "IDs in ($idInClause)")
                . (is_null($userid)       ? ", all users"   : ", user = $userid")
                . (is_null($type)         ? ", all types: " : ", type = $type: ")
                . $exception->getMessage()
            );
            throw $exception;
        }

        //---------------------------------------------------
        // Build appropriate process object for all processes
        // retrieved from the database
        //---------------------------------------------------
        $serverProcessFactory = new ServerProcessFactory();
        $savedProcesses       = [];
        foreach ($rows as $row) {
            $savedProcesses[$row['id']] = $serverProcessFactory->getServerProcess(
                intval($row['id']),
                intval($row['pid']),
                $row['type'],
                $row['stdout_file'],
                $row['stderr_file'],
                $row['exit_code_file'],
                intval($row['exit_code']),
                $row['userid'],
                $row['start_time'],
                $row['end_time'],
                $row['exit_text']
            );
        }

        //-----------------------------------------------------
        // Compute the current state of the requested processes
        //-----------------------------------------------------

        // If no id argument was passed to this function, compute
        // the state of all processes stored in the database. Otherwise
        // consider only those whose ids were passed as argument.
        $idsToMonitor = is_null($idsToMonitor)
            ? array_keys($savedProcesses) : $idsToMonitor;
        $processState = [];

        // Compute process state for each process to monitor
        foreach ($idsToMonitor as $id) {
            // Find process in the database with this id (null if none)
            $matchingProcess = isset($savedProcesses[$id])
                ? $savedProcesses[$id] : null;

            if (is_null($matchingProcess)) {
                // No process with this id. Unknown id = unknown state
                $state    = 'UNKNOWN_ID';
                $progress = null;
                $exitCode = null;
                $endTime  = null;
            } elseif ($matchingProcess->isRunning()) {
                // We found a matching process. If it is running, compute current
                // progress
                $state    = 'RUNNING';
                $progress = $matchingProcess->getProgress();
                $exitCode = null;
                $endTime  = null;
            } else {
                // Process is not running. Report this, along with exit code.
                // If exit code is unknown, then process crashed unexpectedly.
                // Process executed successfully only if exit code == 0.
                $exitCode = $matchingProcess->getExitCode();
                $state    = ($exitCode == 'unknown' || $exitCode != 0) ?
                              'ERROR' : 'SUCCESS';
                $progress = $matchingProcess->getExitText();
                $endTime  = $matchingProcess->getEndTime();
            }

            // Add current process state to state array
            $processState[] = [
                'ID'        => is_null($matchingProcess) ? null :
                                             $matchingProcess->getId(),
                'PID'       => is_null($matchingProcess) ? null :
                                             $matchingProcess->getPid(),
                'STATE'     => $state,
                'PROGRESS'  => $progress,
                'EXIT_CODE' => $exitCode,
                'END_TIME'  => $endTime,
            ];
        }

        return $processState;
    }
}


