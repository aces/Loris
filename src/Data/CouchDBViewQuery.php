<?php declare(strict_types=1);

namespace LORIS\Data;

class CouchDBViewQuery
{
    private $_designdoc;
    private $_view;
    private $_params;

    public function __construct(string $designdoc, string $view, array $params)
    {
        $this->_designdoc = $designdoc;
        $this->_view      = $view;
        $this->_params    = $params;
    }

    public function getDesigndoc(): string
    {
        return $this->_designdoc;
    }

    public function getView(): string
    {
        return $this->_view;
    }

    public function getParams(): array
    {
        return $this->_params;
    }
}
