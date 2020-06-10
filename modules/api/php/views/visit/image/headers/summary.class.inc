<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views\Visit\Image\Headers;

/**
 * Creates a representation of an image summary headers format following the api
 * response specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Summary
{

    /**
     * The requested Image
     *
     * @var \LORIS\Image
     */
    private $_image;

    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * Constructor which sets the instance variables based on the provided image.
     *
     * @param \Timepoint   $visit The requested visit
     * @param \LORIS\Image $image The requested image
     */
    public function __construct(\Timepoint $visit, \LORIS\Image $image)
    {
        $this->_visit = $visit;
        $this->_image = $image;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return  array(
            'Meta'        => $this->_formatMeta(),
            'Physical'    => $this->_formatPhysical(),
            'Description' => $this->_formatDescription(),
            'Dimensions'  => $this->_formatDimensions(),
            'ScannerInfo' => $this->_formatScannerInfo(),
        );
    }

    /**
     * Creates an array of this image metadata
     *
     * @return array
     */
    private function _formatMeta(): array
    {
        $candid     = $this->_visit->getCandID();
        $visitlabel = $this->_visit->getVisitLabel();
        $filename   = $this->_image->getFileInfo()->getFilename();

        return array(
            'CandID' => $candid,
            'Visit'  => $visitlabel,
            'File'   => $filename,
        );
    }

    /**
     * Creates an array of "Physical" headers
     *
     * @return array
     */
    private function _formatPhysical(): array
    {
        $te = $this->_image->getHeader('acquisition:echo_time');
        $tr = $this->_image->getHeader('acquisition:repetition_time');
        $ti = $this->_image->getHeader('acquisition:inversion_time');
        $st = $this->_image->getHeader('acquisition:slice_thickness');

        return array(
            'TE'             => $te,
            'TR'             => $tr,
            'TI'             => $ti,
            'SliceThickness' => $st,
        );
    }

    /**
     * Creates an array of "Description" headers
     *
     * @return array
     */
    private function _formatDescription(): array
    {
        $sn = $this->_image->getHeader('acquisition:protocol');
        $sd = $this->_image->getHeader('acquisition:series_description');

        return array(
            'SeriesName'        => $sn,
            'SeriesDescription' => $sd,
        );
    }

    /**
     * Creates an array of "Dimension" headers
     *
     * @return array
     */
    private function _formatDimensions(): array
    {

        $dimensions = array(
            'XSpace' => $this->_getDimension('xspace'),
            'YSpace' => $this->_getDimension('yspace'),
            'ZSpace' => $this->_getDimension('zspace'),
        );

        $order = $this->_image->getHeader("image:dimorder");
        if (count(explode(',', $order)) == 4) {
            $dimensions['TimeDimension'] = $this->_getDimension('time');
        }

        return $dimensions;
    }

    /**
     * Query the image for a spacific dimension
     *
     * @param string $dim The name of the dimension.
     *
     * @return array
     */
    private function _getDimension(string $dim): array
    {
        return array(
            'Length'   => $this->_image->getHeader("$dim:length"),
            'StepSize' => $this->_image->getHeader("$dim:step"),
        );
    }

    /**
     * Creates an array of "ScannerInfo" headers
     *
     * @return array
     */
    private function _formatScannerInfo(): array
    {
        $manufacturer    = $this->_image->getHeader('study:manufacturer');
        $model           = $this->_image->getHeader('study:device_model');
        $softwareversion = $this->_image->getHeader('study:software_version');
        $serialnumber    = $this->_image->getHeader('study:serial_no');
        $fieldstrength   = $this->_image->getHeader('study:field_value');

        return array(
            'Manufacturer'    => $manufacturer,
            'Model'           => $model,
            'SoftwareVersion' => $softwareversion,
            'SerialNumber'    => $serialnumber,
            'FieldStrength'   => $fieldstrength,
        );
    }
}

