# Policy Tracker

## Purpose

The Policy Tracker module is intended to provide infrastructure for managing and tracking user acceptance of policies (e.g., Terms of Use, Data Use Agreements). It ensures that users have agreed to the latest versions of required policies before accessing specific LORIS modules or the system as a whole.

## Scope

The scope of this module includes:
-   **Forced Acceptance**: blocking access to specific modules until the user accepts the defined policy.
-   **Versioning**: requiring users to re-accept policies when a new version is released.
-   **Renewal**: enforcing policy re-acceptance after a configurable time period (e.g., monthly).
-   **Audit Trail**: maintaining a log of user user acceptances and declinations.

## Configurations

This module does not use the standard Config module. Instead, policies are "configured" by inserting records into the `policies` table.

Administrators can configure:
-   **Module Enforcement**: Link a policy to a specific module ID.
-   **Renewal Terms**: Set a valid duration (e.g., 365 Days) for the agreement.
-   **Header Visibility**: Toggle a "Terms of Use" button in the global header.

## Interactions with LORIS

-   **Module Access Control**: The `NDB_Page` core library checks this module's records when loading any LORIS page. If a policy is active for the requested module and the user hasn't accepted it (or it has expired), the policy acceptance modal is shown to the user.
-   **Header Button**: If configured, the `PolicyButton` component in the header appears to display the active policy for the current page.

## Technical Implementation

### Database Schema

Two tables manage the policy tracking:

1.  **`policies`**: Stores the policy definitions.
    -   `PolicyID`: Unique ID.
    -   `Name`: Internal name of the policy.
    -   `Version`: Integer version number. Incrementing this forces re-acceptance.
    -   `ModuleID`: FK to the `modules` table, each Policy is assigned to a module which determines when and how it is shown.
    -   `Content`: HTML content of the policy text.
    -   `SwalTitle`: Title displayed in the modal window.
    -   `PolicyRenewalTime`: Number of units (e.g., 365) for renewal.
    -   `PolicyRenewalTimeUnit`: Unit of time ('D', 'M', 'Y', 'H') for renewal.
    -   `HeaderButton`: ('Y'/'N') Whether to show a button in the page header.
    -   `HeaderButtonText`: Text to display on the header button (e.g., "Terms of Use").
    -   `AcceptButtonText`: Text for the accept button (default: "Accept").
    -   `DeclineButtonText`: Text for the decline button (default: "Decline").
    -   `Active`: ('Y'/'N') whether the policy is currently enforced.

2.  **`user_policy_decision`**: Logs user interactions.
    -   `UserID`: FK to `users` table.
    -   `PolicyID`: FK to `policies` table.
    -   `Decision`: 'Accepted' or 'Declined'.
    -   `DecisionDate`: Timestamp of the decision.

### Backend

-   **`NDB_Page` Class**: The base page class in LORIS (`php/libraries/NDB_Page.class.inc`) contains core methods (`getPolicy()`, `getLatestPolicyDecision()`) to check policy status during page load.
-   **API Endpoint**: The `policy_tracker` module (`modules/policy_tracker/php/module.class.inc`) exposes a POST endpoint to receive user decisions.

### Frontend

-   **`PolicyButton` Component**: A React component (`jsx/PolicyButton.js`) renders the policy modal (using SweetAlert2) and communicates with the backend API. It handles the user flow for accepting or declining policies.
