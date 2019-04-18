<?php declare(strict_types=1);
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7.2
 *
 * @category   Module
 * @package    Main
 * @subpackage Biobank
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Module
 * @package    Main
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**                                                                         
     * The default handler for a module routes to a page of the first component of
     * the URL's name, or the same name as the module if serving the root of the
     * module.                                                                  
     *                                                                          
     * Modules extend PrefixRouter, so that the parent handler knows that the   
     * css, static, and js routes should be routed through the file system to   
     * retrieve the files before trying to load any specific pages.             
     *                                                                          
     * @param ServerRequestInterface $request The incoming PSR7 request         
     *                                                                          
     * @return ResponseInterface the outgoing PSR7 response                     
     */                                                                         
    public function handle(ServerRequestInterface $request) : ResponseInterface 
    {                                                                           
        $resp = parent::handle($request);                                       
        if ($resp->getStatusCode() != 404) {                                    
            $path = $request->getURI()->getPath();                              
            if (preg_match('/(\.css)$/', $path) == 1) {                         
                $resp = $resp->withHeader(                                      
                    "Content-Type",                                             
                    "text/css"                                                  
                );                                                              
            }                                                                   
            if (preg_match('/(\.js)$/', $path) == 1) {                          
                $resp = $resp->withHeader(                                      
                    "Content-Type",                                             
                    "application/javascript"                                    
                );                                                              
            }                                                                   
            return $resp;                                                       
        }                                                                       
                                                                                
        $pagename = $this->getName();                                           
        $path     = trim($request->getURI()->getPath(), "/");                   
        if ($path == 'optionsendpoint' ||                                       
            $path == 'poolendpoint' ||                                          
            $path == 'containerendpoint' ||                                     
            $path == 'specimenendpoint') {                                      
            // There is a subpage                                               
            $pagename = explode("/", $path)[0];                                 
        }                                                                       
                                                                                
        try {                                                                   
            $user = $request->getAttribute("user") ?? new \LORIS\AnonymousUser();
            $page = $this->loadPage($pagename);                                 
            // FIXME: Hack required for breadcrumbs. This should be removed,    
            // but some tests depend on it.                                     
            if ($this->getName() === $pagename) {                               
                $_REQUEST['test_name'] = $pagename;                             
            } else {                                                            
                $_REQUEST['subtest'] = $pagename;                               
            }                                                                   
                                                                                
            $user = $request->getAttribute("user") ?? new \LORIS\AnonymousUser();
            if ($page->_hasAccess($user) !== true) {                            
                return (new \LORIS\Middleware\PageDecorationMiddleware(         
                    $user                                                       
                ))->process(                                                    
                    $request,                                                   
                    new \LORIS\Router\NoopResponder(                            
                        new \LORIS\Http\Error(                                  
                            $request,                                           
                            403,                                                
                            "You do not have access to this page."              
                        )                                                       
                    )                                                           
                );                                                              
            }                                                                   
        } catch (\NotFound $e) {                                                
            return (new \LORIS\Middleware\PageDecorationMiddleware(             
                $user                                                           
            ))->process(                                                        
                $request,                                                       
                new \LORIS\Router\NoopResponder(                                
                    new \LORIS\Http\Error(                                      
                        $request,                                               
                        404,                                                    
                        "File not found: " . $request->getURI()->__toString()   
                    )                                                           
                )                                                               
            );                                                                  
            /* The order of these catch statements matter and should go from    
             * most to least specific. Otherwise all Exceptions will be caught  
             * as their more generic parent class which reduces precision.      
             */                                                                 
        } catch (\DatabaseException $e) {                                       
            error_log($e);                                                      
            return $this->responseStatus500(                                    
                $request,                                                       
                $user,                                                          
                self::GENERIC_500_ERROR                                         
            );                                                                  
        } catch (\ConfigurationException $e) {                                  
            error_log($e);                                                      
            return $this->responseStatus500(                                    
                $request,                                                       
                $user,                                                          
                self::CONFIGURATION_ERROR                                       
            );                                                                  
        } catch (\LorisException $e) {                                          
            error_log($e);                                                      
            return $this->responseStatus500(                                    
                $request,                                                       
                $user,                                                          
                self::GENERIC_500_ERROR                                         
            );                                                                  
        } catch (\Exception $e) {                                               
            error_log($e);                                                      
            return $this->responseStatus500(                                    
                $request,                                                       
                $user,                                                          
                self::GENERIC_500_ERROR                                         
            );                                                                  
        }                                                                       
                                                                                
        return $page->process($request, $page);                                 
    }    
}
