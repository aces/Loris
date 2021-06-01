<?php declare(strict_types=1);

namespace LORIS\dqt\Models;
use \LORIS\LorisInstance as Loris;
use \LORIS\Data\CouchDBListQuery;
use \LORIS\dqt\Provisioners\FilteredSessionsProvisioner;
use \LORIS\dqt\Models\Filters\ContainsFilter;
use \LORIS\dqt\Models\Filters\NotEqualFilter;
use \LORIS\dqt\Models\Mappers\SessionRowMapper;

/**
 * A QueryFilter sends a request to CouchDB to retreive all matching sessions.
 */
class QueryFilter implements QueryFilters
{
    private $_operator;
    private $_category;
    private $_field;
    private $_visits;
    private $_value;

    public function __construct(string $operator, string $category, string $field, ?string $visit, ?string $value)
    {
        $this->_operator = $operator;
        $this->_category = $category;
        $this->_field    = $field;
        $this->_visit    = $visit;
        // Backward compatibility:: This should use the datadictonnary to match the datatype
        // instead of guessing with is_numeric.
        // It is thightly coupled with the "search" view creation function
        $this->_value    = is_numeric($value) ? $value : '"'.$value.'"';
    }

    public function getFilteredSessions(Loris $loris, \User $user): \Traversable
    {
        $provisioner = new FilteredSessionsProvisioner(
            $loris,
            new QueryField(
                $this->_category,
                $this->_field,
                $this->_visit
            )
        );

        $params = ["reduce" => "false"];

        switch($this->_operator) {
        case 'contains':
            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",{}]';

            $provisioner = $provisioner
                ->filter(new ContainsFilter($this->_value));
            break;

        case 'isNull':
            $this->_value = null;
        case 'equal':
            $params["key"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",'.$this->_value.']';
            break;

        case 'isNotNull':
            $this->_value = null;
        case 'notEqual':
            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",{}]';

            $provisioner = $provisioner
                ->filter(new NotEqualFilter($this->_value));
            break;

        case 'lessThanEqual':
            // Strict lessThan could be implementing using the 'inclusive_end' param.
            $params["startkey"]      = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'"]';
            $params["endkey"]        = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",'.$this->_value.']';
            $params["inclusive_end"] = "true";
            break;

        case 'greaterThanEqual':
            // Strict greaterThan could be implementing using the 'inclusive_end'
            // And descending order params.
            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",'.$this->_value.']';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",{}]';
            break;

        case 'starstWith':
            // PHP doesn't have any /u9999 unicode escaping, so
            // we use mb_convert_encoding to embed a high
            // unicode character
            $nextvalue = $value . mb_convert_encoding(
                '&#x9999;',
                'UTF-8',
                'HTML-ENTITIES'
            );
            // TODO :: Test how this bahaves with a numeric value (e.g starts with 20 --> 20.1, 2000, 20e^-10 ??)
            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'",'.$this->_value.']';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'","'.$this->_visit.'","'.$nextvalue.'"]';
            break;

        default:
            throw new \LorisException('Unsupported QueryField operator');
        }

        // NOTE :: SessionRowMapper must be added after the filters because they use SessionResultRow objects.
        $provisioner = $provisioner
            ->withParams($params)
            ->map(new SessionRowMapper());

        return $provisioner->execute($user);
    }

    public function jsonSerialize()
    {
        return [
            'type'     => 'filter',
            'operator' => $this->_operator,
            'category' => $this->_category,
            'field'    => $this->_field,
            'visit'    => $this->_visit,
            'value'    => $this->_value,
        ];
    }
}

