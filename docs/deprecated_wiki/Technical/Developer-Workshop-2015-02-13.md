# Loris Developers’ Workshop #1: Dave MacFarlane - Feb. 13, 2015

> This is a written transcript of the first Loris Developer Workshop given
> by Dave MacFarlane on February 13, 2015 at the BIC.

## Introduction by Samir:

This is our first Loris developer session. The point of this is to be able to go through some topics of Loris, as well as address development issues that we maybe don’t have a forum for in other meetings that we have. It’s a great idea. And it’s Dave’s idea. And I really think this a good place to do a lot of things that we’re missing.

Tom’s been having some interesting development ideas. There’s kind of interesting development ideas that will be part of a many part series that we’re going to try to commit to over the next while and I would encourage anyone who knows of other Loris developers, that are interested in figuring out the technical parts of this to come to a meeting like this. That would probably be very beneficial for them.

So, without any further adieu. We’ll be recording all of this stuff. So if anyone wants to forward the link, they can do that later. At this point, I’ll let Dave take it on, and start with our first session, which is more simple, the file structures, but he’ll explain all of that to you in more detail.

## Introduction by Dave

Okay,  for those of you who don’t know me--there’s some new hires here--I’m Dave, and I’ve been working on Loris since 2010, so I know a bit about it. I’ve done quite a bit of work on it, I’ve rewritten the data query tool, I came up with the module structure in Loris, and a lot of general bug fixing.

Today I want to get people to know Loris as a framework because a lot of people are using Loris and it helps to know it. My plan for today is mostly to go over basically the structure of the file system in Loris, what all the directories are, what’s in them, what they do, and then go through a couple of the base classes used in the php framework that the Loris front end is built on.

I don’t know how long that’s going to take. I imagine it won’t take the whole hour that I’ve allocated, but I also want to save some time at the end for just feedback on content of workshops, what you want, what schedule would work, if this is a good time, if other times are better, and what topics we’re interested in. So I’m leaving around 20 minutes for that at the end, and also time for discussion or any questions that anyone has.

## What is Loris?

For people who aren’t that familiar with Loris, I should probably start by just explaining a little bit about what Loris is.

The honest answer is that it varies based on the context. It’s a suite of programs for a neuroimaging database. There’s a lot of components of that. There’s the php frontend, which is what most people see and think of when they think of Loris. There’s the data query tool, which is the method of extracting data. There’s the Loris MRI pipelines, which are used for inserting data into the MySQL databases. There’s the dicom anonymizer, and there’s a whole suite of other things that have to do with Loris.

## Today's Topic

What I’m talking about today, is basically the php framework used to build the frontend of Loris. It’s sold mostly as a neuroimaging database, but it’s actually flexible enough that it can be used for any sort of database driven web application. A good example of this is if you go to <https://bigbrain.loris.ca> there’s a suite of modules that were written just for that, to show the BigBrain data, and it’s all built on this structure.

I’m not going to go into a lot of depth into the individual modules, other than the structure of them, because there’s just too many of them. Even one of them could take up an entire talk.

> Samir: And there will be future talks where we dive into those

Today I just want to explain the general big picture framework of Loris.

## Loris on GitHub

On the screen here I have our [GitHub account](https://github.com/aces/Loris/), which I'll walk people through. This is the main Loris GitHub account. It’s divided up into various sections, not a whole lot. And I’ll just start going through them one by one.

## SQL Directory

Starting at the top we have the SQL directory, which is pretty obvious, what that means. It’s where all our SQL scripts are contained.

The most important one is this 00000-00-00-schema.sql. Basically it contains all the create table and insertions for a base Loris install. The install script uses that. It sources that to create the database, essentially so that you have all the tables.

Since Loris is an ongoing project, there’s obviously changes to the schema that happen over time. And the convention that we’ve come up with is that patches go into this directory with the date that they were written usually, a small description in .sql file and that should do any data mapping, any merging, whatever you need to update for whatever new feature you are adding.

Every time that we have a release, which we are now planning on doing every 6 months, in April and November, we take all these patches and combine them into one big megapatch, which goes in this appropriately named release patches directory, and the old patches other than the default schema are moved out into the archive directory, just so that we still have references to them.

So I guess that’s all I have to say about SQL at this point. Does anyone have any questions about that?

## Questions on SQL Directory

> Question: What's in the Archive directory?

So when we have a release, we move these patches into archive, just so this main SQL directory stays relatively clean. And there’s the version of when it was archived, so we can easily recreate the big patch that’s used for version upgrades.

> Question: So the original one is never updated?

The original one is updated at the same time that you add a patch. So when you send a pull request or some sort of change that requires some sort of modification to the table schema, you update the default schema in the 0000 file, so that new installs will have your changes, and you include a patch for existing projects. So the patch for existing projects will be run by people when they update their code. Generally as a developer, if you do a GIT pull and you see new SQL patches, you should look at them and run them, otherwise things might break because you’re missing a column or something that’s referenced in the code.

If you’re on a production server, you should be on a stable release and then just stick to the release patches to go release to release because our releases are tested and stable, while development may or may not work at any given time. So that’s all I have to say about the SQL at this point. Oh, one thing is we have Travis CI integration for testing Loris, one of the things it tests, is that it sources the main SQL file, the 0000 file, to ensure that you don’t have an invalid SQL statement that crashes. Because if you do that, you’ve just broken the build of everyone who’s trying to install Loris. So it’s one of our tests that we have.

## Docs Directory

Moving on to the Docs directory, which is actually kind of poorly named. There is very little documentation in the Docs directory.  What is mostly in the Docs directory is mostly sample config things. Our documentation for the most part is either in the README or in the Wiki, which is over here on GitHub {points to screen}, the GitHub Wiki.

But things like the Install script need sample Apache Config file, and this is where it’s stored. So config has a couple of sample Config files. The Apache2-site one, is the one that’s used in most Loris instances. The Fastcgi one is only used in our automated testing. The Config.xml is a sample configuration file, which, again is used by the install script, doing some string substitution for things that are referenced in it. It prompts for your hostname, it prompts for your database username and password, and then it takes this file and generates the one that goes into a different directory which I’ll talk about later.

I don’t know why this main.css is there, it’s certainly not a document. Instruments has some sample instruments, which you can use as reference for writing. There’s a template uploader instrument, there’s a template radiological review, there’s a few sample instrument builder instruments, but these are just samples.

So they are sort of documentation but not entirely what you would expect something called “docs” to be. LorisCS.xml is a file that’s used for ensuring consistency in our code base, in terms of stylistic things. It’s used for a program called PHP Codesniffer as the configuration file. It does things like ensure that all your functions are defined, all your function comments are defined, and things like that. So are there any questions about the “not quite Docs” directory? It’s mostly stuff that you don’t need to know about as a developer.


## Htdocs Directory

Carrying on to htdocs is where we start getting into things that actually matter in Loris.

Htdocs is basically the document root that served by Apache or whatever web server that you’re using, like I think I’ve run Loris with php's built in development web server. But we only support Apache. So it mostly consists of these wrapper scripts, like the GetCSS.php and GetJS.php which extract things from the module directory, which I’ll get into later.

A little historical context: This directory used to just be full of stuff from different modules, different things, it was really hard to keep track of. We came up with this module system, where things are now self-contained. So now, unless there’s something that you really need to be accessible while not logged in, you should almost never have anything in your htdocs directory.

Things like lost_password.php obviously you need to have, you can’t be logged in, to retrieve your lost password. Main.php is the main entry point to Loris if you are ever trying to trace through anything, that’s probably what you care about. There’s a few libraries that we use like Bootstrap and JQuery that are stored in various subdirectories here, but that’s about it for this directory.

> Question: Why do you have feedback_popups in the htdocs?

Mostly because they haven’t been taken out.

Well, it’s not just that they haven’t been taken out. These two feedback pop-ups are pop-up windows used for QCing of the data in Loris. For whatever reason, when they were originally written, instead of using the main Loris.php framework, they were written as their own completely separate php files.

They haven’t been turned into modules. They should be, but there’s no obvious one that they belong to. And they are separate pop-up windows.

> Samir: We will be doing that in the next little while.

At some point they will be taken out, I’m pretty sure. There’s no obvious way to do it. Because the main.php does things like add the menus, and the sidebars and the footers, and you don’t want those in these popup windows. That’s a good question.

One thing to keep in mind is that is the document root used by Apache. Anything you put in there, will be accessible by anyone in the world. It’s directly served by Apache, it doesn’t go through Loris or anything like that. It can’t be, because it’s the Apache document root, so be careful, never put any user data or anything like that there, you’ll have fairly big security issues. But if it’s something that you really don’t care, like a presentation you want to put on-line and have the url for it and have a server, and just throw it there. It’s not encouraged, but you could do that.

## Logs, Modules, and PHP directories

Logs is pretty self-explanatory, it’s just where our logs go. It is completely empty in the GitHub Repository.

And modules is where... actually I’m going to get back to modules at the end.

Php actually only contains two directories, Libraries and Exceptions.

The php directory is the core of the Loris framework. I’ll go into more depth later, but basically these are definitions of the classes that are used throughout Loris, all the different modules, all the different code, et cetera. I’m going to get back to these at the end of today because I want to get through the rest of the directories first. But I’ll walk through a couple of them for illustration.

Exceptions are just types of exceptions that Loris might throw, I think we have three, we have database exceptions, configuration exceptions and general Loris exceptions. So php is the core of the Loris framework, and modules are things that use that framework, is the general way that it works.

Smarty is a templating language. It’s what Loris uses for templates, for html templates, for doing things like generating the html which will be displayed to the user. It gives you things like If statements and Loops and whatnot. Main.tpl is obviously the main one that’s used by Main.php for generating the skeleton of the Loris application. And there’s other ones that have names that hopefully are obvious. This also used to have all the modules, if they didn’t have their templates, they all went into here, there was hundreds of files here, they were all really hard to follow. But they’re now part of the modules themselves. The other two directories there were just things required by Smarty.

## Tests: Integrationtests and Unitests

"test" is where our tests go. We use phpunit for our tests, we’ve divided them into unit tests and integration tests. Our integration tests solely consists of a test that logs into Loris automatically and makes sure that it didn’t crash. Our tests are run automatically every time you send a pull request by using Travis. So you can be confident that you did not completely break the login if you get the green checkmark from Travis. If you get a red “X”, it might mean that you’ve completely broken everything. It means a test failed. So you should probably look into that before pushing to get your code commited.

> Question: How do you tell if a test failed?

When you go to a pull request, which we can do here, there is this little icon here, a green check mark means passed, a red “X” means failed. A grey “X” generally means that there was a syntax error in your php.

> Question: So all the tests have to go in here and not in the Module specific directory?

Well, no. So unitests are a separate thing which we also have. Our unitests, I don’t think we have very many unitests, are things that test the base classes in the php libraries. We have some tests for the, well, it should be for all the base classes

> Samir: We’re just starting. This is something new

A red “X” could also mean that you broke menu filters. [To answer the question of ]module specific tests: we don’t have a convention yet. I would support them going in the Module test directory because the whole point of the Module is that it is self-contained. But If you did put it in integrationtests, it would be fine, it would run automatically with the Travis, with every pull request. As long as your test is good, it will work fine.


## Tools: Command-line Scripts

Tools is just a bunch of scripts, that are command-line scripts that you might as an administrator of Loris use. They’re never used on the front end. They do things like, things that you might want to run from a prompt like import your data into the CouchDB data query tool. Some of them do checking of various things. There’s too many of them to really go into here, but Tools is basically command-line tools. You can think of it as like a “bin” directory.

> Question: Are there descriptions that let you know what each of them does there? Can you find a description for each one?

Not really.

> Samir: They’re all in my head

> Rathi: They show usage when you run them without arguments.

There’s honestly not very good documentation for them. Some of them will have a comment at the top that explains what they do. Some of them won’t. Some of them will do what Rathi just said and if you don’t provide the correct arguments will say this is the correct usage, others won’t.

> Samir: But it’s funny that you should be the one to mention that, because I had this little plan and idea that someone could document it, an external user who isn’t as familiar with Loris so they could do this in an intuitive way.

## Old tools no longer useful

Some of them are also honestly not useful any more. I have a pull request to delete about ten of them, because I looked at them, and they are just historic. They’re not usable.

So I would wait until the useless ones are deleted before going through and writing excessive documentation on, for instance, this graphHelp.php which just prints some weird thing to the screen in the help hierarchy. I don’t know where this came from or why, but it’s not useful.

> Samir: Some of them are really useful

Well if you need them, you can get them out of GitHub revision history.

> Samir: And some of them we’re going to push to the front end

And some of them were only for one project. There’s a lot of them that I deleted that were clearly …the first thing was, “if the instrument was equal to Das”, or “if things that were specific to this one project”, then “do that”. So things like that, I don’t think we really need.

These are mostly php scripts. The exception is the Install.sh, which is the installation script which I’ve referred to a couple of times, which is a shell script. When you’re installing Loris, all the documentation is going to tell you to run the script at some point.

> Samir: On that last point about the Install script, we’re still also moving forward with
> trying to make them more efficient, work on different flavours of different operating
> systems, Ted was maybe going to help out with that. At some point we were going to try to
> have them as part of a package manager for different operating systems. Maybe if we had a 
> really talented sysadmin around here [Samir looks at Sylvain Milot], we could make that 
> happen somehow. Anyway, so that’s also in the roadmap. So just to know.


## Modules

Going on a little. Then there’s a few files in the test directory that are used for various things that I won’t get into today. Which brings us to the modules that I said that I would talk about.

As I said earlier, the php directory is the framework, the modules are what you see on the front end. They are the thing that uses the Loris framework to display what is generally considered Loris. If you click on any link and it says "testname=whatever", "whatever" is the module. Modules are a collection of pages that accomplish some sort of thing. It would depend on the module what they are. They are basically a collection of all the css, php, JavaScript, static text files, or anything else that you might need for using that Module.

## Brainbrowser: Example of Module

The first one, brainbrowser, is actually a pretty good example, because it uses most of those capabilities. Templates is another thing that I missed, that they contain. So brainbrowser, as you may or may not be aware, is a JavaScript, WebGL, minc visualization, well not just minc, but as far as we use it, minc visualization software. Being a JavaScript app, it has various things that it needs, like color_maps or shaders, apparently, which are just text files that come with the brainbrowser distribution, that need to go somewhere. So we made a module, which opens a new window with brainbrowser and has all of the things that it needs within that one directory.

As I was saying before when it used to be sort of not that clean, these would be all be dumped into the htdocs directory directly when it was initially implemented. And then you would have things like, in your htdocs root, you would have blue.txt, and who knows what that means? So, that was really one of the motivations of this whole module structure.

The scripts that I was referring to earlier in the htdocs are things that get the files out of here. They do things like make sure you’re logged in, find out what directory that it [the file] is supposed to be in, and then just return it. The main ones are GetCSS, obviously gets the css out of there, GetJS gets the JavaScript out of the JavaScript directory. If there is a directory named “Ajax”, that is where the Ajax helper script is. The Ajax helper script is for when you need to do things like... say your module needs some sort of specific Ajax, it needs to return some sort of very specific json object, to calculate it, you need to do it, you need to return it, you don’t want the whole Loris framework around it, you just need this chunk of data that’s returned by the web server that’s calculated in some way. That is where the Ajax comes in. There used to be three scripts named get csv in the htdocs directory, all of which were for different modules, and you had no idea what they were. There was getcsv, get_csv, but now they’re in the Ajax directory, of the module that it’s for, and it just cleanly gets it out of there.

Templates are the Smarty templates for that specific module, so it’s the HTML without all the Loris stuff for the pages that go in here generally. The page I was just on was it form_brainbrowser.tpl. That’s automatically loaded by the Loris framework when you load NDB_Form_brainbrowser.class.inc._ Forms generally correspond to a form_whatevertestname. By the way, you would access this by testname=brainbrowser, so that’s why you see so many brainbrowser things, and it will automatically look for the menu and then the form. The template for the menu is menu_whatever. The template for the form is form_whatever. If you know Smarty really well or you look into it, you can extend it, you can do other things.

We probably won’t get into it too much of it right now, but forms are accessed as testname=brainbrowser, for instance, and they can have subpages. Subpages are accessed as testname=whatever, subtest=whatever, and it looks in the NDB_Form for a function of the same name as the subtest. It will use the template that was associated with that, so it would be form_whatever, and that’s how Loris deals with modules. And then the test directory is just the directory where we have a test planned, right now, we will eventually have all kinds of tests there to be run with php unit, but obviously it’s a directory so you can create whatever other things that you want. But these are the five, I guess, that are used by the Loris module, static for just text files, or csvs or whatever you want, js for the JavaScript, css for the css, and Ajax for the things that you might want to do with Ajax outside of Loris framework, because all the Ajax helper does is make sure the user is logged in and authenticated, and then invoke your script and then you’re on your own to calculate whatever.

So as I was saying at the beginning, there’s a lot of these [modules]. And any given one of these, someone could probably talk for an hour about what it does, or why. They are all pretty independent. Some of the main ones are probably Imaging_browser, or the dashboard is what you see when you first log in. Anyway, there’s a lot, I’m not going to talk about every single one of them, I don’t have nearly enough time.

## Vendor and Project Directories

There are two very notable and important directories that are not in this. One is the vendor directory. The vendor directory is where all the third party libraries that are used by Loris are installed. The reason it’s not here is it’s automatically generated by the package manager called php composer. It also has a file that we require in there, so Vender is important. If you don’t run composer, you’re not going to have Vender. If you don’t have the Vender directory, Loris is just going to crash. At least now, it’s a fairly new requirement. Before that we were using Pear, which installed in a lot of system libraries.

The other important directory is the Project directory. So this is the Loris core, the Loris modules, the Loris framework. The Project is where the things that are specific to the database project are going to go. So that’s where the config goes. The config.xml. You can override any php or Smarty template in the Project directory. And that is where all of your instruments are going to go. Instruments being tests that are done to patients or whatever. Forms, essentially. But they need to be coded in php or with the instrument builder. They need to go somewhere, they are not part of Loris, they are just for the project. Each project will have its own instruments, they go in the Project directory. Everything in there is 100% customized project by project, except for the config.xml But that’s also an important thing.

## Questions

So now that we’ve been through the general file system layout, does anyone have any questions about Loris? About what I talked about, or anything?

> Question: I’m curious to know, you’re probably getting to this, but what is the architecture 
> of a individual module and how does that depend upon the form? Like can a module be anything,
> or is there a module template that you start from?

You could start with a simple module, something similar and base it on that, but generally that’s probably in depth enough for a different talk...

No, actually I’ll get into that a little. So modules generally have a menu which is a horribly named thing, it’s actually a table. So I will show an example..

{Dave loads up Loris}

> Samir: While he’s loading it up, the history of what these modules are, were different 
> functionalities that we slowly started to include in our database as a group and they 
> weren’t necessarily part of the core database anymore, they had their own specific little 
> things. As we started expanding to different projects, and include more things, we started 
> adding more functionality. So eventually it was organized into a more modular kind of way.

## Example of Loris Module to Show Architecture

So this is an example of a Loris module. This is the dicom archive. When scans get inserted into Loris, they go into a table called the tarchive table. This is a front end to that. This front page is what’s called a menu in Loris terms. (Actually it’s a menu filter.)

Basically, in a menu you define a query to generate the table that’s displayed here. And it does all the adding pagination, and that sort of stuff. And adding of the filters and whatnot. Then after you get to the module, there are submodules. So this is the dicom_archive module, test_name=dicom_archive. That’s how you know what module it is, it’s the test_name. The reason it’s called test_name instead of module is, is just historic.

I don’t know 100% why it’s called test_name to be honest with you.

> Samir: Was that because that’s how we initially started?

I imagine it has something to do with it being originally for instruments.

> Samir: Initially we only had instruments, and then we started adding other functionally. 
> This is one example. Initially all the data in the database was in minc format here, 
> but people started to want to know a little bit about the dicom source data that came in. 
> So Sebastian Muehlbock who used to be a Loris developer, he created this dicom archive tool, 
> and this is the front end for it so you can also see the dicom tables, which are not part of 
> the Loris core structure, they are very much like a module, self-contained

Yeah, they are very much self-contained. So we can have something like a template to generate this, and it also has subpages, like this {Dave clicks on a link in the dicom archive} . You can see up here, subtest. That is the subpage of the module. So viewDetails is going to look for the function called viewDetails in the NDB_Form, in the dicom archive module. It is going to use that to determine what to render. You can have an arbitrary number of subtests, which potentially do different things. I can’t think of any example right now, but I’m sure that there are some. And divide up or drill down your data however you want. This one [the viewDetails page], I guess is also very tabular, so it’s not that interesting, but it’s a submodule of a module.

So generally you have one top level menu, and a menu is basically a table generated by a query. These are not menus {Dave points to drop-down menus in Loris}. When I started working here, that is what I expected a menu to be. But a menu is in fact, this whole page. It’s like, if you consider a menu into the module, to cause the modules to interact with a specific set of the data in the database, whether it’s the dicom archive or the candidate list, then it sort of makes sense.

> Someone: It’s like a restaurant menu

> Samir: There are a lot of historic terms that are coded everywhere that it’s not
> worth changing. Rather it’s easier to document. Maybe one day we’ll change it, 
> when we have extra time, which will never happen, I’m sure. Then we’ll change all that


## Remove a Module

> Athena: So if you’re customizing, is it easy to just remove a module? If you don’t want it to be part of Loris?

Yes, there are basically two things you would have to do. One, delete it from the module structure, which I guess you don’t have to, but if you want to. And two, delete it from the menu.

> Samir: But you can also customize it so that it’s viewable or not viewable. You could delete 
> it, but you don’t have to. You can have it where you don’t use it and it’s in the configuration.

This menu here is completely configurable from some database tables. So you can just remove it from there. If you are afraid that, this module, who knows what’s in it, I don’t trust it, you can delete it and remove it from the menu and it’s fine. If you go to bigbrain.loris.ca, that’s actually what I did there. I took the Loris, there are modules written specifically for bigbrain.loris.ca. There’s a separate GitHub repository for that so I just checked that out into the modules directory and threw away the dicom_archive which has nothing to do with BigBrain, because it was easier and cleaner.

## Requirement for Sudo Access

So, we’ve been through a general walk through of all the code. Should I go into some of these framework classes?

> Samir: Does anyone have questions about how the structure of Loris is created or was 
> created? Is there any ambiguity?

> Question: Why do you need sudo access for installation?

In the Apache configuration, to configure the Apache. I think installation script creates some directories, like it creates a /data directory I think. So before the php composer, the Vender directory that I briefly mentioned, it used to require Pear, which installs php libraries system wide. So that had to be done with sudo. But that is no longer the case anymore. Now I think it might only be for Apache that it needs to be, that you need sudo access.

> Someone: Maybe some package or the imaging scripts.

Yeah, there’s also the imaging side of things, like the pipeline scripts that insert imaging data into the database.

> Samir: But I think probably this is also a commentary that maybe we could try to have 
> it so that it doesn’t require sudo access. Maybe the Apache could be configured separately.

So maybe I won’t go into these classes now. Maybe it would be better to leave time for figuring out what people want. What sort of schedule works for future workshops? Those sort of questions. Or I could explain a few of these classes.

## Testing Loris

> Question: I have a question for the testing part of Loris. You only test the logging in?

That is the only functional test that we have automated right now. We test things like, there’s a php program called PHP code sniffer, which does static analysis to ensure that the style is clean..

> Samir: But actual unit testing, it is part of our roadmap for this coming release

Yeah, we’re working on getting better with that.

## Topics for Future Workshops

Does anyone have any ideas for what they want?

> Tom: Yeah, two requests. It would be good if we could go through the MySQL tables, saying what each one does. Just a suggestion.

That is actually a good idea, but I think that would take hours, there’s a lot of them.

> Another suggestion is creating a module from scratch, so do you need to make Smarty templates?
> I have no idea. And how do you link it to your tables? Does it need to link to x table or y table?

I think those are good ideas, in fact that’s probably where I would have been going for the next workshop anyway. But before getting to that I think you need to have a basic understanding of the framework.

> Samir: So I think the point is, is that this is the first workshop of trying to give people 
> an idea of what Loris is, and how it works. But as we go along, we’re going to have other
> workshops that could be like that, exactly. One is to create a module. One is to create an 
> instrument. There’s other components that we haven’t really touched upon here, which is, like
> he said the base classes, actually going through the functions and showing you what they’re
> doing, there’s also we have Dave who’s created a data querying tool, or recreated a new one
> based on CouchDB which you’re very familiar with now. There’s also all the imaging preprocessing
> side that we deal with. There’s many components to Loris. There’s creating instruments, there’s
> the instrument builder. All these kinds of things, right? So going through each of them would
> probably be a one-hour workshop unto itself. So this is a good time to make those kinds of
> suggestions. If anyone else has other ones.

So I thought I would get to it today but it’s already been almost an hour, and I’m sure people are tired of listening to me. But it’s important to know what these classes are before you can write a module. Or we could do one on how to write a module, and then, just sort of implicitly use some of these, and then go back into more depth. I’m okay with either way. But I think from my perspective, there are a lot of components, as Samir said. It would make sense to me to stick to the php framework, like the front end part. And then go into one of the other code bases, like the data query tool, or mri insertions, instead of jumping around, so that people don’t get as confused.


## Example of Base Class - Database.class

> Samir: For today, you could just show one of these quickly. Just to show what it’s like and how 
> they’re organized a little bit, and then we could have a more detailed meeting on base classes

Sure, I’m just going to cheat a little and show.. oh wait, I can’t. I have a branch I created where I organized these better, because these different base classes do different things. There’s different subsets of these which are conceptually different. The Database class, for instance, is a wrapper around MySQL, to select, update, whatever from the database. CouchDB is obviously a similar one for CouchDB.

But then you have things like NDB_Menu which is, as I said earlier, not a menu but a specific type of page, NDB_Form a different specific type of page, which are different. The most important one is probably this Database.class, which is a wrapper around PDO, around php database objects, to write select statements, mostly also updates and inserts. Generally the ones that are wrappers around some sort of service like that have a singleton function as you see here, which retrieves the object, does the connection, does the initialization, whatever, and reuses that for further connections. And then it has functions, like “replace” , is a wrapper around the SQL replacekeyword, around MySQL replace, I don’t think that’s actually SQL standard.

Update is clearly a wrapper around SQL update of the table. You give it an array of what fields you want to set in the update, an array of the criteria that you want.

So that’s probably the single most important one, for writing things in Loris like modules. That, or the NDB_Config, which is a wrapper around our configuration structure. NDB_Config.

> Samir: And by the way, just as a little pop quiz, does anyone actually know what “NDB” stands for? 
> Who’s not a Loris developer? [silence] It stands for neurological database.

It’s still where my Loris is installed on my sandbox.

## Base Class - NDB_Config

So NDB_Config is the other most important one. It’s used for extracting settings either from the xml Config file or we now have database config. They’re conceptually the same, it’s just you want some sort of setting which it extracts it from various places. Loris may or may not have that Config.


## Documentation in the Code

So, any questions or thoughts or anything?

> Question: Is the PHP documentation of your code anywhere? I see you have a lot of docs in your code.

We don’t use php doc or anything like that.

> Samir: We used to

We used to not also have that much documentation. One of the things that php code sniffer really insists on, is that you document things, which is great. So we went through a phase of running php cs on everything, in the Apache root directory and the libraries directory. The modules directories haven’t had that treatment yet. So their documentation is of varying qualities, depending on who wrote it, and when and how old it is, and if they like documenting or not. But it would actually probably be a really good idea to run phpdoc, I think that’s the thing that generates it, on the php libraries directory, but we don’t currently do that.

> Samir: We did that before, so we have had copies of that

It wouldn’t be very hard.

> Samir: When we initially went through an iteration of Loris ten years ago, we organized it 
> such that phpdoc could read all the stuff. We need to constantly maintain it over the years, 
> and it isn’t so good. But what we have done in the last two years or so, is document the
> database in general, a lot more. How to install it.

The php/libraries directory documentation is actually pretty good. I went through it all when I was running php cs on everything and it’s documented as well as I understand it. So it’s probably a good idea to put that up some time, to autogenerate it and put that up somewhere. Especially since that is the documentation that you need. You probably don’t need code documentation on the modules. But you might, and it certainly wouldn’t hurt.

> Samir: Also, as more people are getting involved in this, it would be good as a general practice, 
> something that we all know but we don’t always do is to try to document whatever you work on. 
> So if you create a new module or there’s a new script or whatever, we’re trying really hard to 
> make sure that we document all the stuff and put it in an organized way everywhere. So if you’re 
> going to create electronic signatures, for example. One of the tasks for that, on top of creating 
> a test suite for it, is also to document it. So that will be good.

## Naming Conventions

Another sort of, not issue, but thing about autogenerated documentation, is that, like I said, this is just one big pile of classes right now, they are not namespaced in any way. And there are conceptually different things here, so there should be a name space enforced on it for that to be really useful, because you’re not going to come in and say, oh hey, I want to know about this NDB_BVL_InstrumentStatus. You’re going to say, I want to know, how do I get to the database? So we should enforce, we should use php namespaces. And that would make the documentation more useful, I think. We could just start by running the php doc.

> Question: Do we know the difference between the ones that have the NDB prefix and the ones that don’t? Is it just historical?

> Samir: There’s a lot of history. Initially they were part of a NDB class of certain functions. But then after a while we stopped putting them in, right? At his point.

It’s mostly historical. I was going to say that NDB_something are generally types of pages, but that’s not necessarily true because I just realized that there’s NDB_Client and NDB_Caller and NDB_Breadcrumb and those aren’t pages at all. So it’s mostly historic but I couldn’t even tell you why historically some of them have that and some don’t because it’s not based on their age. Like this SinglePointLogin.class is as old as some of these NDB things.

> Samir: There was logic in it. And SinglePoint was outside of the rest of the forms, so it was a separate thing. Anyway, it’s not important.

Yeah, it’s historic, and if we do go the route of using php name spaces, we might do that, and it would become “page”, which would make sense for, you know, a page within the Loris name space, which would make more sense than NDB_Page, at least to new people. So I guess that’s it.

## Request for Loris User Workshop

> Samir: Wait, one more question

> Question: I’m just going back to the requests for possible sessions, I think it would be helpful,
> it could even be half of a session, to have somebody who is sort of a power user of Loris to go
> through all the features and how the end user is actually using them?

Well, I think separately from Developers’ workshops, it would be a good idea to have Loris User workshops. I don’t think I’m the person to do that. But that would be a good idea

> Samir: We’re probably going to have one, this year for sure, with a project called CCNA, for example.
>  So you guys are going to have 40 sites, maybe, somewhere in that range, each with a ton of users who 
> don’t know how Loris works. So this would probably be a platform to have an actual users’ workshop. 
> Which we’ve had before, but when it was just one project with 8 sites, it was a lot easier. But we 
> still have a lot of people asking questions, giving their input on how they would like the gui 
> different, different functions. That will come.

I think that would also be a good presentation for the ADM meeting. Someone like Leigh or Penelope could do it. There could also be a longer one like that. But certainly it would be good to have Loris user training in addition to Loris developer training.

> Samir: In fact, maybe you just volunteered to be presenter for that.

## Scheduling

> We finished by discussing scheduling and agreed upon Tuesdays at 3:30 pm, every other week. The first one could be March 3. Email will be sent out to everyone on Loris-dev. If someone is not on this email list they should contact Samir or Christine.