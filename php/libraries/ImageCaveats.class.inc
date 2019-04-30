<?php declare(strict_types=1);
namespace LORIS;
class ImageCaveats
{
    public function __construct(
        string $severity = null,
        string $header = null,
        string $value = null,
        string $validrange = null,
        string $validregex = null
    ) {
        $this->_severity   = $severity;
        $this->_header     = $header;
        $this->_value      = $value;
        $this->_validrange = $validrange;
        $this->_validregex = $validregex;
    }

    public function getSeverity()
    {
        return $this->_severity;
    }

    public function getHeader()
    {
        return $this->_header;
    }

    public function getValue()
    {
        return $this->_value;
    }

    public function getValidRange()
    {
        return $this->_validrange;
    }

    public function getValidRegex()
    {
        return $this->_validregex;
    }

}
