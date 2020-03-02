<?php declare(strict_types=1);
namespace LORIS\candidate_profile;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * The candidate_profile module overrides the default routing to ensure that
     * /candidate_profile/123456 goes to the candidate_profile page for candidate
     * 123456.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $candIDStr = ltrim($request->getURI()->getPath(), '/');
        try {
            $candID    = new CandID($candIDStr);
            $candidate = \Candidate::singleton($candID);

            $request = $request->withAttribute('candidate', $candidate);
            $page    = $this->loadPage("candidate_profile");
            return $page->process($request, $page);
        } catch (\DomainException | \LORISException $e) {
            // A LORISException means the \Candidate::singleton couldn't
            // load the candidate (ie because the CandID doesn't exist
            // in the database.) A \DomainException means the CandID format
            // was invalid. In either case, let the parent handle the request
            // and return a 404 if appropriate. (or it could be a js or css
            // or other type of URL for the module..)
            return parent::handle($request);
        }
    }


    /**
     * {@inheritDoc}
     *
     * @return string
     */
    public function getLongName() : string
    {
        return "Candidate Profile";
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

            $DB      = $factory->database();
            $modules = \Module::getActiveModules($DB);

            $params = [];
            foreach ($modules as $module) {
                if (!$module->hasAccess($user)) {
                    continue;
                }

                $candidateinfo = $module->getWidgets(
                    'candidateinfo',
                    $user,
                    $options,
                );
                foreach($candidateinfo as $widget) {
                    $params[] = $widget;
                }
            }

            return [
                new CandidateWidget(
                    "Candidate Info",
                    $baseurl . "/candidate_profile/js/CandidateInfo.js",
                    "lorisjs.candidate_profile.CandidateInfo.CandidateInfo",
                    ['ExtraCandidateInfo' => $params],
                    1,
                    1,
                    -100,
                ),
            ];
        }
        return [];

    }
}
