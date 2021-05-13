<?php declare(strict_types=1);
namespace LORIS\dqt\Models;
use \LORIS\LorisInstance as Loris;

class Query implements \JsonSerializable
{
    public function __construct(QueryFields $fields, QueryFilters $filters)
    {
        $this->_fields  = $fields;
        $this->_filters = $filters;
    }

    public function execute(Loris $loris, \User $user): \Traversable
    {
        // Get the sessions that match the filters
        $sessions = $this->_filters->getFilteredSessions($loris, $user);

        // Get the fields values for the matching sessions
        $results = $this->_fields->getSelectedFields($loris, $user, $sessions);

        return $results;
    }

    public function getId(): int
    {
        return 1;
    }

    public function jsonSerialize()
    {
        return [
            'id'                => null,
            'creatorUsername'   => '',
            'creationTimestamp' => '',
            'fields'            => $this->_fields,
            'filters'           => $this->_filters
        ];
    }
}
