#!/bin/bash
# Creates a stub LORIS project directory at the location passed as the first argument
for d in data libraries instruments templates tables_sql modules smarty/templates_c ; do
    mkdir -p "${1}/${d}"
done

# Make sure the smarty templates_c directory is writable by Apache.
# FIXME: Should this be here? If so, does it need to be sudo'ed?
# FIXME 2: If this stays here, it should be smarty enough to detect
# the correct user based on distro. For now, this is only used by
# the Debian packaging script.
chown www-data "$1/smarty/templates_c"
chmod 770 "$1/smarty/templates_c"
