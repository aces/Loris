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
 * Creates a representation of an image headers format following the api
 * response specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Full
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
        $headers = $this->_image->getHeaders();

        // There's a few headers that get magically created which
        // aren't header fields, so we manually exclude them.
        unset($headers['md5hash']);
        unset($headers['tarchiveMD5']);
        unset($headers['image_comments']);
        unset($headers['check_pic_filename']);
        unset($headers['jiv_path']);

        return  array(
                 'Meta'    => $this->_formatMeta(),
                 'Headers' => $headers,
                );
    }

    /**
     * Creates an array of this image metadata
     *
     * @return array
     */
    private function _formatMeta(): array
    {
        $candid     = (string) $this->_visit->getCandID();
        $visitlabel = $this->_visit->getVisitLabel();
        $filename   = $this->_image->getFileInfo()->getFilename();

        return array(
                'CandID' => $candid,
                'Visit'  => $visitlabel,
                'File'   => $filename,
               );
    }
}

