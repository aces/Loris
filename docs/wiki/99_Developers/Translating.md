# Translating LORIS

## Overview

Helping with translating LORIS into a language that you speak is
an easy way to help LORIS without touching any code.

If you're using a language that is already translated and a translation
appears wrong, the first thing you can do is [open a bug report.](https://github.com/aces/Loris/issues/new?template=bug_report.md). Try and include
the page, incorrect words, and correct phrasing (and/or dialect if applicable)
in your bug report.

Otherwise, you most likely want to help with one of two tasks:
- Adding a new language to LORIS
- Adding translations for an existing language to a module in LORIS.

The steps for each are similar.

## Architecture

Translatable strings used by LORIS are stored in `.po` (portable object)
files which is the standard used by `gettext` library. These are compiled
into both the `json` files used by the javascript frontend, and the `mo` files
used by the PHP backend, so that the same translations are used throughout
LORIS.

(For advanced usage of the format in languages that include multiple forms of
plural an internet search is likely to provide better guidance than this
documentation, which is aimed at contributing to LORIS.)

Each translatable module in LORIS has a `locale` subdirectory for strings that
are specific to that module (ie. `modules/candidate_list/locale` for the
`candidate_list`) while LORIS has a `locale` directory on the top level
for terms that are used throughout LORIS.

Within the locale directories, there is a `.pot` (".po template") file with
the same name as the module (or "loris.pot" for the core terms). The `.pot`
is a template with translateable strings for a new language.

Both `po` and `pot` files have similar structures and can be either be edited
by hand or with any translation software which supports the format.

Inside the locale directory, there is a subdirectory for each supported language.
The language directory has an `LC_MESSAGES` subdirectory which has the `.po` file
with the translated strings for that language. (This directory structure is imposed
by gettext and not specific to LORIS.)

The primary difference between adding a new language or adding translations for
an existing language is whether the language subdirectory already exists.

## Example 

Suppose you wanted to translate LORIS to a fictional language which is exactly
the same as English but every word starts with "L". This fictional language has
the language code of "lo".

The first thing step is to create the `locale/lo/LC_MESSAGES` directory and
copy the `locale/loris.pot` template to `locale/lo/LC_MESSAGES/loris.po`.

Within the file, near the top of the there is a block of metadata for the file
which looks something like:

```
"Project-Id-Version: LORIS 27\n"
"Report-Msgid-Bugs-To: https://github.com/aces/Loris/issues\n"
"POT-Creation-Date: 2025-04-08 14:37-0400\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\n"
"Last-Translator: FULL NAME <EMAIL@ADDRESS>\n"
"Language-Team: LANGUAGE <LL@li.org>\n"
"Language: \n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
```

You can edit it as appropriate, but the most important part (from a technical
perspective) is that the "Language" line needs to be updated to match your
language's language code, in this example it would be changed to read:

```
"Language: lo\n"
```

(This step may already be done if you're updating an existing language.)

Next, comes inserting the translations themselves. 

The template you copied you copied should have a series of msgid/msgstr lines such
as the following:

```
msgid "LORIS"
msgstr ""

msgid "DEV"
msgstr ""

msgid "Affiliations"
msgstr ""
```

msgid is generally the English string, and msgstr should be updated with the
translation. In our fictional language, this would become:

```
msgid "LORIS"
msgstr "LORIS"

msgid "DEV"
msgstr "LDEV"

msgid "Affiliations"
msgstr "Laffiliations"
```

Congratulations, you've translated LORIS into the fictional `lo` language!

You can repeat this process for any module within the module's `locale`
directory.

## Send Pull Request 

The last step is to send a pull request to LORIS so that your translation
can be included in the next release. Due to the size of LORIS, it's best to translate one module at a time and send one pull request per module.

If you're not familiar with git or GitHub you can review [GitHub's](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) provides documentation on how
to send a pull request.

If you still not sure how to send a pull request, including the `po` file
that you've created in a GitHub issue, a developer may be able to help you
or create it for you.
