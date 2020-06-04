# Behavioural Feedback


## Purpose

The Feedback module allows users to flag and comment on  behavioural database fields.

## Permissions

The `bvl_feedback` permission is required to access the behavioural feedback module.

## Configurations

Two default feedback types exist: input and scoring errors. Additional feedback types can be added to feedback_bvl_type table.

## Interactions with LORIS

The Feedback module registers widgets on the dashboard.

### Dashboard Widget

The Dashboard Widget `Behavioural Feedback Notifications` tracks issues and corrections to behavioural/clinical data points on 3 different levels: 
Profile, Visit and Instrument.
