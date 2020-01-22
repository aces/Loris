# Schedule Module

## Purpose

The schedule module allows users to create, edit, delete, and view appointments for preexisting sessions, as well as keep track of data entry 

## Intended Users

The schedule module is intended for study sites to store their appointments. 

## Scope

Users can create, edit, delete, and view appointments. They can also check the data entry status of each appointment. 

## Configurations

None

## Permissions

Users can only access the module if they have the permission `schedule_module` 

## Interactions with LORIS

The schedule module depends on the session table; appointments can only be created for already existing sessions.

The appointment list links to the candidate's visit list and the timepoint for the appointment.
