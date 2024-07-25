<?php declare(strict_types=1);
/**
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\conflict_resolver\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\conflict_resolver\Provisioners\UnresolvedProvisioner;
use \LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch;
use \LORIS\Data\Filters\UserProjectMatch;

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
        return $user->hasPermission('conflict_resolver');
    }

    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
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
        return [
            'GET',
            'POST',
        ];
    }

    /**
     * Provide the select inputs options
     *
     * @param \LORIS\LorisInstance $loris The LorisInstance from which to retreive
     *                                    the options.
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions(\LORIS\LorisInstance $loris) : array
    {
        $sites       = array_values(\Utility::getSiteList(false));
        $visitlabels = array_values(\Utility::getVisitList());
        $projects    = array_values(\Utility::getProjectList());

        return [
            'site'       => array_combine($sites, $sites),
            'instrument' => \NDB_BVL_Instrument::getInstrumentNamesList($loris),
            'visitLabel' => array_combine($visitlabels, $visitlabels),
            'project'    => array_combine($projects, $projects),
        ];
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
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
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
            $provisioner = (new UnresolvedProvisioner())
                ->filter(
                    new HasAnyPermissionOrUserSiteMatch(
                        ['access_all_profiles']
                    )
                )
                ->filter(new UserProjectMatch());

            $user      = $request->getAttribute('user');
            $conflicts = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);

            $loris = $request->getAttribute('loris');
            $body  = [
                'data'         => $conflicts,
                'fieldOptions' => $this->_getFieldOptions($loris),
            ];

            $this->_cache = $body;
        }

        return new \LORIS\Http\Response\JsonResponse(
            $this->_cache
        );
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

        $conflictid    = $data['conflictid'] ?? null;
        $correctanswer = $data['correctanswer'] ?? null;

        if ($conflictid === null || $correctanswer === null) {
            return new \LORIS\Http\Response\JSON\BadRequest('Missing field(s)');
        }

        if ($correctanswer !== '1' && $correctanswer !== '2') {
            return new \LORIS\Http\Response\JSON\BadRequest('Invalid value');
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
               TestName,
               FieldName,
               CommentId1 as CID1,
               CommentId2 as CID2,
               CASE :v_value
                 WHEN "1" THEN Value1
                 ELSE Value2
               END as CorrectAnswer
             FROM
               conflicts_unresolved
             WHERE
               ConflictID = :v_conflictid
             UNION DISTINCT
             SELECT
               TestName,
               FieldName,
               CommentId1 as CID1,
               CommentId2 as CID2,
               CASE :v_value  
                 WHEN "1" THEN OldValue1
                 ELSE OldValue2
               END as CorrectAnswer
             FROM
               conflicts_resolved
             WHERE
               ConflictID = :v_conflictid
            ',
            [
                'v_conflictid' => $conflictid,
                'v_value'      => $correctanswer,
            ]
        );

        if (empty($conflict)) {
            return new \LORIS\Http\Response\JSON\NotFound(
                'ConflictID not found.'
            );
        }

        // Fix both instruments data
        $loris = $request->getAttribute('loris');

        $instrument = \NDB_BVL_Instrument::factory(
            $loris,
            $conflict['TestName'],
            $conflict['CID1'],
            '',
            true
        );
        if ($instrument->_hasAccess($user) == false) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'Permission denied for ' . $conflict['TestName']
            );
        }
        $instrument->_saveValues(
            [$conflict['FieldName'] => $conflict['CorrectAnswer']]
        );

        $ddeinstrument = \NDB_BVL_Instrument::factory(
            $loris,
            $conflict['TestName'],
            $conflict['CID2'],
            '',
            true
        );
        $ddeinstrument->_saveValues(
            [$conflict['FieldName'] => $conflict['CorrectAnswer']]
        );

        // Using an output buffer because the score function prints to STDOUT
        ob_start();

        $instrument->score();
        $ddeinstrument->score();

        $error = ob_get_contents();
        ob_end_clean();

        if (!empty($error)) {
            return new \LORIS\Http\Response\JSON\InternalServerError($error);
        }

        // Insert in conflict_resolved
        $stmt = $db->prepare(
            '
             REPLACE INTO conflicts_resolved (
               UserID,
               User1,
               User2,
               TestName,
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
               cu.TestName,
               cu.ExtraKeyColumn,
               cu.ExtraKey1,
               cu.ExtraKey2,
               cu.FieldName,
               cu.CommentId1,
               cu.CommentId2,
               cu.Value1,
               cu.Value2,
               CASE :v_newvalue WHEN cu.Value1 THEN 1 ELSE 2 END,
               cu.ConflictID
             FROM conflicts_unresolved cu
             LEFT JOIN flag f1
               ON (cu.CommentId1=f1.CommentID)
             LEFT JOIN flag f2
               ON (cu.CommentId2=f2.CommentID)
             WHERE cu.ConflictID = :v_conflictid
             UNION DISTINCT
             SELECT
               :v_username,
               cr.User1,
               cr.User2,
               cr.TestName,
               cr.ExtraKeyColumn,
               cr.ExtraKey1,
               cr.ExtraKey2,
               cr.FieldName,
               cr.CommentId1,
               cr.CommentId2,
               cr.OldValue1,
               cr.OldValue2,
               CASE :v_newvalue WHEN cr.OldValue1 THEN 1 ELSE 2 END,
               cr.ConflictID
             FROM conflicts_resolved cr
             WHERE cr.ConflictID = :v_conflictid
            '
        );

        $success = $stmt->execute(
            [
                'v_username'   => $user->getUsername(),
                'v_newvalue'   => $conflict['CorrectAnswer'],
                'v_conflictid' => $conflictid,
            ]
        );

        if (!$success) {
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }

        // Delete from conflicts_unresolved
        $db->delete('conflicts_unresolved', ['ConflictID' => $conflictid]);

        return new \LORIS\Http\Response\JSON\OK();
    }
}
