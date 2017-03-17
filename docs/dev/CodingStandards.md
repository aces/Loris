---
layout: default
title: Coding Standards
description:
group: dev
permalink: /code-style/
---


General Formatting:
- Indentation should be 4 spaces instead of tabs
- Each embedded block should be indented 1 more indentation level

In vim, you can use the following in your .vimrc to set this automatically:
set tabstop=4
set shiftwidth=4
set expandtab
set autoindent
set smartindent

while working in vi, this command will automatically indent:
gg=G

In emacs:
? (C-x C-c, vi filename?)

PHP:
- Ensure formatting meets Loris style guidelines by running phpcs with the LorisCS.xml
  configuration file which accompanies these guidelines. You can run the tool
  with the command `vendor/bin/phpcs --standard=docs/LorisCS.xml [file]` for any
  files you've modified or added. For new modules, ensure that PHPCS has been
  run on the module directory and add the module to travis.yml

HTML:
- HTML should never be mixed with code. HTML should go into a template and be
  rendered using a templating library (smarty for PHP)
- General formatting rules about indentation applies for each tag embedded inside
  another tag of HTML
<div>
    <span>foo</span>
</div>

Javascript:
- Javascript should never be mixed with HTML or PHP code. Javascript should go into
  `modules/js`
- Any newly written Javascript should pass ESLint with default options.

SQL:
- prepared statements ($db->pselect() rather than $db->select()) MUST be used for any statements which involve user input. You must never use string concatenation to create an SQL statement such as "SELECT abc FROM table WHERE field1='" + $_REQUEST['val'] + '"' as this is a serious security hole.
- ANSI join syntax ( "table1 t1 JOIN table2 t2 ON(conditions)" ) is preferred over a cross join with where conditions ( "table t1, table2 t2 WHERE conditions" ) both for readability, and because it's impossible to do outer joins using the latter syntax.
- In any query involving more than one table, each table should be given an alias (t1 and t2 above)
- SQL keywords should be capitalized

Git:
- Any changes should be done on a branch based on the current development branch and contain only the changes which are applicable for that branch. (ie don't merge master back into your branch, and don't include commits that are unrelated) so that if someone merges the branch into their repository, they only get that branch's changes. In particular, so pull requests merge the proper code.
- Commits should be atomic (self contained) and contain the changes and only the changes described by the commit message. The commit message should be a sentence that describes the goal of the change as a whole, for seeing the details of what code changed we have diff.
- Don't try to correct unrelated code in the same commit, even if it violates these coding standards, that should be done in a separate branch/commit with a message such as "Fixed coding standard violations". In particular, don't try to fix whitespace since that is likely to cause conflicts even if you don't have any real (code) changes to those lines.
- ALWAYS do a diff before commiting (after doing "git add file1 file2" when you're planning on doing git commit, you can use git diff --staged to see a diff of what will be commited). Ensure that nothing unexpected is included (such as whitespace changes. If using an external diff tool such as kdiff3, ensure your tool is whitespace sensitive)
