# Instrument Builder

## Purpose

The instrument builder provides a graphical interface for users to
design and build instruments to be installed on a LORIS instance.

## Intended Users

The instrument builder is intended to be used by non-programmers who
need to construct instruments to install in LORIS.

## Scope

The instrument builder module only builds the instrument and saves them
to the user's local filesystem. It does not install the instrument
(see: the `instrument_manager` module for that) or provide data entry
capabilities.

## Permissions

The `instrument_builder` permission is required to access the module.

## Configurations

None.

## Interactions with LORIS

None. (The instrument builder is entirely written in client-side
javascript.)
