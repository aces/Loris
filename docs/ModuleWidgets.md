## Module Widgets

Since LORIS 23.0, LORIS incorporates a concept of "widgets" which
modules can use to dynamically display graphical widgets in other
modules when installed and activated. This is a powerful way to
extend the capabilities of other modules within a new module.

Widgets are can be used by implementing the `getWidgets` method
on a `Module` module descriptor class. The first parameter of
`getWidgets` is a type string, allowing modules to define their
own widget types in a loosely coupled manner. However since the
interface is abstract enough to be flexible there must be an implied
contract between what options and their returned values that are not
enforced by PHP's typing system.

Widget types currently implemented by LORIS and its default modules are

# Dashboard

- The 'dashboard' type displays a widget on the dashboard (default landing
  page) of LORIS. No options are passed and the return of getWidgets is
  expected to be an array of `\LORIS\dashboard\Widget` elements.
- The 'usertasks' type widget gets added to the LORIS dashboard in the 
  'My Tasks' panel to display outstanding user tasks. No options are passed
  and the return value is expected to be an array of `\LORIS\dashboard\TaskWidget`
  elements (usually created by `\LORIS\dashboard\TaskQueryWidget` which generates
  the widget from an SQL query.

# Candidate Profile

- The 'candidate' type displays a widget on the `candidate_profile` page. The
  options passed include a 'candidate' key which is a `\Candidate` object.
  The return value is expected to be an array of `LORIS\candidate_profile\CandidateWidget`;
  which each get displayed in their own card of the page.
- The 'candidateinfo' type displays extra information in the 'Candidate Info'
  card of the profile. The options passed are the same as for the 'candidate'.
  The return value is expected to be an array of `LORIS\candidate_profile\CandidateInfo`
  elements consisting of terms to render into the existing card and the value of
  the term.
