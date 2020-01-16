<?php declare(strict_types=1);
namespace LORIS\module_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Modules extends \NDB_Page {
    public function hasAccess(\User $user) : bool {
        return parent::hasAccess($user) &&
             $user->hasPermission('module_manager_edit');
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'PATCH':
            return $this->_handlePatch($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                array('PATCH')
            );
        }
    }

    private function _handlePATCH(ServerRequestInterface $request) : ResponseInterface {
        $path = $request->getURI()->getPath();

        $matches = [];
        $urlmatch = preg_match("#/modules/(.*)$#", $path, $matches);
        if ($urlmatch === false) {
            // Something went wrong evaluating the regex
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } else if ($urlmatch === 0) {
            // Pattern did not match.
            return new \LORIS\Http\Response\JSON\BadRequest();
        }

        $modulename = $matches[1];
        if (strpos($modulename, "/") !== false) {
            // Was trying to patch a sub-resource of module, which
            // isn't supported.
            return new \LORIS\Http\Response\JSON\BadRequest();
        }

        $vals = json_decode($request->getBody()->__toString(), true);
        if (!isset($vals['Active'])) {
            return new \LORIS\Http\Response\JSON\BadRequest();
        }

        \NDB_Factory::singleton()->database()->update(
            'modules',
            ['Active' => $vals['Active']],
            ['Name' => $modulename]
        );
        return (new \LORIS\Http\Response())->withStatus(205);
    }
}

