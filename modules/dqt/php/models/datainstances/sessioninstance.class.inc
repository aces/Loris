<?php declare(strict_types=1);

namespace LORIS\dqt\Models\DataInstances;
use \LORIS\Data\DataInstance;

class SessionInstance implements DataInstance
{
    private $_pscid;
    private $_visitlabel;

    public function __construct(array $session)
    {
        if (count($session) != 2) {
            throw new \UnexpectedValueException("SessionRow must be of length 2");
        }

        $this->_pscid      = $session[0];
        $this->_visitlabel = $session[1];
    }

    public function getPSCID(): string
    {
        return $this->_pscid;
    }

    public function getVisitlabel(): string
    {
        return $this->_visitlabel;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return [
            $this->_pscid,
            $this->_visitlabel
        ];
    }
}
