<?php
namespace LORIS\candidate_parameters;
use LORIS\candidate_profile\CandidateInfo;
use LORIS\candidate_profile\CandidateWidget;
use LORIS\Data\Scope;
use LORIS\Data\Cardinality;
use LORIS\Data\Dictionary\DictionaryItem;

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Candidate Parameters";
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
        switch($type) {
        case 'candidate':
            $factory = \NDB_Factory::singleton();
            $baseurl = $factory->settings()->getBaseURL();

            $candidate = $options['candidate'];
            if ($candidate === null) {
                return [];
            }

            if (!\NDB_Factory::singleton()->settings()->consentEnabled()) {
                return [];
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

            return [
                new CandidateWidget(
                    "Consent Summary",
                    $baseurl . "/candidate_parameters/js/ConsentWidget.js",
                    "lorisjs.candidate_parameters.ConsentWidget.default",
                    [
                        'Consents' => $consents,
                    ],
                    1,
                    1,
                )
            ];
        case 'candidateinfo':
            // We add 3 extra types of cards to the candidate info card on
            // the candidate dashboard based on the default LORIS candidate_parameter
            // module:
            //
            // 1. The Participant Status.
            // 2. The "Candidate Parameters" category variables which are displayed
            //    in the Candidate Information tab of the Candidate Parameters page.
            // 3. The Caveat flag description/reason for the candidate. (Only if
            //    there is a caveat.)
            //
            // Most other tabs in the candidate_profile page are either duplicates
            // of the information already present (ie. DoB) or complicated enough to
            // merit their own card on the dashboard.
            $factory = \NDB_Factory::singleton();
            $db      = $factory->database();

            $candidate = $options['candidate'];
            if ($candidate === null) {
                return [];
            }

            // Participant Status
            $entries = [
                new CandidateInfo(
                    "Participant Status",
                    $candidate->getParticipantStatusDescription($db) ?: 'N/A',
                ),
            ];

            $caveat = $this->_getCaveatTerm($db, $candidate);
            if ($caveat) {
                $entries[] = $caveat;
            }

            $params = $this->_getCandidateParamTerms($db, $candidate);
            foreach ($params as $term) {
                $entries[] = $term;
            }

            return $entries;
        }
        return [];
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

        if ($caveat['Description'] == 'Other') {
            return new CandidateInfo("Caveat", $caveat['flagged_other']);
        }
        return new CandidateInfo("Caveat", $caveat['Description']);
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
             WHERE ptc.Name='Candidate Parameters' AND pc.CandID=:cid",
            ['cid' => $candidate->getCandID()]
        );

        $entries = [];
        foreach ($candidateparams as $param) {
            $entries[] = new CandidateInfo($param['Description'], $param['Value']);
        }
        return $entries;
    }

    /**
     * Return a data dictionary of data types managed by this module.
     * DictionaryItems are grouped into categories and a module may
     * provide 0 or more categories of dictionaryitems.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance whose data
     *                                    dictionary should be retrieved.
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary(\LORIS\LorisInstance $loris) : iterable
    {
        $candscope = new Scope(Scope::CANDIDATE);
        $sesscope  = new Scope(Scope::SESSION);

        $ids = new \LORIS\Data\Dictionary\Category(
            "Identifiers",
            "Candidate Identifiers"
        );

        $ids = $ids->withItems(
            [
                new DictionaryItem(
                    "CandID",
                    "LORIS Candidate Identifier",
                    $candscope,
                    new \LORIS\Data\Types\IntegerType(999999),
                    new Cardinality(Cardinality::UNIQUE),
                ),
                new DictionaryItem(
                    "PSCID",
                    "Project Candidate Identifier",
                    $candscope,
                    new \LORIS\Data\Types\StringType(255),
                    // PSCIDs aren't unique because scanners candidates
                    // share the same PSCID, but each candidate has
                    // a single PSCID..
                    new Cardinality(Cardinality::SINGLE),
                ),
            ]
        );

        $demographics = new \LORIS\Data\Dictionary\Category(
            "Demographics",
            "Candidate Demographics"
        );
        $demographics = $demographics->withItems(
            [
                new DictionaryItem(
                    "DoB",
                    "Date of Birth",
                    $candscope,
                    new \LORIS\Data\Types\DateType(),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "DoD",
                    "Date of Death",
                    $candscope,
                    new \LORIS\Data\Types\DateType(),
                    new Cardinality(Cardinality::OPTIONAL),
                ),
                new DictionaryItem(
                    "Sex",
                    "Candidate's biological sex",
                    $candscope,
                    new \LORIS\Data\Types\Enumeration('Male', 'Female', 'Other'),
                    new Cardinality(Cardinality::SINGLE),
                ),
            ]
        );

        $meta = new \LORIS\Data\Dictionary\Category("Meta", "Other parameters");
        $meta = $meta->withItems(
            [
                new DictionaryItem(
                    "VisitLabel",
                    "The study visit label",
                    $sesscope,
                    new \LORIS\Data\Types\StringType(255),
                    new Cardinality(Cardinality::UNIQUE),
                ),
                new DictionaryItem(
                    "Project",
                    "The LORIS project to categorize this session",
                    $sesscope,
                    new \LORIS\Data\Types\Enumeration(
                        ...array_values(\Utility::getProjectList())
                    ),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "Subproject",
                    "The LORIS subproject used for battery selection",
                    $sesscope,
                    new \LORIS\Data\Types\Enumeration(
                        ...array_values(\Utility::getSubprojectList())
                    ),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "Site",
                    "The Site at which a visit occurred",
                    $sesscope,
                    new \LORIS\Data\Types\Enumeration(...\Utility::getSiteList()),
                    new Cardinality(Cardinality::SINGLE),
                ),
            ]
        );

        return [$ids, $demographics, $meta];
    }
}
