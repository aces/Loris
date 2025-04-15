# Electrophysiology Browser

## Purpose

The Electrophysiology Browser is intended to allow users to view candidate
electrophysiology (EEG, MEG...) sessions collected for a study and any associated
annotations for each recording.

## Intended Users

The primary types of users are:
1. Electrophysiology researchers who want to know details about the inserted datasets.
2. Site coordinators or researchers ensuring the uploaded electrophysiology data have
been correctly inserted into LORIS.

## Scope

The Electrophysiology Browser displays electrophysiology datasets that have been
inserted into LORIS from a BIDS-format collection. Derived or processed electrophysiology
datasets can also be accessed and annotated via this module.

## Permissions

The Electrophysiology Browser uses the following permissions. Either of the first two is
sufficient to provide access to view data in the module. The third permission provides editing
permissions to add or modify annotations for data from the sites the user has access to in this module.

electrophysiology_browser_view_allsites
  - This permission gives the user access to all electrophysiology datasets present in the database.

electrophysiology_browser_view_site
  - This permission gives the user access to electrophysiology datasets from their own site(s) only.

electrophysiology_browser_edit_annotations
  - This permission allows the user to add, edit, and delete annotations for raw or derived datasets

## Download

You can download all the files related to a recording (channel information,
electrode information, task event information, the actual recording) -- as well as its annotations and their related metadata.

## Updating Derivative Files

New annotations or edits to existing annotations made through the browser must also be updated in the derivative files stored in the filesystem, before a user tries to download a derivative file package. To do this automatically, a script is provided under `tools/update_annotation_files.php`, and a cron job should be set up to execute it regularly, e.g. every evening.

## <a name="installation-requirements-to-use-the-visualization-features"></a> Installation requirements to use the visualization features

The visualization component requires Protocol Buffers v3.0.0 or higher (< v3.21 recommended, see [Troubleshooting section](#troubleshooting-error-when-trying-to-use-protobuf-v21-and-higher)).
For install instructions, you can refer to the Protocol Buffers GitHub page: https://github.com/protocolbuffers/protobuf

In order to automatically generate the protoc compiled files, add the following block in `modules/electrophysiology_browser/jsx/react-series-data-viewer/package.json`:
```
"scripts": {
  "postinstall": "protoc protocol-buffers/chunk.proto --js_out=import_style=commonjs,binary:./src/"
}
```
and run `make dev` or `npm install && npm run compile` from the loris root directory.

> Note: from 2022-05, [Protobuf numbering scheme changed](https://developers.google.com/protocol-buffers/docs/news/2022-05-06#versioning). For instance, version numbered `v21.x` means `v3.21.x`, depending on each maintained language. Once installed, check the version with `protoc --version`.

### Troubleshooting: error when trying to use Protobuf v21 and higher

As of June 2022, there are errors when trying to use Protobuf. In Loris, it translates by an error during `make` or `make install` saying:

```bash
...
protoc-gen-js: program not found or is not executable
Please specify a program using absolute path or make sure
the program is available in your PATH system variable
--js_out: protoc-gen-js: Plugin failed with status code 1.
...
```

The `protoc-gen-js` is lacking and needs to be generated from another project. To generate this executable, follow the following steps:

1. Install [Bazel from repo or through Bazelisk](https://bazel.build/install/bazelisk).
1. Clone and build the `protobuf-javascript` project locally with Bazel.

```bash
git clone https://github.com/protocolbuffers/protobuf-javascript
cd protobuf-javascript/
bazel build //generator:protoc-gen-js
```

Once build, the executable is located in `protobuf-javascript/bazel-bin/generator/protoc-gen-js`. To avoid calling `protoc-gen-js` everytime, copy it to a better place already referenced in `PATH`, such as `/usr/local/bin`.

```bash
cp protobuf-javascript/bazel-bin/generator/protoc-gen-js /usr/local/bin
```