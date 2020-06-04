# Routing

Since LORIS 20.0, LORIS has included a router and middleware based
on (PSR15)[https://www.php-fig.org/psr/psr-15/] This has a number
of benefits over the custom scripts in the htdocs directory used
by previous LORIS releases such as reducing the dependency on Apache,
removing the dependency on mod_rewrite, and making it possible for
modules to declare their own custom routes with complex path
components or use the same access checking mechanisms as the rest
of LORIS automatically.

The AjaxHelper.php and associated `module/*/ajax/*.php` scripts are
being deprecated as a result.

In the new architecture, modules should implement an endpoint which
handles the ServerRequestInterface passed to it in a RESTful manner.
An example of how to do this is https://github.com/aces/Loris/pull/3977,
which removes the "validateIDs.php" ajax script from the candidate_list
module and replaces it with a validateIDs candidate_list/validateIDs
endpoint.

The exact release that will remove the AjaxHelper.php is undefined
because of the number of existing modules that need to be updated,
but it should not be depended on for any new development.

