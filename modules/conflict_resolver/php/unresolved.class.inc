<?php
/**
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\conflict_resolver;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * Menu_Filter_Form_Conflicts_Resolver Class
 *
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Unresolved extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Returns true if the user has permission to access
     * the conflict resolver module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    public function hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('conflict_resolver'));
    }


    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array(
                'GET',
                'POST',
               );
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * This part is not versioned yet.
     *
     * @return array
     */
    protected function supportedVersions() : array
    {
        return array('unknown');
    }

    /**
     * Provide the select inputs options
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        return array(
                'site'       => \Utility::getSiteList(false),
                'instrument' => \Utility::getAllInstruments(),
                'visitLabel' => \Utility::getVisitList(),
                'project'    => \Utility::getProjectList(),
               );
    }

    /**
     * Handles a request to Resolved conflicts
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'POST':
            return $this->_handlePOST($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());

        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (!isset($this->_cache)) {
            $user        = $request->getAttribute('user');
            $provisioner = (new UnresolvedProvisioner())->forUser($user);

            $conflicts = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);

            $body = array(
                     'data'         => $conflicts,
                     'fieldOptions' => $this->_getFieldOptions(),
                    );

            $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        }
        return $this->_cache;
    }

    /**
     * Handle POST request to fix conflicts. It will instantiate the instruments
     * and change the filed name to the correct value, then rescore them. It will
     * also remove the conflict_unresolved row and add a conflicts_resolved one.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        $conflictid    = $data['conflicid'] ?? null;
        $correctanswer = $data['correctanswer'] ?? null;

        if ($conflictid === null || $correctanswer === null) {
            return new \LORIS\Http\Response\BadRequest('Missing field(s)');
        }

        $db = \NDB_Factory::singleton()->database();

        // Select CommentID1 if the correct answer is the one from CommentID2
        // (and vice versa.)
        // This is using UNION on conflicts_resolved because a second query on the
        // same ConflictID would not work if the conflicts_unresolved row has
        // previouly been deleted.
        $conflict = $db->pselectRow(
            '
             SELECT
               TableName,
               FieldName,
               CASE :v_value
                 WHEN Value1 THEN CommentId2
                 ELSE CommentId1
               END as CID
             FROM
               conflicts_unresolved
             WHERE
               ConflictID = :v_conflictid
             UNION DISTINCT
             SELECT
               TableName,
               FieldName,
               CASE :v_value  
                 WHEN OldValue1 THEN CommentId2
                 ELSE CommentId1
               END as CID
             FROM
               conflicts_resolved
             WHERE
               ConflictID = :v_conflictid
            ',
            array(
             'v_conflictid' => $conflictid,
             'v_value'      => $correctanswer,
            )
        );

        // Fix instrument data
        $instrument = \NDB_BVL_Instrument::factory(
            $conflict['TableName'],
            $conflict['CID'],
            '',
            false
        );

        $instrument->_saveValues(array($conflict['FieldName'] => $correctanswer));

        // Using an output buffer because the scode function prints to STDOUT
        ob_start();
        $instrument->score();
        $error = ob_get_contents();
        ob_end_clean();

        if (!empty($error)) {
            return new \LORIS\Http\Response\InternalServerError($error);
        }

        // Insert in conflict_resolved
        $stmt = $db->prepare(
            '
             REPLACE INTO conflicts_resolved (
               UserID,
               User1,
               User2,
               TableName,
               ExtraKeyColumn,
               ExtraKey1,
               ExtraKey2,
               FieldName,
               CommentId1,
               CommentId2,
               OldValue1,
               OldValue2,
               NewValue,
               ConflictID
             )
             SELECT
               :v_username,
               f1.UserID,
               f2.UserID,
               cu.TableName,
               cu.ExtraKeyColumn,
               cu.ExtraKey1,
               cu.ExtraKey2,
               cu.FieldName,
               cu.CommentId1,
               cu.CommentId2,
               cu.Value1,
               cu.Value2,
               :v_newvalue,
               cu.ConflictID
             FROM conflicts_unresolved cu
             LEFT JOIN flag f1
               ON (cu.CommentId1=f1.CommentID)
             LEFT JOIN flag f2
               ON (cu.CommentId2=f2.CommentID)
             WHERE ConflictID = :v_conflictid
            '
        );

        $success = $stmt->execute(
            array(
             'v_username'   => $user->getUsername(),
             'v_newvalue'   => $correctanswer,
             'v_conflictid' => $conflictid,
            )
        );

        if (!$success) {
            return new \LORIS\Http\Response\InternalServerError();
        }

        // Delete from conflicts_unresolved
        $db->delete('conflicts_unresolved', array('ConflictID' => $conflictid));

        return new \LORIS\Http\Response();
    }
}
