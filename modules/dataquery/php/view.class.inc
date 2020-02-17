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
 * The View class for requests.
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
        // Ensure allowed request.
        switch ($request->getMethod()) {
            case 'PUT':
                return $this->_handlePUT($request);
            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    array('PUT')
                );
        }
    }

    /**
     * CSV Import data from user using the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse PUT request body.
        $values = json_decode((string) $request->getBody(), true);

        // Start Connecting to CouchDB
        $cdb = \NDB_Factory::singleton()->couchDB();

        $children = $values['children'];
        for ($i=0; $i<count($children); $i++) {
            $child = $children[$i];
            // Retrieve the Query params for CouchDB
            $operator       = $child['operator'];
            $category       = $child['instrument'];
            $field          = $child['field'];
            $value          = $child['value'];
            $sessionResults = array();

            // todo remove just for testing
            $child['session'][0] = 'ROM489';
            $child['value'] = 'ROM489';

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

            $child['allSessions'] = $sessionResults;
            $children[$i]         = $child;

        }

        $values['children'] = $children;

        // Return Query results to the user.
        return new \LORIS\Http\Response\JsonResponse(
            $values
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
