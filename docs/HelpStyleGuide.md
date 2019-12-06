# Style Guide for User-Facing Help Text in LORIS

Help text exists as an on-screen guide for users, to add context and provide instructions to using all of the features in LORIS. It is always accessed by clicking the question mark in the top right menu bar in LORIS, as seen below:

![Help Text](/docs/images/helptext.png)

## How to Store and Name Files

Help text content is stored into the aces/Loris repo as markdown (.md) files within the help/subdirectory of the module it belongs to. For example, the Help text for Imaging Browser main page is located here: `modules/imaging_browser/help/imaging_browser.md`. 

Some modules have more than one Help text file to correspond with subpages. These files exist in the same `help/` folder, but are named differently - they must match exactly the php/file name that spawns the page. For example, the Imaging Browser module has a subpage called “ViewSession”. Its help file is stored as: `modules/imaging_browser/help/viewsession.md`. 

## Markdown

Formatting should follow markdown guidelines, with some exceptions. This is because LORIS’s current markdown template may not cover all possible markdown features (e.g. bullets). Help text cannot be formatted with HTML so it should not be included in help text. When creating a markdown file, use only the following styles, or else talk to the LORIS technical team about expanding our Markdown features:

* `*Italics*`
* `**Bold**`
* `***Italics and Bold***`
* `# Heading 1` up to `###### Heading 6`
  * Use `#H1` for the name of the module at the beginning of the help text
  * Use `#H2` for any subheadings
  * Use `#H4` for sub-subheadings
* Avoid using HTML line break (`<br>`) tags—simply use physical line breaks (spaces between lines) where necessary. 
  * Using `<br>` might be necessary only in lists of items
  
## When to Use Emphasis
  
Whether a user knows it or not, they will come to recognize styles that are consistent throughout the text. This way, their eyes can jump to a part of the text that addresses their issue, if they don’t need to read the whole thing. Follow these rules on using emphasis:

* *Italicize* when referring to a specific place on the screen
  * e.g. in the Selection Filters section
  * e.g. in the Metadata column of the table
  * e.g. in the Imaging menu
* **Bold** when referring to any clickable button, including modules and tabs
  * DON’T call it a button
    * e.g. Click **Submit** (rather than “click the **Submit** button”)
  * DO call it a module or tab
    * e.g. In the **Imaging Browser** module
    * e.g. Click the **Upload** tab
  * You can also use bold when defining features in a list, to separate the term being defined from the definition itself, e.g. when describing columns in a table:<br>
     **Column heading 1**: description<br>
     **Column heading 2**: description<br>
     Etc.
     
## Tone

LORIS is used by scientific community members worldwide, which means it's possible that most users are non-native English speakers. Therefore, it is important that LORIS documentation (setup guides, etc.) be written in a way that is quickly comprehensible by people with many different levels of English language and expression.

This means using more direct language and tone to get information across to the user in the least amount of time, with the least amount of friction. The quicker a user understands something, the happier they are.  Easily understandable documentation also builds trust in the software, in addition to decreasing the amount of support questions we get.

* Use second person point of view rather than third
  * e.g. “This module allows *you* to browse…” (rather than “This module allows *users* to browse…”)
* Keep it concise. Avoid unnecessary information.
  * Try not to be repetitive. 
  * e.g. the Help text for the Imaging Browser module begins with the title Imaging Browser. You don’t need to start text with “In the Imaging Browser module...”, because the user already knows the module based on the title. Instead, keep it short and say “In this module…”
* Assume the user is tech-savvy enough to know about features that are intuitive or common across modern platforms, so you don’t need to repeat in every Help text
  * e.g. clicking the column headers to re-sort a table
  * e.g. clicking a Download button to download something
  * e.g. navigate pages of a table using the arrows provided
* Use Plain Language
  * Avoid words that you wouldn't use in everyday speech
* Where relevant, introduce an abbreviation once and then use that abbreviation for the rest of the copy in that help text (e.g. introduce Quality Control = QC in a help text title, then only call it QC throughout the text)
  * e.g. DO: “The Imaging Quality Control (QC) module allows you to view the QC status of images in your LORIS.”
  * e.g. DON’T: “The Imaging Quality Control (QC) module allows you to view the Quality Control status of images in your LORIS.”
* Break up large blocks of text. It's more visually pleasing and less intimidating.

For more information, including research studies conducted, on the use and value of Plain Language, please see [this article](https://www.nngroup.com/articles/plain-language-experts/) and feel free to browse the rest of this website for further helpful details, tips, and tricks. 
