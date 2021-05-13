<?php declare(strict_types=1);

namespace LORIS\dqt\Models;
use \LORIS\LorisInstance as Loris;
use \LORIS\dqt\Provisioners\InstrumentsProvisioner;

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
            $key  = $obj->getKey() ?? [''];
            $data = $obj->getDoc()->data ?? null;

            $applicablefields = array_filter(
                $this->_fields,
                function ($f) use ($key) {
                    return $f->getCategoryName() == $key[0] && $f->getVisitlabel() == $key[2];
                }
            );

            if (empty($applicablefields)) {
                continue;
            }

            $values = [];
            foreach ($applicablefields as $field) {
                $fieldname          = $field->getFieldname();
                $values[$fieldname] = $data->$fieldname ?? 'N/A';
            }

            $string = json_encode(
                [
                    'key'  => $key,
                    'data' => $values
                ]
            );

            yield $string;
        }
    }

    public function jsonSerialize()
    {
        return $this->_fields;
    }
}
