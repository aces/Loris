<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use LORIS\electrophysiology_browser\Models\ElectrophysioFile;

/**
 * Contains the Split_Data class used for electrophysiological browser
 *
 * PHP Version 7
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Split_Data extends \NDB_Page
{
    /**
     * Handle how to operate all the files.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $user = \NDB_Factory::singleton()->user();

        switch ($request->getMethod()) {
        case 'POST':
            if (!($user->hasPermission('electrophysiology_browser_view_allsites')
                || ($user->hasPermission('electrophysiology_browser_view_site')
                && $user->hasStudySite()))
            ) {
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            }

            // Parse POST request body.
            $values = (array)$request->getParsedBody();

            if (!isset($values['physioFileID'])
                || !isset($values['splitIndex'])
            ) {
                return (new \LORIS\Http\Response\JSON\BadRequest());
            }

            return new \LORIS\Http\Response\JSON\OK(
                (new ElectrophysioFile(
                    $this->loris,
                    intval($values['physioFileID'])
                ))->getSplitData(intval($values['splitIndex']))
            );
        default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["POST"]
            ));
        }
    }
}
