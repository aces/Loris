<?php

namespace LORIS\single_page_module;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


class Module extends \Module implements \ModuleAPI
{
    function injectAPIRoutes(\Slim\App $app) {
        $app->get('/items', function (Request $request, Response $response) {
            $response->getBody()->write("GET an item");
            return $response;
        });

        $app->post('/items', function (Request $request, Response $response) {
            $response->getBody()->write("POST an item");
            return $response;
        });

        $app->put('/items', function (Request $request, Response $response) {
            $response->getBody()->write("PUT an item");
            return $response;
        });

        $app->patch('/items', function (Request $request, Response $response) {
            $response->getBody()->write("PATCH an item");
            return $response;
        });

        $app->delete('/items', function (Request $request, Response $response) {
            $response->getBody()->write("DELETE an item");
            return $response;
        });
    }
}
