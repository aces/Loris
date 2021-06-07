<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views;

/**
 * This class formats a site object into an array following the API
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Site
{
    private $_site;

    /**
     * Constructor.
     *
     * @param \Site $site The site to format
     */
    public function __construct(\Site $site)
    {
        $this->_site = $site;
    }

    /**
     * Generates the array
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'Name'       => $this->_site->getCenterName(),
            'Alias'      => $this->_site->getSiteAlias(),
            'MRI alias'  => $this->_site->getSiteMRIAlias(),
            'Study site' => $this->_site->isStudySite(),
        ];
    }
}
