#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * Generate deterministic Issue Tracker load-test data in a sandbox database.
 *
 * PHP Version 8
 *
 * @category Testing
 * @package  Loris
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

const MAX_ISSUES = 100000;
const MAX_COMMENTS_PER_ISSUE = 100;
const DEFAULT_BATCH_SIZE     = 500;

$flags = getopt(
    'hn',
    [
        'help',
        'dry-run',
        'confirm',
        'issues:',
        'comments:',
        'batch-size:',
        'run-id:',
        'reporter:',
        'cleanup:',
    ]
);
if ($flags === false) {
    fail('Could not parse command options.');
}

if (isset($flags['h']) || isset($flags['help'])) {
    usage();
    exit(0);
}

$cleanupOption  = getStringOption($flags, 'cleanup');
$issuesOption   = getStringOption($flags, 'issues');
$commentsOption = getStringOption($flags, 'comments') ?? '0,1,5';
$batchOption    = getStringOption($flags, 'batch-size')
    ?? (string) DEFAULT_BATCH_SIZE;
$runIDOption    = getStringOption($flags, 'run-id') ?? date('Ymd-His');
$reporterOption = getStringOption($flags, 'reporter');

require_once __DIR__ . '/../vendor/autoload.php';

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
$config = NDB_Config::singleton();
$DB     = NDB_Factory::singleton()->database();

$devSettings = $config->getSetting('dev');
if (!is_array($devSettings) || empty($devSettings['sandbox'])) {
    fwrite(
        STDERR,
        "Config file indicates that this is not a sandbox. Aborting.\n"
    );
    exit(1);
}

$dryRun = isset($flags['n'])
    || isset($flags['dry-run'])
    || !isset($flags['confirm']);

if (isset($flags['confirm'])
    && (isset($flags['n']) || isset($flags['dry-run']))
) {
    fail('--confirm cannot be combined with --dry-run.');
}

try {
    if ($cleanupOption !== null) {
        if ($issuesOption !== null) {
            fail('--cleanup cannot be combined with --issues.');
        }

        $runID = validateRunID($cleanupOption);
        cleanupRun($DB, $runID, $dryRun);
        exit(0);
    }

    if ($issuesOption === null) {
        usage();
        fail('Specify --issues to generate data or --cleanup to remove a run.');
    }

    $issueCount    = parseInteger(
        $issuesOption,
        '--issues',
        1,
        MAX_ISSUES
    );
    $commentCounts = parseCommentCounts($commentsOption);
    $batchSize     = parseInteger(
        $batchOption,
        '--batch-size',
        1,
        1000
    );
    $runID         = validateRunID($runIDOption);
    $reporter      = getReporter($DB, $reporterOption);
    $categories    = array_values(
        $DB->pselectCol(
            'SELECT categoryName FROM issues_categories ORDER BY categoryName',
            []
        )
    );

    generateRun(
        $DB,
        $runID,
        $reporter,
        $issueCount,
        $commentCounts,
        $batchSize,
        $categories,
        $dryRun
    );
} catch (Throwable $error) {
    fwrite(STDERR, 'Stress-test operation failed: ' . $error->getMessage() . "\n");
    exit(1);
}

/**
 * Print command usage.
 *
 * @return void
 */
function usage(): void
{
    global $argv;

    print <<<HELP
Usage:
  {$argv[0]} --issues=COUNT [options]
  {$argv[0]} --cleanup=RUN_ID [--confirm]

Generate options:
  --issues=COUNT       Number of issues to create (1-100000)
  --comments=LIST      Comma-separated comment counts to cycle through
                       (default: 0,1,5; maximum value: 100)
  --batch-size=COUNT   Rows per insert batch (default: 500; maximum: 1000)
  --run-id=RUN_ID      Unique alphanumeric/hyphen identifier for this run
  --reporter=USER_ID   Active approved user to own generated records

Safety options:
  --confirm            Write to the sandbox database; without this flag the
                       command is a dry run
  -n, --dry-run        Validate and display the plan without writing data
  --cleanup=RUN_ID     Remove issues and comments created by one run
  -h, --help           Show this help

Examples:
  {$argv[0]} --issues=1000 --comments=0,1,5 --run-id=load-1
  {$argv[0]} --issues=1000 --comments=0,1,5 --run-id=load-1 --confirm
  {$argv[0]} --cleanup=load-1 --confirm

HELP;
}

/**
 * Write an error and stop execution.
 *
 * @param string $message Error message.
 *
 * @return never
 */
function fail(string $message): never
{
    fwrite(STDERR, $message . "\n");
    exit(1);
}

/**
 * Read an option that must have one string value.
 *
 * @param array<string,string|false|array<int,mixed>> $flags Options.
 * @param string                                      $name  Option name.
 *
 * @return string|null
 */
function getStringOption(array $flags, string $name): ?string
{
    if (!array_key_exists($name, $flags)) {
        return null;
    }

    $value = $flags[$name];
    if (!is_string($value)) {
        fail("--$name must be specified once with a value.");
    }

    return $value;
}

/**
 * Parse and validate a bounded integer option.
 *
 * @param string $value  Option value.
 * @param string $option Option name.
 * @param int    $min    Minimum accepted value.
 * @param int    $max    Maximum accepted value.
 *
 * @return int
 */
function parseInteger(
    string $value,
    string $option,
    int $min,
    int $max
): int {
    if (!preg_match('/^\d+$/', $value)) {
        fail("$option must be an integer between $min and $max.");
    }

    $parsed = intval($value);
    if ($parsed < $min || $parsed > $max) {
        fail("$option must be between $min and $max.");
    }

    return $parsed;
}

/**
 * Parse the comment distribution.
 *
 * @param string $value Comma-separated comment counts.
 *
 * @return array<int,int>
 */
function parseCommentCounts(string $value): array
{
    $counts = [];
    foreach (explode(',', $value) as $count) {
        $counts[] = parseInteger(
            trim($count),
            '--comments',
            0,
            MAX_COMMENTS_PER_ISSUE
        );
    }

    return $counts;
}

/**
 * Validate a run identifier used in record markers.
 *
 * @param string $runID Run identifier.
 *
 * @return string
 */
function validateRunID(string $runID): string
{
    if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9-]{0,63}$/', $runID)) {
        fail(
            'Run IDs must be 1-64 characters and contain only letters, ' .
            'numbers, and hyphens.'
        );
    }

    return $runID;
}

/**
 * Find and validate the user attached to generated records.
 *
 * @param Database    $db        Database connection.
 * @param string|null $requested Requested user ID, if supplied.
 *
 * @return string
 */
function getReporter(Database $db, ?string $requested): string
{
    if ($requested !== null) {
        $reporter = $db->pselectOne(
            "SELECT UserID
             FROM users
             WHERE UserID=:user_id
               AND Active='Y'
               AND Pending_approval='N'",
            ['user_id' => $requested]
        );
        if ($reporter === null) {
            fail('--reporter must identify an active, approved user.');
        }

        return $reporter;
    }

    $reporter = $db->pselectOne(
        "SELECT COALESCE(
                    MAX(CASE WHEN UserID='lorisadmin' THEN UserID END),
                    MIN(UserID)
                )
         FROM users
         WHERE Active='Y' AND Pending_approval='N'",
        []
    );
    if ($reporter === null) {
        fail('No active, approved user is available as the reporter.');
    }

    return $reporter;
}

/**
 * Generate one tagged stress-test run.
 *
 * @param Database          $db            Database connection.
 * @param string            $runID         Run identifier.
 * @param string            $reporter      User attached to generated rows.
 * @param int               $issueCount    Number of issues to create.
 * @param array<int,int>    $commentCounts Comment distribution.
 * @param int               $batchSize     Insert batch size.
 * @param array<int,string> $categories    Existing issue categories.
 * @param bool              $dryRun        Whether writes should be skipped.
 *
 * @return void
 */
function generateRun(
    Database $db,
    string $runID,
    string $reporter,
    int $issueCount,
    array $commentCounts,
    int $batchSize,
    array $categories,
    bool $dryRun
): void {
    $markers  = getMarkers($runID);
    $existing = countRunIssues($db, $markers);
    if ($existing > 0) {
        fail(
            "Run '$runID' already has $existing issue(s). " .
            "Choose another ID or clean up that run first."
        );
    }

    $expectedComments = calculateCommentTotal($issueCount, $commentCounts);
    printf(
        "%s run '%s': %s issues, %s comments, reporter '%s', batch size %s.\n",
        $dryRun ? 'Dry-run plan for' : 'Generating',
        $runID,
        number_format($issueCount),
        number_format($expectedComments),
        $reporter,
        number_format($batchSize)
    );
    if ($dryRun) {
        echo "No records were written. Re-run with --confirm to generate data.\n";
        return;
    }

    $startedAt = microtime(true);
    insertIssues(
        $db,
        $runID,
        $reporter,
        $issueCount,
        $batchSize,
        $categories
    );
    $commentsInserted = insertComments(
        $db,
        $runID,
        $reporter,
        $commentCounts,
        $batchSize
    );
    $elapsed          = microtime(true) - $startedAt;

    printf(
        "Completed run '%s': %s issues and %s comments in %.2f seconds.\n",
        $runID,
        number_format($issueCount),
        number_format($commentsInserted),
        $elapsed
    );
    echo "Cleanup command: {$GLOBALS['argv'][0]} --cleanup=$runID --confirm\n";
}

/**
 * Insert issues in bounded batches.
 *
 * @param Database          $db         Database connection.
 * @param string            $runID      Run identifier.
 * @param string            $reporter   Reporter and updater user ID.
 * @param int               $issueCount Number of issues to insert.
 * @param int               $batchSize  Insert batch size.
 * @param array<int,string> $categories Existing issue categories.
 *
 * @return void
 */
function insertIssues(
    Database $db,
    string $runID,
    string $reporter,
    int $issueCount,
    int $batchSize,
    array $categories
): void {
    $statuses      = [
        'new',
        'acknowledged',
        'feedback',
        'assigned',
        'resolved',
        'closed',
        'rejected',
    ];
    $priorities    = ['low', 'normal', 'high', 'urgent', 'immediate'];
    $createdAt     = date('Y-m-d H:i:s');
    $progressEvery = max($batchSize, (int) ceil($issueCount / 10));
    $nextProgress  = $progressEvery;

    for ($offset = 0; $offset < $issueCount; $offset += $batchSize) {
        $rowsInBatch = min($batchSize, $issueCount - $offset);
        $values      = [];
        $params      = [];

        for ($index = 0; $index < $rowsInBatch; $index++) {
            $sequence      = $offset + $index + 1;
            $suffix        = (string) $index;
            $statusIndex   = ($sequence - 1) % count($statuses);
            $priorityIndex = ($sequence - 1) % count($priorities);
            $values[]      = "(
                :title$suffix, :reporter$suffix, :assignee$suffix,
                :status$suffix, :priority$suffix, :created$suffix,
                :updated_by$suffix, :category$suffix, :description$suffix
            )";
            $params["title$suffix"]       = makeTitle($runID, $sequence);
            $params["reporter$suffix"]    = $reporter;
            $params["assignee$suffix"]    = $sequence % 4 === 0 ? null : $reporter;
            $params["status$suffix"]      = $statuses[$statusIndex];
            $params["priority$suffix"]    = $priorities[$priorityIndex];
            $params["created$suffix"]     = $createdAt;
            $params["updated_by$suffix"]  = $reporter;
            $params["category$suffix"]    = empty($categories)
                ? null
                : $categories[($sequence - 1) % count($categories)];
            $params["description$suffix"] = makeDescription($runID, $sequence);
        }

        $query = "INSERT INTO issues (
                    title, reporter, assignee, status, priority, dateCreated,
                    lastUpdatedBy, category, description
                  ) VALUES " . implode(', ', $values);
        executeWrite($db, $query, $params);

        $inserted = $offset + $rowsInBatch;
        if ($inserted >= $nextProgress || $inserted === $issueCount) {
            printf(
                "Inserted %s/%s issues.\n",
                number_format($inserted),
                number_format($issueCount)
            );
            $nextProgress += $progressEvery;
        }
    }
}

/**
 * Insert comments for generated issues in bounded batches.
 *
 * @param Database       $db            Database connection.
 * @param string         $runID         Run identifier.
 * @param string         $reporter      Comment author.
 * @param array<int,int> $commentCounts Comment distribution.
 * @param int            $batchSize     Insert batch size.
 *
 * @return int Number of comments inserted.
 */
function insertComments(
    Database $db,
    string $runID,
    string $reporter,
    array $commentCounts,
    int $batchSize
): int {
    $markers     = getMarkers($runID);
    $lastIssueID = 0;
    $commentRows = [];
    $inserted    = 0;
    $generatedAt = time();

    while (true) {
        /**
         * Generated issue identifiers and titles.
         *
         * @var array<int,array{issueID:string,title:string}> $issues
         */
        $issues = $db->pselect(
            "SELECT issueID, title
             FROM issues
             WHERE issueID > :last_issue_id
               AND title LIKE :title_marker
               AND description LIKE :description_marker
             ORDER BY issueID
             LIMIT $batchSize",
            [
                'last_issue_id'      => $lastIssueID,
                'title_marker'       => $markers['title'],
                'description_marker' => $markers['description'],
            ]
        );
        if (count($issues) === 0) {
            break;
        }

        foreach ($issues as $issue) {
            $lastIssueID = intval($issue['issueID']);
            if (!preg_match('/#(\d+)$/', $issue['title'], $matches)) {
                throw new RuntimeException(
                    'Could not read generated issue sequence.'
                );
            }

            $sequence     = intval($matches[1]);
            $commentCount = $commentCounts[($sequence - 1) % count($commentCounts)];
            for ($comment = 1; $comment <= $commentCount; $comment++) {
                $commentRows[] = [
                    'issueID'      => $lastIssueID,
                    'dateAdded'    => date(
                        'Y-m-d H:i:s',
                        $generatedAt - $commentCount + $comment
                    ),
                    'addedBy'      => $reporter,
                    'issueComment' => sprintf(
                        'Stress-test comment %d of %d for issue #%06d (run %s).',
                        $comment,
                        $commentCount,
                        $sequence,
                        $runID
                    ),
                ];
                if (count($commentRows) === $batchSize) {
                    insertCommentBatch($db, $commentRows);
                    $inserted   += count($commentRows);
                    $commentRows = [];
                }
            }
        }
    }

    if (!empty($commentRows)) {
        insertCommentBatch($db, $commentRows);
        $inserted += count($commentRows);
    }

    return $inserted;
}

/**
 * Insert one batch of comments.
 *
 * @param Database                            $db   Database connection.
 * @param array<int,array<string,int|string>> $rows Comment rows.
 *
 * @return void
 */
function insertCommentBatch(Database $db, array $rows): void
{
    $values = [];
    $params = [];
    foreach ($rows as $index => $row) {
        $values[] = "(
            :issue_id$index, :date_added$index, :added_by$index, :comment$index
        )";
        $params["issue_id$index"]   = $row['issueID'];
        $params["date_added$index"] = $row['dateAdded'];
        $params["added_by$index"]   = $row['addedBy'];
        $params["comment$index"]    = $row['issueComment'];
    }

    $query = 'INSERT INTO issues_comments (
                issueID, dateAdded, addedBy, issueComment
              ) VALUES ' . implode(', ', $values);
    executeWrite($db, $query, $params);
}

/**
 * Execute a prepared write in its own transaction.
 *
 * @param Database            $db     Database connection.
 * @param string              $query  SQL statement.
 * @param array<string,mixed> $params Bound parameters.
 *
 * @return void
 */
function executeWrite(Database $db, string $query, array $params): void
{
    $db->beginTransaction();
    try {
        $db->execute($db->prepare($query), $params, ['nofetch' => '1']);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

/**
 * Remove one generated run after checking for attachments.
 *
 * @param Database $db     Database connection.
 * @param string   $runID  Run identifier.
 * @param bool     $dryRun Whether writes should be skipped.
 *
 * @return void
 */
function cleanupRun(Database $db, string $runID, bool $dryRun): void
{
    $markers      = getMarkers($runID);
    $issueCount   = countRunIssues($db, $markers);
    $commentCount = $db->pselectOneInt(
        "SELECT COUNT(*)
         FROM issues_comments c
         JOIN issues i ON i.issueID=c.issueID
         WHERE i.title LIKE :title_marker
           AND i.description LIKE :description_marker",
        [
            'title_marker'       => $markers['title'],
            'description_marker' => $markers['description'],
        ]
    ) ?? 0;

    printf(
        "%s cleanup for run '%s': %s issues and %s comments.\n",
        $dryRun ? 'Dry-run' : 'Running',
        $runID,
        number_format($issueCount),
        number_format($commentCount)
    );
    if ($issueCount === 0) {
        echo "Nothing to remove.\n";
        return;
    }
    if ($dryRun) {
        echo "No records were removed. Re-run with --confirm to clean up.\n";
        return;
    }

    $attachmentCount = $db->pselectOneInt(
        "SELECT COUNT(*)
         FROM issues_attachments a
         JOIN issues i ON i.issueID=a.issueID
         WHERE i.title LIKE :title_marker
           AND i.description LIKE :description_marker",
        [
            'title_marker'       => $markers['title'],
            'description_marker' => $markers['description'],
        ]
    ) ?? 0;
    if ($attachmentCount > 0) {
        fail(
            "Run '$runID' has $attachmentCount attachment(s). Remove them " .
            'through the Issue Tracker before cleanup.'
        );
    }

    $params = [
        'title_marker'       => $markers['title'],
        'description_marker' => $markers['description'],
    ];
    executeWrite(
        $db,
        "DELETE w
         FROM issues_watching w
         JOIN issues i ON i.issueID=w.issueID
         WHERE i.title LIKE :title_marker
           AND i.description LIKE :description_marker",
        $params
    );
    executeWrite(
        $db,
        "DELETE FROM issues
         WHERE title LIKE :title_marker
           AND description LIKE :description_marker",
        $params
    );

    echo "Removed run '$runID'.\n";
}

/**
 * Count issues belonging to one generated run.
 *
 * @param Database             $db      Database connection.
 * @param array<string,string> $markers SQL LIKE markers.
 *
 * @return int
 */
function countRunIssues(Database $db, array $markers): int
{
    return $db->pselectOneInt(
        "SELECT COUNT(*)
         FROM issues
         WHERE title LIKE :title_marker
           AND description LIKE :description_marker",
        [
            'title_marker'       => $markers['title'],
            'description_marker' => $markers['description'],
        ]
    ) ?? 0;
}

/**
 * Calculate the total comments created by a repeating distribution.
 *
 * @param int            $issueCount    Number of issues.
 * @param array<int,int> $commentCounts Comment distribution.
 *
 * @return int
 */
function calculateCommentTotal(int $issueCount, array $commentCounts): int
{
    $fullCycles = intdiv($issueCount, count($commentCounts));
    $remainder  = $issueCount % count($commentCounts);
    $total      = $fullCycles * array_sum($commentCounts);

    for ($index = 0; $index < $remainder; $index++) {
        $total += $commentCounts[$index];
    }

    return $total;
}

/**
 * Get the SQL LIKE markers for a run.
 *
 * @param string $runID Run identifier.
 *
 * @return array<string,string>
 */
function getMarkers(string $runID): array
{
    return [
        'title'       => "[LORIS-STRESS:$runID] Issue #%",
        'description' => "LORIS-STRESS-RUN:$runID; issue=%",
    ];
}

/**
 * Make a deterministic generated title.
 *
 * @param string $runID    Run identifier.
 * @param int    $sequence Issue sequence.
 *
 * @return string
 */
function makeTitle(string $runID, int $sequence): string
{
    return sprintf('[LORIS-STRESS:%s] Issue #%06d', $runID, $sequence);
}

/**
 * Make a deterministic generated description.
 *
 * @param string $runID    Run identifier.
 * @param int    $sequence Issue sequence.
 *
 * @return string
 */
function makeDescription(string $runID, int $sequence): string
{
    return sprintf('LORIS-STRESS-RUN:%s; issue=%06d', $runID, $sequence);
}
