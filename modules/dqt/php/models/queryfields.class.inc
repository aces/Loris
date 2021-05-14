<?php declare(strict_types=1);

namespace LORIS\dqt\Models;
use \LORIS\LorisInstance as Loris;
use \LORIS\dqt\Provisioners\InstrumentsProvisioner;
use \LORIS\dqt\Models\DataInstances\QueryResultItem;

class QueryFields implements \JsonSerializable
{
    private $_fields = [];

    public function __construct(array $fields)
    {
        $this->_fields = array_map(
            '\LORIS\dqt\Models\QueryFields::_formatFields',
            $fields
        );
    }

    private static function _formatFields(array $item)
    {
        // Validate required properties
        $cat = $item['categoryname'] ?? null;
        if ($cat === null) {
            throw new \LorisException('SelectedFieldsResults:: category missing.');
        }

        $field = $item['fieldname'] ?? null;
        if ($field === null) {
            throw new \LorisException('SelectedFieldsResults:: field missing.');
        }

        $visit = $item['visitlabel'] ?? null;
        if ($visit === null) {
            throw new \LorisException('SelectedFieldsResults:: visit missing.');
        }

        return new QueryField($cat, $field, $visit);
    }

    public function getSelectedFields(Loris $loris, \User $user, \Traversable $sessions): \Traversable
    {
        foreach ($this->_createdKeysChunks($sessions) as $keys) {
            yield from $this->_getResultBatch($loris, $user, $keys);
        }
    }

    private function _createdKeysChunks(\Traversable $sessions): \Traversable
    {
        foreach ($sessions as $count => $desired) {
            foreach ($this->_fields as $field){
                $instrument = $field->getCategoryName();
                $pscid      = $desired->getPSCID();
                $visitlabel = $desired->getVisitlabel();

                if ($field->getVisitlabel() != $visitlabel) {
                    continue;
                }

                $keys[] = [$instrument,$pscid,$visitlabel];
                if (++$count % 25000 === 0) {
                    yield $keys;
                    $keys = null;
                }
            }
        }

        if ($keys !== null) {
            yield $keys;
            $keys = null;
        }
    }

    /**
     * Trusting php copy-on-write strategy here. Do not modify $keys
     */
    private function _getResultBatch(Loris $loris, \User $user, array &$keys): \Traversable
    {
        $prov = new InstrumentsProvisioner($loris);

        $prov = $prov->withParams(['keys' => $keys]);
        $keys = null;

        // Limit the returned data to the selected fields.
        foreach ($prov->execute($user) as $obj) {
            list($category, $pscid, $visit) = $obj->getKey();
            $data = $obj->getDoc()['data'] ?? [];

            $applicablefields = array_filter(
                $this->_fields,
                function ($f) use ($category, $visit) {
                    $c = $f->getCategoryName();
                    $v = $f->getVisitlabel();
                    return $c == $category && $v == $visit;
                }
            );

            if (empty($applicablefields)) {
                continue;
            }

            foreach ($applicablefields as $field) {
                $fieldname = $field->getFieldname();
                yield new QueryResultItem(
                    [$pscid, $visit, $category, $fieldname],
                    $data[$fieldname] 
                );
            }
        }
    }

    public function jsonSerialize()
    {
        return $this->_fields;
    }
}
