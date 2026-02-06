# Policy Tracker Module

The Policy Tracker module provides a mechanism for displaying policies (such as Terms of Use or data usage agreements) to users and recording their acceptance or rejection.

It allows LORIS modules to require users to review and accept a policy before continuing to use certain functionality.

---

## Features

- Displays policy pop-ups using a modal dialog (via the PolicyButton React component).
- Allows users to accept or decline a policy.
- Stores user decisions in the database.
- Supports policy renewal after a configurable time period.
- Supports showing a policy button in the page header.
- Can be integrated with other modules (e.g., login, dataquery).

---

## Database Tables

This module introduces the following database tables:

### `policies`
Stores the available policies.

Important fields:
- `Name` – Policy name
- `Version` – Policy version number
- `ModuleID` – Module the policy applies to
- `Content` – Policy text shown to the user
- `SwalTitle` – Title shown in the popup
- `HeaderButtonText` – Text for the header button
- `PolicyRenewalTime` – Time before requiring re-acceptance
- `PolicyRenewalTimeUnit` – Renewal unit (D, M, Y, H)
- `Active` – Whether the policy is active

### `user_policy_decision`
Stores user decisions.

Important fields:
- `UserID`
- `PolicyID`
- `Decision` (Accepted or Declined)
- `DecisionDate`

---

## API Endpoint

The module exposes the following endpoint:
POST /policy_tracker/policies

This endpoint records a user's decision for a given policy.

Payload example:
```json
{
  "PolicyName": "login_example",
  "decision": "Accepted"
}

```

## Frontend Integration

The frontend displays a policy button using the PolicyButton React component.
When a policy requires user action, a modal dialog is shown containing the policy text and options to accept or decline.

The user's decision is then sent to the backend API endpoint and stored in the database.

## Policy Renewal

Policies can be configured to require re-acceptance after a specified period of time using the PolicyRenewalTime and PolicyRenewalTimeUnit fields.