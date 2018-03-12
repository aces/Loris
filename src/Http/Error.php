<?php
/**
 * This file implements a HTTP error, a simple wrapper which provide
 * a html response using smarthy templates. It rely on the Diactoros implementation
 * of the Response object to provide the reason phrase according to the status code.
 *
 * PHP Version 7
 *
 * @category PSR7
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\Http;
use \Zend\Diactoros\Response\HtmlResponse;
use \Psr\Http\Message\ServerRequestInterface;

/**
 * A html representation of a http error
 *
 * @category PSR7
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Error extends HtmlResponse
{
    /**
     * Takes the value $val and converts it to a PSR7 StreamInterface.
     *
     * @param string $val The string value to convert to a stream.
     */
    public function __construct(ServerRequestInterface $request, int $status, string $message = '')
    {
        // TODO :: Extract baseurl from request. The '/' might break if the DirectoryRoot is different
        $tpl_data = array(
                     'message' => $message,
                     'baseurl' => '/',
                    );
        $template_file = (string) $status . '.tpl';
        $body          = (new \Smarty_neurodb())
            ->assign($tpl_data)
            ->fetch($template_file);

        parent::__construct(
            (new \LORIS\Http\StringStream($body)),
            $status,
            array()
        );
    }
}
