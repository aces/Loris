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

namespace LORIS\Api\Views\Visit\Image\Format;

/**
 * Creates a representation of an image brainbrowser format following the api
 * response specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Brainbrowser
{

    private $_image;

    /**
     * Constructor which sets the instance variables based on the provided image.
     *
     * @param \LORIS\Image $image The requested image
     */
    public function __construct(\LORIS\Image $image)
    {
        $this->_image = $image;
    }

    /**
     * Creates an serializable array of this object's data
     * TODO :: Can time dimention always be included?
     *
     * @return array
     */
    public function toArray(): array
    {
        $order = $this->_image->getHeader("image:dimorder");

        $responsearray = array(
                          'order'  => $order,
                          'xspace' => $this->_getDimension('xspace'),
                          'yspace' => $this->_getDimension('yspace'),
                          'zspace' => $this->_getDimension('zspace'),
                         );

        if (count(explode(',', $order)) == 4) {
            $responsearray['time'] = $this->_getDimension('time');
        }

        return $responsearray;
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
                'space_length' => $this->_image->getHeader("$dim:length"),
                'start'        => $this->_image->getHeader("$dim:start"),
                'step'         => $this->_image->getHeader("$dim:step"),
               );
    }
}

