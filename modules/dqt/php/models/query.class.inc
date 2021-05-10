<?php declare(strict_types=1);
namespace LORIS\dqt\Models;

class Query implements \JsonSerializable
{
    public function __construct(\User $user, QueryFields $fields, QueryFilters $filters)
    {
        $this->_user    = $user;
        $this->_fields  = $fields;
        $this->_filters = $filters;
        $this->_hash    = sha1(json_encode($this));
    }

    public function execute(): \Traversable
    {
        // Get the sessions that match the filters
        $sessions = $this->_filters->getFilteredSessions($this->_user);

        // Get the fields values for the matching sessions
        $results  = $this->_fields->getSelectedFields($this->_user, $sessions);

        return $results;
    }

    public function hasSQLTableRow(): array
    {
        return [
            'creator_userid' => $this->_user->getId(),
            'content' => json_encode($this)
        ];
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
