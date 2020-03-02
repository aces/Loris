<?php
namespace LORIS\candidate_parameters;
use LORIS\candidate_profile\CandidateWidget;

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
        }
        return [];
    }
}
