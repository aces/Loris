<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dicom_archive;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'dicom_archive_view_allsites',
                    'dicom_archive_view_ownsites',
                ]
            );
    }

    /**
     * Handle a PSR7 Request for the dicom_archive endpoint. Also calls a
     * validation function to ensure necessary configuration settings exist.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        try {
            $this->validateConfig();
        } catch (\ConfigurationException $e) {
            error_log($e);
            return (new \LORIS\Middleware\PageDecorationMiddleware(
                $request->getAttribute("user") ?? new \LORIS\AnonymousUser()
            ))->process(
                $request,
                new \LORIS\Router\NoopResponder(
                    new \LORIS\Http\Error(
                        $request,
                        500,
                        'Required configuration settings for DICOM ' .
                        'anonymization are missing. Cannot continue.'
                    )
                )
            );
        }
        return parent::handle($request);
    }

    /**
     * Checks that the required configuration settings are properly set. Throws
     * a ConfigurationException if not.
     *
     * @return void
     *
     * @throws \ConfigurationException
     */
    function validateConfig(): void
    {
        /* Ensure that all required configuraton settings are properly set
         * before continuing.
         */
        $config        = \NDB_Config::singleton()->getSetting("imaging_modules");
        $configOptions = [
            'patientNameRegex',
            'LegoPhantomRegex',
            'LivingPhantomRegex',
            'patientIDRegex',
        ];
        $configError   = 'Configuration settings missing for DICOM anonymization. ' .
            'Please ensure that the following settings are configured to ' .
            'be valid regular expressions: ';
        foreach ($configOptions as $option) {
            if (!isset($config[$option])) {
                throw new \ConfigurationException(
                    $configError . implode(', ', $configOptions)
                );
            }
        }
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return dgettext("loris", "Imaging");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("dicom_archive", "DICOM Archive");
    }
}
