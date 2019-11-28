# Style Guide for User-Facing Help Text in LORIS

Help text exists as an on-screen guide for users, to add context and provide instructions to using all of the features in LORIS. It is always accessed by clicking the question mark in the top right menu bar in LORIS, as seen below:

![Help Text](/docs/images/helptext.png)

## How to Store and Name Files

Help text content is stored into the aces/Loris repo as markdown (.md) files within the help/subdirectory of the module it belongs to.. For example, the Help text for Imaging Browser main page is located here: `modules/imaging_browser/help/imaging_browser.md`. 

Some modules have more than one Help text file to correspond with subpages. These files exist in the same help/ folder, but are named differently - they must match exactly the php/file name that spawns the page. For example, the Imaging Browser module has a subpage called “ViewSession”. Its help file is stored as: `modules/imaging_browser/help/viewsession.md`. 

## Markdown

Formatting should follow markdown guidelines, with some exceptions. This is because LORIS’s current markdown template may not cover all possible markdown features (i.e. bullets). Help text should not include HTML tags for security reasons. When creating a markdown file, use only the following styles, or else talk to the LORIS technical team about expanding our Markdown features:

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
  * i.e. in the Selection Filters section
  * i.e. in the Metadata column of the table
  * i.e. in the Imaging menu
* **Bold** when referring to any clickable button, including modules and tabs
  * DON’T call it a button
    * i.e. Click **Submit** (rather than “click the **Submit** button”)
  * DO call it a module or tab
    * i.e. In the **Imaging Browser** module
    * i.e. Click the **Upload** tab
  * You can also bold when defining features in a list, to separate the term being defined from the definition itself, i.e. when describing columns in a table:
     **Column heading 1**: description
     **Column heading 2**: description
     Etc.
     
## Tone

Yes, LORIS is used for high-level research and yes, the people using LORIS are very smart and yes, we want people in the scientific community to take LORIS seriously. At the same time, the easier any user finds a text to read, the more they’ll retain and use the information. And a friendly tone will help them understand that LORIS is built and maintained by humans. There’s a lot of research that shows people will engage and have more patience with a piece of software when they’re reminded that there’s more than just a computer behind it. Using a more conversational tone will subtly have this effect. We’re not talking about humour and exclamation marks—just small tactics that make content as easy to understand as possible.

Please note, this is NOT about “dumbing things down”. It’s simply about using the most direct language and tone to get the information across to the user in the least amount of time, with the least amount of friction. The quicker a user understands something, the happier they are, the more trust they have with the software, and the less silly questions you can expect to get to the dev mailing list! 

* Use second person point of view rather than third
  * i.e. “This module allows *you* to browse…” (rather than “This module allows *users* to browse…”)
* Keep it concise. Avoid unnecessary information.
  * Try not to be repetitive. 
  * i.e. the Help text for the Imaging Browser module begins with the title Imaging Browser. You don’t need to start text with “In the Imaging Browser module...”, because the user already knows the module based on the title. Instead, keep it short and say “In this module…”
* Assume the user is tech-savvy enough in the year 2020 to know about features that are intuitive or common across modern platforms, so you don’t need to repeat in every Help text
  * i.e. clicking the column headers to re-sort a table
  * i.e. clicking a Download button to download something
  * i.e. navigate pages of a table using the arrows provided
* Use [Plain Language](https://www.plainlanguage.gov/resources/articles/elements-of-plain-language/)
  * As a guideline, refer to [this list](https://www.plainlanguage.gov/guidelines/words/use-simple-words-phrases/) of words to avoid, and alternate suggestions 
* Where relevant, introduce an abbreviation once and then use that abbreviation for the rest of the copy in that help text (i.e. introduce Quality Control = QC in a help text title, then only call it QC throughout the text)
  * i.e. DO: “The Imaging Quality Control (QC) module allows you to view the QC status of images in your LORIS.”
  * i.e. DON’T: “The Imaging Quality Control (QC) module allows you to view the Quality Control status of images in your LORIS.”
* Break up large blocks of text. It's more visually pleasing and less intimidating. 
