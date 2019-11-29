## Notifier Class

### Description
  This class implements a module-specific operation-specific user-specific permission-checking site-checking system allowing to trigger automatic notifications to users from anywhere in the code. This code is meant to be extended by projects to accommodate different types of notifications with different formats depending on project preferences
 
  A basic implementation of this abstract class is found on loris, it uses basic emails to issue notifications. Projects are responsible of overriding the mentioned example to send different formats such as SMS, phone or HTML/email notifications. 
   
### Features

 - Project chooses notification services to be offered.
 - Project independently enables different services for each module/operation combination.
 - Project defines behaviour of `notify()` function to adapt it to its needs.
 - Users select which notifications they want, or do not want, to receive.
 - Only users with the proper permissions can subscribe to notifications for restricted operations.
 - Possibility of sending notifications "as administrator" to protect identity of user triggering the notification.


### Structure
- #### *SQL*
   - Table `notification_modules`:
     - Module/operation combination from which the `notify()` originates.
   - Table `notification_services`:
     - List of notification services that are made available by the project (email, SMS, phone, ...)
   - Table `notification_modules_services_rel`:
     - Populated by projects independently, defines which services will be available for which modules.
   - Table `users_notifications_rel`:
     - Populated from the "My Preferences" user menu by selecting or un-selecting services for modules.
   - Table `notification_modules_perm_rel`:
     - Map of permissions necessary for each module/operation combination. Only users with the complete set of permissions will receive the concerned notifications.
     
- #### *PHP* 
   The ***NDB_Notifier_Abstract.class.inc*** implements the entire notification logic with the exception of the `notify()` function. In order to use the Notifier system, the project must choose to implement its own extension of the notifier class or use the basic model provided by loris. The abstract parent provides, upon instantiation of the child object, a list of users which will be notified by this specific event. A set of Static helper functions allows programmers to query different characteristics of the current state of the system (modules enabled, services, services per module, ...).
   
   The ***NDB_Notifier.class.inc*** implements the `abstract notify()` function to manage the behaviour of the notifications being issued. If project uses different services then the basic text emails, it is within there capacity to modify and implement the procedure for each service independently. An example implementation is available on loris and used in the media and document-repository modules. 
   
- #### *TPL*
   Email templates are located in the `smarty/templates/email` directory on the loris root. These templates can be in text or html format (examples of each formats are available).
 
### Getting Started

 1. Populate the `notification_modules`, `notification_services` and `notification_modules_services_rel` tables from the back-end.
 1. Make sure the user-emails are valid (if testing this module, make sure users are not real but emails are still valid).
 1. Make sure the php mail server is properly setup (postfix).
 1. All module/operations in the `notification_modules` table should be instantiating and calling the `notify()` function with the proper parameters.
 1. Unless the *asAdmin* flag is used, outputted notifications will contain the target user email and the trigger user information as well.
 
