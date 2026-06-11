# Help Module Test Plan

1.  Click on help button at the top. Contextual pull-down should appear.
    [Manual Testing]
2.  Verify that contextual help text presentation is working - it's displayed for the right module - and that the help text for this module reflects its features.
    [Manual Testing]
3.  Click Close Button. Ensure it closes.
    [Manual Testing]
4.  Test Steps 1-3 for a few modules modules, their subpages, and instruments. All modules should take help content from their respective help.md files in their directory, while instruments’ help content is created and edited in the Edit Help section. (Feel free to open issues if you spot features not covered / updated in the Help text, though this is the responsibility of the module's tester.)
    [Manual Testing]
5.  Test the Admin Help Editor module.
    [Manual Testing]
6.  Test filter to ensure that it filters properly
    [Automation Testing]
7.  Test clear filter button.
    [Automation Testing]
8.  Ensure permission for Edit Help is working properly.
    [Manual Testing]
9.  Sort all header columns.
    [Manual Testing]
10.  Check multiple pages links.
   [Manual Testing]
11.  Test Preview - In the Help Editor, update title and content. Make sure the recent changes are visible (in real time) in the Help side panel.
    [Manual Testing]
12.  Test-edit an Instrument's help text, from the Help Editor module (e.g. bmi). Open the instrument form for a candidante and check that the changes took effect and are visible from the instrument.
    [Manual Testing]
13.  Test-edit a Module's contextual help text, by modifying the md file in that module's `help/` subdirectory.  Check that the update renders in the module front-end.
    [Manual Testing]
14.  Test-edit the help text for a Module's sub-page, (e.g. Imaging Browser (View Session subpage), or Dicom Archive, Electrophysiology Browser, Survey Module, etc) in the same manner.  Check that the update renders in the module front-end.
    [Manual Testing]
