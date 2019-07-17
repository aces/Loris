### This directory contains all modules for Loris.

Modules should be entirely self-contained into a subdirectory with the following structure:

    ModuleName/

        css/          - Any necessary new CSS classes/files should go here

        help/         - Contains a markdown file of help content for each page in this module.

        js/           - This contains any javascript for the module. (This is often empty in
                        git, as the javascript files are generated from the React JSX
                        when running "make") 

        jsx/          - This directory has no special meaning for LORIS, but by convention is
                        where most modules put JSX code which is compiled into the js directory.

        php/          - This contains classes that are autoloaded for the module's PHP
                        namespace. Filenames should match the classname in lowercase with
                        the ".class.inc" extension.

                        The namespace for all classes in the module should be "LORIS\$ModuleName"

                        Classes in this namespace which match the classname of a URL of the
                        form $modulename/$classname/ and extend NDB_Page (or a subclass)
                        automatically have their handle() function delegated to in order to
                        handle incoming requests for the page. The lowercase requirement
                        ensures that the autoloader can find the file on case sensitive
                        filesystems, without requiring the URL's case to match our
                        coding standards class capitalization rules. The class with a name
                        which matches the name of the module serves as the default page for
                        the module.

                        There also must be a class named "Module" in the module's namespace
                        created in this directory. The Module class determimes module-wide
                        metadata about this module. The handle() function of the Module class
                        serves as an entry point for any incoming requests to the module, and
                        by default delegates to other classes as described above. In most
                        cases, simply implementing a class in the module's namespace which
                        extends \Module should provide reasonably defaults.

        templates/    - Location of any smarty templates for your module. Deprecated. Please use
                        jsx/ instead.

        tools/        - This contains any helper tools used either manually or by cron for this module

        README.md     - This file should contain technical specifications for any module in LORIS.
                        See any module (ie. modules/candidate_list/README.md) for a template.
