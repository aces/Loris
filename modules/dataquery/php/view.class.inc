<?php declare(strict_types=1);
/**
 * Handles queries for CouchDB.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\dataquery;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The View class for GET requests.
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class View extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Search data for the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Retrieve 'type' of request.
        $type = substr(
            $values['lorispath'],
            strpos($values['lorispath'], '/View/') + strlen('/View/')
        );

        // Process the 'type' of request.
        switch ($type) {
        case 'search':
            return $this->_search($request);
        //            case 'session':
        //                return;
        //            case 'datadictionary':
        //                return;
        default:
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid type of request'
            );
        }
    }

    /**
     * Search the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _search(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Start Connecting to CouchDB
        $cdb = \NDB_Factory::singleton()->couchDB();

        // Retrieve the Query params for CouchDB
        $operator       = $values['operator'];
        $category       = $values['category'];
        $field          = $values['field'];
        $value          = $values['value'];
        $sessionResults = array();

        // Process Query depending on operator.
        switch ($operator) {
        case 'equal':
        case 'isNull':
            if (!is_numeric($value) && $value !== 'null') {
                $value = "\"$value\"";
            }
            $results        = $cdb->queryView(
                'DQG-2.0',
                'search',
                array(
                    'reduce' => 'false',
                    'key'    => "[\"$category\", \"$field\", $value]",
                )
            );
            $sessionResults = array_map(
                function ($element) {
                    return $element['value'];
                },
                $results
            );
            break;
        case 'notEqual':
        case 'isNotNull':
            // There's no way to do "not" in an index, so we need to
            // get all the values of the field name, and then iterate
            // through them and exclude the ones where the value is
            // equal in PHP.
            $results = $cdb->queryView(
                'DQG-2.0',
                'search',
                array(
                    'reduce'   => 'false',
                    'startkey' => "[\"$category\", \"$field\"]",
                    'endkey'   => "[\"$category\", \"$field\", {}]",
                )
            );
            // TODO: Rewrite this using array_filter and array_map.
            $sessionResults = array();
            foreach ($results as $row) {
                if ($row['key'][2] == $value) {
                    continue;
                }
                if ($value === 'null' && is_null($row['key'][2])) {
                    continue;
                }
                $sessionResults[] = $row['value'];
            }
            break;
        case 'lessThanEqual':
            $results        = $cdb->queryView(
                'DQG-2.0',
                'search',
                array(
                    'reduce'   => 'false',
                    'startkey' => "[\"$category\", \"$field\"]",
                    'endkey'   => "[\"$category\", \"$field\", $value]",
                )
            );
            $sessionResults = array_map(
                function ($element) {
                    return $element['value'];
                },
                $results
            );
            break;
        case 'greaterThanEqual':
            $results        = $cdb->queryView(
                'DQG-2.0',
                'search',
                array(
                    'reduce'   => 'false',
                    'startkey' => "[\"$category\", \"$field\", $value]",
                    'endkey'   => "[\"$category\", \"$field\", {}]",
                )
            );
            $sessionResults = array_map(
                function ($element) {
                    return $element['value'];
                },
                $results
            );
            break;
        case 'startsWith':
            $results        = $cdb->queryView(
                'DQG-2.0',
                'search',
                array(
                    'reduce'   => 'false',
                    'startkey' => "[\"$category\", \"$field\", \"$value\"]",
                    'endkey'   => "[\"$category\", \"$field\", \"$value"
                        // PHP doesn't have any /u9999 unicode escaping, so
                        //  we use mb_convert_encoding to embed a high
                        //  unicode character
                        . mb_convert_encoding(
                            '&#x9999;',
                            'UTF-8',
                            'HTML-ENTITIES'
                        )
                        . "\"]",
                )
            );
            $sessionResults = array_map(
                function ($element) {
                    return $element['value'];
                },
                $results
            );
            break;
        case 'contains':
            $results        = $cdb->queryView(
                'DQG-2.0',
                'search',
                array(
                    'reduce'   => 'false',
                    'startkey' => "[\"$category\", \"$field\"]",
                    'endkey'   => "[\"$category\", \"$field\", {} ]",
                )
            );
            $sessionResults = array_filter(
                $results,
                function ($element) use ($value) {
                    /* Element is of the form:
                    Array
                        (
                            [id] => 929342e78fd78dfe38e2732d7207b82e
                            [key] => Array
                            (
                                [0] => adi_r_proband
                                [1] => Administration
                                [2] => All
                            )
                                [value] => Array
                            (
                                [0] => STL0138
                                [1] => V06
                            )
                            );
                     */
                    $fieldVal = $element['key'][2];
                    return strpos($fieldVal, $value) !== false;
                }
            );
            $sessionResults = array_values(
                array_map(
                    function ($element) {
                        return $element['value'];
                    },
                    $sessionResults
                )
            );
            break;
        default:
        }
        // Return Query results to the user.
        return new \LORIS\Http\Response\JsonResponse(
            $sessionResults
        );
    }

    /**
     * Returns true if the user has permission to access
     * the DQT module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('dataquery_view'));
    }

}
