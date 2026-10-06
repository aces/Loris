<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It handles the basic routing for the module.
 *
 * PHP Version 8
 *
 * @category   API
 * @package    Main
 * @subpackage Login
 * @author     Saagar Arya <saagar.arya@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\policy_tracker;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Core
 * @package    Main
 * @subpackage Login
 * @author     Saagar Arya <saagar.arya@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Admin");
    }

    /**
     * Route policy tracker page and JSON endpoints.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $route = $this->_getRoute($request);
        if ($route === 'decisions'
            && $request->getMethod() === 'GET'
            && !$this->_hasDecisionAccess($request)
            && !$this->_hasEditAccess($request)
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "Permission denied"
            );
        }

        $editRoutes = ['options', 'new-version', 'translation'];
        if (in_array($route, $editRoutes, true)
            && !$this->_hasEditAccess($request)
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "Permission denied"
            );
        }

        if ($route === 'decisions' && $request->getMethod() === 'GET') {
            return new \LORIS\Http\Response\JSON\OK(
                $this->_getDecisionData($request)
            );
        }

        if ($route === 'options' && $request->getMethod() === 'GET') {
            return new \LORIS\Http\Response\JSON\OK($this->_getOptions());
        }

        if ($route === 'new-version' && $request->getMethod() === 'POST') {
            return $this->_createNewPolicyVersion($request);
        }

        if ($route === 'translation' && $request->getMethod() === 'POST') {
            return $this->_savePolicyTranslation($request);
        }

        if ($route === 'policies' && $request->getMethod() === 'POST') {
            return $this->_savePolicyDecision($request);
        }

        if (in_array($route, ['decisions', 'options'], true)) {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }

        if (in_array($route, ['new-version', 'translation', 'policies'], true)) {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }

        return parent::handle($request);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("policy_tracker", "Policy Tracker");
    }

    /**
     * Get the module-local route name from the request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return string
     */
    private function _getRoute(ServerRequestInterface $request) : string
    {
        $moduleURI = $request->getAttribute("unhandledURI");
        $path      = $moduleURI === null
            ? $request->getUri()->getPath()
            : $moduleURI->getPath();
        return explode('/', trim($path, '/'))[0] ?? '';
    }

    /**
     * Decode a JSON request body.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return array
     */
    private function _getJSONBody(ServerRequestInterface $request) : array
    {
        $body = json_decode($request->getBody()->getContents(), true);
        return is_array($body) ? $body : [];
    }

    /**
     * Check whether the request user can view policy decisions.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return bool
     */
    private function _hasDecisionAccess(ServerRequestInterface $request) : bool
    {
        $user = $request->getAttribute("user");
        return $user instanceof \User
            && $user->hasPermission('view_policy_decisions');
    }

    /**
     * Check whether the request user can edit policies.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return bool
     */
    private function _hasEditAccess(ServerRequestInterface $request) : bool
    {
        $user = $request->getAttribute("user");
        return $user instanceof \User
            && $user->hasPermission('edit_policies');
    }

    /**
     * Get the policy decisions used by the frontend table.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return array
     */
    private function _getDecisionData(ServerRequestInterface $request) : array
    {
        $canViewDecisions = $this->_hasDecisionAccess($request);
        $decisions        = [];
        $fieldOptions     = [];
        if ($canViewDecisions) {
            $db           = $this->loris->getDatabaseConnection();
            $decisions    = iterator_to_array(
                $db->pselect(
                    "SELECT
                        upd.ID,
                        u.UserID AS Username,
                        COALESCE(
                            NULLIF(u.Real_name, ''),
                            NULLIF(
                                CONCAT_WS(' ', u.First_name, u.Last_name),
                                ''
                            ),
                            u.UserID
                        ) AS User,
                        p.Name AS Policy,
                        p.Version,
                        m.Name AS Module,
                        upd.Decision,
                        upd.DecisionDate AS `Decision Date`
                    FROM user_policy_decision upd
                        JOIN users u ON u.ID=upd.UserID
                        JOIN policies p ON p.PolicyID=upd.PolicyID
                        JOIN modules m ON m.ID=p.ModuleID
                    ORDER BY upd.DecisionDate DESC",
                    []
                )
            );
            $fieldOptions = [
                'modules'  => $this->_getModuleOptions(),
                'policies' => $this->_getPolicyNameOptions(),
                'decision' => [
                    'Accepted' => dgettext("policy_tracker", "Accepted"),
                    'Declined' => dgettext("policy_tracker", "Declined"),
                ],
            ];
        }

        return [
            'Data'             => $decisions,
            'canViewDecisions' => $canViewDecisions,
            'canEditPolicies'  => $this->_hasEditAccess($request),
            'fieldOptions'     => $fieldOptions,
        ];
    }

    /**
     * Get policy and translation options used by the editor forms.
     *
     * @return array
     */
    private function _getOptions() : array
    {
        $db = $this->loris->getDatabaseConnection();
        return [
            'modules'      => iterator_to_array(
                $db->pselect(
                    "SELECT ID, Name FROM modules ORDER BY Name",
                    []
                )
            ),
            'policies'     => iterator_to_array(
                $db->pselect(
                    "SELECT
                        p.PolicyID,
                        p.Name,
                        p.Version,
                        p.ModuleID,
                        m.Name AS ModuleName,
                        p.PolicyRenewalTime,
                        p.PolicyRenewalTimeUnit,
                        p.Content,
                        p.SwalTitle,
                        p.HeaderButton,
                        p.HeaderButtonText,
                        p.Active,
                        p.AcceptButtonText,
                        p.DeclineButtonText
                    FROM policies p
                        JOIN modules m ON m.ID=p.ModuleID
                    ORDER BY p.Name, p.Version DESC",
                    []
                )
            ),
            'languages'    => iterator_to_array(
                $db->pselect(
                    "SELECT language_id, language_code, language_label
                    FROM language
                    ORDER BY language_label",
                    []
                )
            ),
            'translations' => iterator_to_array(
                $db->pselect(
                    "SELECT
                        PolicyID,
                        LanguageID,
                        Content,
                        SwalTitle,
                        HeaderButtonText,
                        AcceptButtonText,
                        DeclineButtonText
                    FROM policiesI18n",
                    []
                )
            ),
        ];
    }

    /**
     * Persist a user's decision from the existing policy modal endpoint.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _savePolicyDecision(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $body   = $this->_getJSONBody($request);
        $module = $this->loris->getModule($body['ModuleName'] ?? '');
        $page   = new \NDB_Page($this->loris, $module, '', '', '');
        $page->saveUserPolicyDecision(
            $this->loris,
            $body['PolicyName'] ?? '',
            $body['decision'] ?? ''
        );
        return new \LORIS\Http\Response\JSON\OK(
            ['message' => 'Policy decision saved successfully']
        );
    }

    /**
     * Create a new version of an existing policy.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _createNewPolicyVersion(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $body     = $this->_getJSONBody($request);
        $policyID = intval($body['PolicyID'] ?? 0);
        if ($policyID <= 0) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Missing policy"
            );
        }

        $db     = $this->loris->getDatabaseConnection();
        $policy = $this->_getPolicyByID($policyID);
        if ($policy === null) {
            return new \LORIS\Http\Response\JSON\NotFound(
                "Policy not found"
            );
        }

        $version = $this->_getNextPolicyVersion(
            strval($body['Name'] ?? $policy['Name']),
            intval($body['ModuleID'] ?? $policy['ModuleID'])
        );

        $db->unsafeinsert(
            'policies',
            [
                'Name'                  => $body['Name'] ?? $policy['Name'],
                'Version'               => $version,
                'ModuleID'              => intval(
                    $body['ModuleID'] ?? $policy['ModuleID']
                ),
                'PolicyRenewalTime'     => intval(
                    $body['PolicyRenewalTime']
                    ?? $policy['PolicyRenewalTime']
                ),
                'PolicyRenewalTimeUnit' => $this->_enumValue(
                    $body['PolicyRenewalTimeUnit']
                    ?? $policy['PolicyRenewalTimeUnit'],
                    ['D', 'M', 'Y', 'H'],
                    'D'
                ),
                'Content'               => $body['Content']
                    ?? $policy['Content'],
                'SwalTitle'             => $body['SwalTitle']
                    ?? $policy['SwalTitle'],
                'HeaderButton'          => $this->_enumValue(
                    $body['HeaderButton'] ?? $policy['HeaderButton'],
                    ['Y', 'N'],
                    'Y'
                ),
                'HeaderButtonText'      => $body['HeaderButtonText']
                    ?? $policy['HeaderButtonText'],
                'Active'                => $this->_enumValue(
                    $body['Active'] ?? $policy['Active'],
                    ['Y', 'N'],
                    'Y'
                ),
                'AcceptButtonText'      => $body['AcceptButtonText']
                    ?? $policy['AcceptButtonText'],
                'DeclineButtonText'     => $body['DeclineButtonText']
                    ?? $policy['DeclineButtonText'],
            ]
        );

        return new \LORIS\Http\Response\JSON\OK(
            ['PolicyID' => $db->lastInsertID, 'Version' => $version]
        );
    }

    /**
     * Save the translated text for a policy.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _savePolicyTranslation(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $body       = $this->_getJSONBody($request);
        $policyID   = intval($body['PolicyID'] ?? 0);
        $languageID = intval($body['LanguageID'] ?? 0);
        if ($policyID <= 0 || $languageID <= 0) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Missing policy or language"
            );
        }

        $this->loris->getDatabaseConnection()->unsafeInsertOnDuplicateUpdate(
            'policiesI18n',
            [
                'PolicyID'          => $policyID,
                'LanguageID'        => $languageID,
                'Content'           => $body['Content'] ?? null,
                'SwalTitle'         => $body['SwalTitle'] ?? null,
                'HeaderButtonText'  => $body['HeaderButtonText'] ?? null,
                'AcceptButtonText'  => $body['AcceptButtonText'] ?? null,
                'DeclineButtonText' => $body['DeclineButtonText'] ?? null,
            ]
        );

        return new \LORIS\Http\Response\JSON\OK(
            ['message' => 'Policy translation saved successfully']
        );
    }

    /**
     * Fetch a policy row.
     *
     * @param int $policyID The policy ID
     *
     * @return ?array
     */
    private function _getPolicyByID(int $policyID) : ?array
    {
        $rows = iterator_to_array(
            $this->loris->getDatabaseConnection()->pselect(
                "SELECT * FROM policies WHERE PolicyID=:PolicyID",
                ['PolicyID' => $policyID]
            )
        );
        return $rows[0] ?? null;
    }

    /**
     * Get the next version for a policy name and module.
     *
     * @param string $name     The policy name
     * @param int    $moduleID The module ID
     *
     * @return int
     */
    private function _getNextPolicyVersion(string $name, int $moduleID) : int
    {
        $rows = iterator_to_array(
            $this->loris->getDatabaseConnection()->pselect(
                "SELECT COALESCE(MAX(Version), 0) + 1 AS NextVersion
                FROM policies
                WHERE Name=:Name AND ModuleID=:ModuleID",
                ['Name' => $name, 'ModuleID' => $moduleID]
            )
        );
        return intval($rows[0]['NextVersion'] ?? 1);
    }

    /**
     * Return a whitelisted enum value.
     *
     * @param mixed  $value   The submitted value
     * @param array  $allowed Allowed values
     * @param string $default Default value
     *
     * @return string
     */
    private function _enumValue($value, array $allowed, string $default) : string
    {
        $value = strval($value);
        return in_array($value, $allowed, true) ? $value : $default;
    }

    /**
     * Get module filter options.
     *
     * @return array
     */
    private function _getModuleOptions() : array
    {
        $modules = [];
        foreach ($this->loris->getDatabaseConnection()->pselect(
            "SELECT Name FROM modules ORDER BY Name",
            []
        ) as $module) {
            $modules[$module['Name']] = $module['Name'];
        }
        return $modules;
    }

    /**
     * Get policy filter options.
     *
     * @return array
     */
    private function _getPolicyNameOptions() : array
    {
        $policies = [];
        foreach ($this->loris->getDatabaseConnection()->pselect(
            "SELECT DISTINCT Name FROM policies ORDER BY Name",
            []
        ) as $policy) {
            $policies[$policy['Name']] = $policy['Name'];
        }
        return $policies;
    }
}
