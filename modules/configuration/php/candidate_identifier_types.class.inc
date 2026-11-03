<?php declare(strict_types=1);

/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 8
 *
 * @category Behavioural
 * @package  Main
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\configuration;

/**
 * Candidate_Identifier_Types Class
 *
 * This class is used to configure candidate identifier types.
 *
 * @category Behavioural
 * @package  Main
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Candidate_Identifier_Types extends \NDB_Form
{
    /**
     * Render the candidate identifier type manager with React.
     *
     * @var bool
     */
    public $skipTemplate = true;

    /**
     * Determine whether the user can configure identifier types.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Load candidate identifier types and available projects.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $factory    = \NDB_Factory::singleton();
        $controller = new \LORIS\IdentifierTypeController(
            $factory->database()
        );

        $identifierTypes = [];

        foreach ($controller->getAllIdentifierTypes() as $identifierType) {
            $id = $identifierType->candidateIdentifierTypeID;

            $identifierTypes[$id] = [
                'candidateIdentifierTypeID' => $id,
                'name'                      => $identifierType->name,
                'format'                    => $identifierType->format,
                'isRequired'                => $identifierType->isRequired,
                'isUnique'                  => $identifierType->isUnique,
                'autoGenerate'              => $identifierType->autoGenerate,
                'allowMultiple'             => $identifierType->allowMultiple,
                'projectIDs'                => array_map(
                    static fn($project) => strval($project->getId()),
                    $identifierType->projects
                ),
            ];
        }

        $this->tpl_data['identifierTypes'] = $identifierTypes;
        $this->tpl_data['projects']        = \Utility::getProjectList();
    }

    /**
     * Return the identifier type manager data for the React page.
     *
     * @return array<string, mixed>
     */
    #[\Override]
    function toArray(): array
    {
        return [
            'identifierTypes' => $this->tpl_data['identifierTypes'] ?? [],
            'projects'        => $this->tpl_data['projects'] ?? [],
        ];
    }

    /**
     * Include the configuration stylesheet.
     *
     * @return array<string> CSS dependencies
     */
    #[\Override]
    function getCSSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();

        return array_merge(
            $deps,
            [$baseURL . '/configuration/css/configuration.css']
        );
    }

    /**
     * Add the React entry point for the identifier type manager.
     *
     * @return array<string> JavaScript dependencies
     */
    #[\Override]
    function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();

        return array_merge(
            $deps,
            [$baseURL . '/configuration/js/formCandidateIdentifierTypes.js']
        );
    }
}
