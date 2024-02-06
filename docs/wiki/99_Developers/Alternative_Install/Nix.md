# Nix package manager support

## Overview 

As of LORIS 24.0, LORIS includes a configuration file for 
[nix-shell](https://nixos.org/manual/nix/stable/#sec-nix-shell)
of [NixOS/the Nix package manager](https://nixos.org/). This allows Nix users to
quickly set up an appropriate development environment with all LORIS development
dependencies installed in the user's path.


## Usage

From the LORIS directory, run `nix-shell`.

LORIS's development dependencies will be automatically installed (only available
in the shell, although you can run `nix-shell` from multiple terminals).
The active version of PHP will be printed, as well as a command to start PHP's
built in development web server. For example:


```
PHP 8.0.5 (cli) (built: Apr 27 2021 12:23:55) ( ZTS )
Copyright (c) The PHP Group
Zend Engine v4.0.5, Copyright (c) Zend Technologies
    with Zend OPcache v8.0.5, Copyright (c), by Zend Technologies

To start a development LORIS web server run:
    php -S localhost:8000 -t htdocs/ htdocs/router.php

[nix-shell:~/Loris]$
```

Commands such as `make`, `npm`, `composer`, or `git` should work within this shell
or the suggested command can be run to start a server at `http://localhost:8000`.
