### This directory contains all modules for Loris.

Modules should be entirely self-contained into a subdirectory with the following structure:

    ModuleName/

        ajax/         - This directory contains any AJAX helper script used by the module. They should
                        be invoked by using the AjaxHelper.php script in Loris

        css/          - Any necessary new CSS classes/files should go here

        help/         - Contains a markdown file of help content for each page in this module

        js/           - This contains any javascript for the module.

        php/          - This contains the NDB_Menu_Filter and/or NDB_Form for the module

        templates/    - Location of any smarty templates for your module

        tools/        - This contains any helper tools used either manually or by cron for this module

All of these directories are optional, and after a Menu_Filter is set up your module can
be accessed in a standard Loris fashion at `{$baseurl}/ModuleName/[subtestName/][?param1=value1&param2=value2]`
