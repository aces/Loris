<?php declare(strict_types=1);
namespace LORIS\dqt\views;
use \LORIS\dqt\Models\Query as DQTQuery;
class Results
{
    public function __construct(DQTQuery $query, \Traversable $results)
    {
        $this->_query   = $query;
        $this->_results = $results;
    }   

    /**
     * Creates an serializable array of this object's data
     e
     * @return array
     */
    public function toArray(): array
    {
        $columns = json_decode(json_encode($this->_query))->fields;
        $headers = array_map(function($c) {
            $category = $c->category;
            $field    = $c->field;
            $visit    = $c->visit;
            return implode(',', [$visit, $category, $field]);
        }, $columns);

        $headersmap = array_flip($headers);

        $data = [];
        $currentpscid = '';
        foreach ($this->_results as $row) {
            list($rowpscid, $rowvisit, $rowcategory, $rowfield) = $row->getKey();

            if (!isset($data[$rowpscid])) {
                $data[$rowpscid] = array_fill(0, count($headers), null);
            }

            $header = implode(',', [$rowvisit, $rowcategory, $rowfield]);
            $index  = $headersmap[$header];
            $data[$rowpscid][$index] = $row->getValue();
        }

        array_walk($data, function(&$v, $k) {
            array_unshift($v, $k);
        });
        array_unshift($headers, 'PSCID');
        return [
            'headers' => $headers,
            'data'    => array_values($data)
        ];
    }
}
