<?php declare(strict_types=1);

namespace LORIS\instrument_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Manage the permissions for access to an instrument.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Permissions extends \NDB_Page
{
    /**
     * The LORIS base path
     *
     * @var string
     */
    private string $_path;

    const PERMISSIONS = [
        'instrument_manager_write'
    ];

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param \LORIS\LorisInstance $loris     The LORIS Instance that is serving
     *                                        the page
     * @param Module               $module    The test name being accessed
     * @param string               $page      The subtest being accessed (may be
     *                                        an empty string)
     * @param string               $id        The identifier for the data to load
     *                                        on this page
     * @param string               $commentID The CommentID to load the data for
     * @param string               $formname  The name to give this form
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        $module,
        $page,
        $id,
        $commentID,
        $formname
    ) {
        $this->skipTemplate = true;
        parent::__construct($loris, $module, $page, $id, $commentID);
    }

    /**
     * Checking permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasAnyPermission(self::PERMISSIONS);
    }

    /**
     * Handle a PSR7 Request for that endpoint.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if ($request->getMethod() != 'POST') {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }

        // Ensure the user is allowed to upload.
        if (! $request->getAttribute('user')->hasPermission(
            'instrument_manager_write'
        )
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $values = json_decode((string) $request->getBody(), true);

        $DB = $this->loris->getDatabaseConnection();
        if (empty($values['instrument'])) {
            return new \LORIS\Http\Response\JSON\BadRequest();
        }
        $testID = $DB->pselectOneInt(
            "SELECT ID FROM test_names WHERE test_name=:tn",
            ['tn' => $values['instrument']],
        );
        if (empty($testID)) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }
        if (empty($values['permissions'])) {
            $DB->delete(
                'testnames_permissions_rel',
                ['TestID' => $testID]
            );
            return new \LORIS\Http\Response\JSON\OK(
                [
                    'message' => 'No permissions required for '
                        . $values['instrument']
                ]
            );
        } else {
            $DB->delete(
                'testnames_permissions_rel',
                ['TestID' => $testID]
            );
            foreach ($values['permissions'] as $permCode) {
                $permID = $DB->pselectOneInt(
                    "SELECT permID FROM permissions WHERE code=:permcode",
                    ['permcode' => $permCode],
                );
                $DB->insert(
                    'testnames_permissions_rel',
                    [
                        'TestID' => $testID,
                        'PermID' => $permID,
                    ]
                );
            }
        }
        return new \LORIS\Http\Response\JSON\OK(
            [
                'message' => 'Updated required permissions for '
                    . $values['instrument']
            ]
        );
    }
}
