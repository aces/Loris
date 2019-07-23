<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

namespace LORIS;

/**
 * ImageCaveats value object to allow one to type hint function's
 * parameters
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class ImageCaveats
{
    /**
     * Contructor
     * TODO :: Add more descriptive comments on params
     *
     * @param ?string $severity   Severity
     * @param ?string $header     Header
     * @param ?string $value      value
     * @param ?string $validrange validrange
     * @param ?string $validregex validregex
     */
    public function __construct(
        ?string $severity,
        ?string $header,
        ?string $value,
        ?string $validrange,
        ?string $validregex
    ) {
        $this->_severity   = $severity;
        $this->_header     = $header;
        $this->_value      = $value;
        $this->_validrange = $validrange;
        $this->_validregex = $validregex;
    }

    /**
     * Accessor for severity
     *
     * @return ?string
     */
    public function getSeverity(): ?string
    {
        return $this->_severity;
    }

    /**
     * Accessor for header
     *
     * @return ?string
     */
    public function getHeader(): ?string
    {
        return $this->_header;
    }

    /**
     * Accessor for value
     *
     * @return ?string
     */
    public function getValue(): ?string
    {
        return $this->_value;
    }

    /**
     * Accessor for validrange
     *
     * @return ?string
     */
    public function getValidRange(): ?string
    {
        return $this->_validrange;
    }

    /**
     * Accessor for validregex
     *
     * @return ?string
     */
    public function getValidRegex(): ?string
    {
        return $this->_validregex;
    }
}

