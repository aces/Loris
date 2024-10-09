<?php declare(strict_types=1);

namespace LORIS\candidate_parameters;
use LORIS\Data\Scope;
use LORIS\Data\Cardinality;
use LORIS\Data\Dictionary\DictionaryItem;
use LORIS\Data\Types\Enumeration;

/**
 * A CandidateQueryEngine providers a QueryEngine interface to query
 * against general candidate data such as identifiers, DoB, Entity Type,
 * etc.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CandidateQueryEngine extends \LORIS\Data\Query\SQLQueryEngine
{
    /**
     * Return a data dictionary of data types managed by this module.
     * DictionaryItems are grouped into categories and a module may
     * provide 0 or more categories of dictionaryitems.
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary() : iterable
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
                    new Cardinality(Cardinality::UNIQUE),
                ),
            ]
        );

        $demographics = new \LORIS\Data\Dictionary\Category(
            "Demographics",
            "Candidate Demographics",
        );
        $sexList      = array_keys(\Utility::getSexList());
        $t            = new Enumeration(...$sexList);
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
                    $t,
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "EDC",
                    "Expected Data of Confinement",
                    $candscope,
                    new \LORIS\Data\Types\DateType(),
                    new Cardinality(Cardinality::OPTIONAL),
                ),
            ]
        );

        $meta = new \LORIS\Data\Dictionary\Category("Meta", "Other parameters");

        $db = $this->loris->getDatabaseConnection();
        $participantstatus_options = $db->pselectCol(
            "SELECT Description FROM participant_status_options",
            []
        );
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
                    new \LORIS\Data\Types\StringType(255), // FIXME: Make an enum
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "Cohort",
                    "The LORIS cohort used for battery selection",
                    $sesscope,
                    new \LORIS\Data\Types\StringType(255),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "Site",
                    "The Site at which a visit occurred",
                    $sesscope,
                    new \LORIS\Data\Types\Enumeration(...\Utility::getSiteList()),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "EntityType",
                    "The type of entity which this candidate represents",
                    $candscope,
                    new \LORIS\Data\Types\Enumeration('Human', 'Scanner'),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "ParticipantStatus",
                    "The status of the participant within the study",
                    $candscope,
                    new \LORIS\Data\Types\Enumeration(...$participantstatus_options),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "RegistrationSite",
                    "The site at which this candidate was initially registered",
                    $candscope,
                    new \LORIS\Data\Types\Enumeration(...\Utility::getSiteList()),
                    new Cardinality(Cardinality::SINGLE),
                ),
                new DictionaryItem(
                    "RegistrationProject",
                    "The project for which this candidate was initially registered",
                    $candscope,
                    new \LORIS\Data\Types\StringType(255), // FIXME: Make an enum
                    new Cardinality(Cardinality::SINGLE),
                ),
            ]
        );
        return [$ids, $demographics, $meta];
    }
    /**
     * {@inheritDoc}
     *
     * @param \Loris\Data\Dictionary\Category       $cat  The dictionaryItem
     *                                                    category
     * @param \Loris\Data\Dictionary\DictionaryItem $item The item
     *
     * @return string[]
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $cat,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable {
        if ($item->getScope()->__toString() !== 'session') {
            return [];
        }

        // Session scoped variables: VisitLabel, project, site, cohort
        return array_keys(\Utility::getVisitList());
    }

    /**
     * Get the SQL field name to use to refer to a dictionary item.
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The dictionary item
     *
     * @return string
     */
    protected function getFieldNameFromDict(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : string {
        switch ($item->getName()) {
        case 'CandID':
            return 'c.CandID';
        case 'PSCID':
            return 'c.PSCID';
        case 'Site':
            $this->addTable(
                "LEFT JOIN session s ON (s.CandID=c.CandID AND s.Active='Y')"
            );
            $this->addTable('LEFT JOIN psc site ON (s.CenterID=site.CenterID)');
            return 'site.Name';
        case 'RegistrationSite':
            $this->addTable(
                'LEFT JOIN psc rsite'
                . ' ON (c.RegistrationCenterID=rsite.CenterID)'
            );
            return 'rsite.Name';
        case 'Sex':
            return 'c.Sex';
        case 'DoB':
            return 'c.DoB';
        case 'DoD':
            return 'c.DoD';
        case 'EDC':
            return 'c.EDC';
        case 'Project':
            $this->addTable(
                "LEFT JOIN session s ON (s.CandID=c.CandID AND s.Active='Y')"
            );
            $this->addTable(
                'LEFT JOIN Project proj ON (s.ProjectID=proj.ProjectID)'
            );

            return 'proj.Name';
        case 'RegistrationProject':
            $this->addTable(
                'LEFT JOIN Project rproj'
                .' ON (c.RegistrationProjectID=rproj.ProjectID)'
            );
            return 'rproj.Name';
        case 'Cohort':
            $this->addTable(
                "LEFT JOIN session s ON (s.CandID=c.CandID AND s.Active='Y')"
            );
            $this->addTable(
                'LEFT JOIN cohort cohort'
                .' ON (s.CohortID=cohort.CohortID)'
            );
            return 'cohort.title';
        case 'VisitLabel':
            $this->addTable(
                "LEFT JOIN session s ON (s.CandID=c.CandID AND s.Active='Y')"
            );
            return 's.Visit_label';
        case 'EntityType':
            return 'c.Entity_type';
        case 'ParticipantStatus':
            $this->addTable(
                'LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)'
            );
            $this->addTable(
                'LEFT JOIN participant_status_options pso ' .
                'ON (ps.participant_status=pso.ID)'
            );
            return 'pso.Description';
        default:
            throw new \DomainException("Invalid field " . $item->getName());
        }
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - The LORIS dictionary item
     *
     * @return string
     */
    protected function getCorrespondingKeyField(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) {
        // There are no cardinality::many fields in this query engine, so this
        // should never get called
        throw new \Exception(
            "Unhandled Cardinality::MANY field " . $item->getName()
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - The LORIS dictionary item
     *
     * @return string
     */
    public function getCorrespondingKeyFieldType(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : string {
        throw new \Exception(
            "Unhandled Cardinality::MANY field " . $item->getName()
        );
    }
}
