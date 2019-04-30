<?php declare(strict_types=1);
// This should probably be moved in StudyEntities namespace
namespace LORIS;

class ImageQcStatus
{
    private $_qcstatus;
    private $_selected;

    public function __construct(string $qcstatus = null, bool $selected = null)
    {
        $this->_qcstatus = $qcstatus;
        $this->_selected = $selected;
    }

    public function getQcStatus(): ?string
    {
        return $this->_qcstatus;
    }

    public function isSelected(): ?bool
    {
        return $this->_selected;
    }
}

