<?php declare(strict_types=1);

namespace LORIS\candidates;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The candidates module lists candidates, registers new ones, and shows and
 * edits a single candidate's profile and parameters.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * Routes /candidates/123456 to the profile page of candidate 123456.
     * Every other URL goes to the module's pages.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $candIDStr = trim($request->getAttribute("unhandledURI")->getPath(), '/');
        try {
            $candID    = new CandID($candIDStr);
            $candidate = \Candidate::singleton($candID);

            $request = $request->withAttribute('candidate', $candidate);
            $loris   = $request->getAttribute("loris");
            $page    = $this->loadPage($loris, "profile");

            return $page->process($request, $page);
        } catch (\DomainException | \LORISException $e) {
            // A LORISException means the candidate couldn't be loaded and a
            // DomainException means the CandID format was invalid. Either
            // way the URL belongs to another page, a script or a stylesheet.
            return parent::handle($request);
        }
    }

    /**
     * {@inheritDoc}
     *
     * Any candidate permission opens the module, and each page then checks
     * the permission it needs.
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'data_entry',
                    'access_all_profiles',
                    'candidate_parameter_view',
                    'candidate_parameter_edit',
                ]
            );
    }

    /**
     * Whether the user can see the candidate list.
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool
     */
    private function _canListCandidates(\User $user) : bool
    {
        return $user->hasAnyPermission(['data_entry', 'access_all_profiles']);
    }

    /**
     * Whether the user can see a candidate's parameters.
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool
     */
    private function _canViewParameters(\User $user) : bool
    {
        return $user->hasAnyPermission(
            ['candidate_parameter_view', 'candidate_parameter_edit']
        );
    }

    /**
     * Links to the candidate list, its beta profile view and the New Profile
     * page.
     *
     * @return \LORIS\GUI\MenuItem[]
     */
    public function getMenuItems() : array
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        if (!$this->_canListCandidates($user)) {
            return [];
        }

        $category = $this->getMenuCategory();
        $name     = $this->getLongName();
        $baseURL  = $factory->settings()->getBaseURL();
        $url      = $baseURL . '/' . $this->getName() . '/';

        $items = [
            new \LORIS\GUI\MenuItem($category, $name, $url),
            new \LORIS\GUI\MenuItem(
                $category,
                sprintf(
                    dgettext("candidates", "New %s (Beta)"),
                    $name,
                ),
                $url . "?betaprofile=1"
            ),
        ];
        if ($user->hasPermission('data_entry')) {
            $items[] = new \LORIS\GUI\MenuItem(
                $category,
                dgettext("candidates", "New Profile"),
                $url . "new-profile/"
            );
        }
        return $items;
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Candidate");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("candidates", "Access Profile");
    }

    /**
     * {@inheritDoc}
     *
     * @return bool Whether an api schema is available fro this module.
     */
    public function hasAPISpecification(): bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch ($type) {
        case 'study-progression':
            if (!$this->_canListCandidates($user)) {
                return [];
            }
            return $this->_getStudyProgressionWidgets();
        case 'candidate':
            $widgets = [$this->_getCandidateInfoWidget($user, $options)];
            if ($this->_canViewParameters($user)) {
                $consent = $this->_getConsentWidget($options);
                if ($consent !== null) {
                    $widgets[] = $consent;
                }
            }
            return $widgets;
        case 'candidateinfo':
            if (!$this->_canViewParameters($user)) {
                return [];
            }
            return $this->_getCandidateInfoTerms($options);
        }
        return [];
    }

    /**
     * The dashboard's count of candidates per project.
     *
     * @return \LORIS\GUI\Widget[]
     */
    private function _getStudyProgressionWidgets() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $DB      = $factory->database();
        $data    = $DB->pselectWithIndexKey(
            "SELECT
                ProjectID,
                COUNT(DISTINCT PSCID) AS count,
                CONCAT('$baseURL/candidates/?project=', ProjectName)
                AS url,
                ProjectName
            FROM (
                SELECT
                    c.PSCID,
                    COALESCE(p.ProjectID, p2.ProjectID) AS ProjectID,
                    COALESCE(p.Name, p2.Name) AS ProjectName
                FROM candidate c
                LEFT JOIN session s ON s.CandidateID = c.ID
                LEFT JOIN Project p ON p.ProjectID = s.ProjectID
                JOIN Project p2 ON c.RegistrationProjectID = p2.ProjectID
                WHERE c.Active <> 'N'
                AND s.Active <> 'N'
                AND s.CenterID <> 1
            ) AS sub
            GROUP BY ProjectID, ProjectName;",
            [],
            'ProjectID'
        );
        return [
            new \LORIS\dashboard\DataWidget(
                new \LORIS\GUI\LocalizableString(
                    "loris",
                    "Candidate",
                    "Candidates",
                ),
                $data,
                "",
                'rgb(255, 252, 199)',
            )
        ];
    }

    /**
     * The Candidate Info card on the profile, with the terms every module
     * adds to it.
     *
     * @param \User $user    The user viewing the profile.
     * @param array $options The widget options, holding the candidate.
     *
     * @return CandidateWidget
     */
    private function _getCandidateInfoWidget(
        \User $user,
        array $options
    ) : CandidateWidget {
        $baseurl = \NDB_Factory::singleton()->settings()->getBaseURL();

        $params = [];
        foreach ($this->loris->getActiveModules() as $module) {
            if (!$module->hasAccess($user)) {
                continue;
            }

            $candidateinfo = $module->getWidgets(
                'candidateinfo',
                $user,
                $options,
            );
            foreach ($candidateinfo as $widget) {
                $params[] = $widget;
            }
        }

        return new CandidateWidget(
            dgettext("candidates", "Candidate Info"),
            $baseurl . "/candidates/js/CandidateInfoWidget.js",
            "lorisjs.candidates.CandidateInfoWidget.default.CandidateInfo",
            ['ExtraCandidateInfo' => $params],
            1,
            2,
            -100,
        );
    }

    /**
     * The Consent Summary card on the profile, when consent is enabled.
     *
     * @param array $options The widget options, holding the candidate.
     *
     * @return ?CandidateWidget
     */
    private function _getConsentWidget(array $options) : ?CandidateWidget
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();

        $candidate = $options['candidate'];
        if ($candidate === null || !$factory->settings()->consentEnabled()) {
            return null;
        }

        // The candidate getConsents only returns the types of
        // consents that the candidate has saved, we want to
        // summarize all of the types configured in the database.
        $consents = \Utility::getConsentList();

        foreach ($candidate->getConsents() as $key => $value) {
            $consents[$key] = $value;
        }

        // The $consents array was indexed by the consentID (by
        // both getConsentList and getConsents), which means it'll
        // get serialized as an object. We need to convert it to
        // a 0-indexed array so it gets json serialized as an array.
        $consents = array_values($consents);

        return new CandidateWidget(
            dgettext("candidates", "Consent Summary"),
            $baseurl . "/candidates/js/ConsentWidget.js",
            "lorisjs.candidates.ConsentWidget.default",
            [
                'Consents' => $consents,
            ],
            1,
            1,
        );
    }

    /**
     * The terms this module adds to the Candidate Info card: the participant
     * status, the caveat (only if there is one) and the variables of the
     * "Candidate Parameters" category, as shown in the Candidate Information
     * tab of the parameters page.
     *
     * @param array $options The widget options, holding the candidate.
     *
     * @return CandidateInfo[]
     */
    private function _getCandidateInfoTerms(array $options) : array
    {
        $db = \NDB_Factory::singleton()->database();

        $candidate = $options['candidate'];
        if ($candidate === null) {
            return [];
        }

        $entries = [
            new CandidateInfo(
                dgettext("loris", "Participant Status"),
                $candidate->getParticipantStatusDescription($db)
                ?: dgettext("loris", 'N/A'),
            ),
        ];

        $caveat = $this->_getCaveatTerm($db, $candidate);
        if ($caveat) {
            $entries[] = $caveat;
        }

        foreach ($this->_getCandidateParamTerms($db, $candidate) as $term) {
            $entries[] = $term;
        }

        return $entries;
    }

    /**
     * Return a caveat CandidateInfo card (if applicable)
     *
     * @param \Database  $db        A LORIS database connection
     * @param \Candidate $candidate The candidate being accessed
     *
     * @return ?CandidateInfo
     */
    private function _getCaveatTerm(
        \Database $db,
        \Candidate $candidate
    ) : ?CandidateInfo {
        // Only display the caveat status if there is a caveat.
        $caveat = $db->pselectRow(
            "SELECT flagged_caveatemptor,
                flagged_reason,
                flagged_other,
                co.Description
             FROM candidate c
                JOIN caveat_options co ON (co.ID=c.flagged_reason)
             WHERE CandID=:cid",
            ['cid' => $candidate->getCandID()],
        );

        if ($caveat === null || $caveat['flagged_caveatemptor'] !== 'true') {
            return null;
        }

        $title = dgettext("candidates", "Caveat");
        if ($caveat['Description'] == 'Other') {
            return new CandidateInfo($title, $caveat['flagged_other']);
        }
        return new CandidateInfo($title, $caveat['Description']);
    }

    /**
     * Return a list of CandidateInfo terms to add to a candidate based on the
     * "Candidate Parameters" category.
     *
     * @param \Database  $db        A LORIS database connection
     * @param \Candidate $candidate The candidate being accessed
     *
     * @return CandidateInfo[]
     */
    private function _getCandidateParamTerms(
        \Database $db,
        \Candidate $candidate
    ) : array {
        // Display the same Candidate Parameters as the "Candidate Info"
        // page of the Candidate Parameters page in the candidate info
        // summary. (We may need to further limit these in the future if
        // they're overused and make the card too big.)
        $candidateparams = $db->pselect(
            "SELECT pt.Description, pc.Value
             FROM parameter_type pt
                JOIN parameter_candidate pc USING (ParameterTypeID)
                JOIN parameter_type_category_rel ptcr USING (ParameterTypeID)
                JOIN parameter_type_category ptc USING (ParameterTypeCategoryID)
                JOIN candidate c ON c.ID=pc.CandidateID
             WHERE ptc.Name='Candidate Parameters' AND c.CandID=:cid",
            ['cid' => $candidate->getCandID()]
        );

        $entries = [];
        foreach ($candidateparams as $param) {
            $entries[] = new CandidateInfo($param['Description'], $param['Value']);
        }
        return $entries;
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Query\QueryEngine[]
     */
    public function getQueryEngines() : iterable
    {
        return [new CandidateQueryEngine($this->loris)];
    }
}
