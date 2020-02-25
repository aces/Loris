# Coding Standards

## General 

### Style and Formatting
We use a variety of static analysis tools to create a consistent style across
the codebase. For more details about the tools used and what they do,
please review the [Automated Testing Guide](./wiki/99 - Developers/Automated Testing.md)

### Separation of languages
HTML, PHP, CSS, SQL, and JavaScript code should not be mixed. Instead, they
should be separated into their own directories and files.

An exception to this is PHP code that builds SQL queries to interact with the
database. Where possible, this should be limited to specific classes that
handle these transactions rather than mixed in with more general code.

## PHP
PHP code should be compliant with PHP Standards Recommendations](https://www.php-fig.org/psr/) PSR-7 and PSR-15.

All new functions should use type hinting and return type declarations.

All new classes should declare strict types by including the following line at
the top of the file:
```php
<?php declare(strict_types=1);
```

DateTime and related classes should be used instead of strings for handling dates.

Prepared statements MUST be used for any database interactions that use user input.

LORIS has many classes that use a Singleton design pattern. To facilitate with
unit testing, it is best to use these singletons via the NDB_Factory class.
For example, you should use the Database class like this:

```php
$database = \NDB_Factory::singleton()->database();
```

instead of 

```php
$database = \Database::singleton();
```

# HTML
- HTML should go into a template and be rendered using a templating library (smarty for PHP).
- Embedded tags should be on a new line and indented one level deeper than its
parent, e.g.:
```html
<div>
    <span>foo</span>
</div>
```

# SQL
ANSI join syntax:
```mysql
"table1 t1 JOIN table2 t2 ON(conditions)"
```
 is preferred over a cross join with where conditions:
 ```mysql
 "table t1, table2 t2 WHERE conditions"
 ```
 both for readability, and because it's impossible to do outer joins using the latter syntax.
 
- In any query involving more than one table, each table should be given an alias (`t1` and `t2` above)
- SQL keywords should be ALL CAPS
