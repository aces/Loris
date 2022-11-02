

# Signal Viewer UI Install

> Last update: 2022-11-02

## Context

This document is a guide to install and configure Loris to use the `EEG Visualization` features.

## TOC

1. Install
    1. [Environment](#environment)
    1. [Install Protobuf](#install-protobuf)
    1. [Update `electrophysiology_browser` module](#update-electrophysiology_browser-module)
1. [Import BIDS to Loris](#import-bids-to-loris)
1. [Troubleshooting](#troubleshooting)
    1. [BIDS import](#bids-import)

## Install

### Environment

> Note: right now, only `24.0 release` with `php 8.0` works. More recent versions are on the way.

Environment:
- A `Loris instance` at `24.0` or above.
- `Loris-MRI` installed.

### Install Protobuf

Install [Protocol Buffer (Protobuf)](https://github.com/protocolbuffers/protobuf#protocol-compiler-installation) (`3.x.x` recommended). For `v21.x.x` troubleshooting see [this section](https://github.com/aces/Loris/modules/electrophysiology_browser/README.md#troubleshooting-error-when-trying-to-use-protobuf-v21-and-higher).

### Update `electrophysiology_browser` module

Follow the [installation steps for the visualization features](https://github.com/aces/Loris/tree/main/modules/electrophysiology_browser#-installation-requirements-to-use-the-visualization-features).


```bash
# run
make
make dev
```

## Import BIDS to Loris

One script import BIDS files into Loris.

```bash
ls /opt/$PROJECT_NAME/bin/mri/python/bids_import.py
```

But the whole pipeline is already written. Adapt and use the following `pipeline.sh` script. It will:
- take BIDS archives located in `/data/incoming`
- extract them to their folder in `/data/processing/bidsFiles/`
- move the archive to `/data/archive`
- import data into Loris DB with `bids_import.py`

```bash
#!/usr/bin/env bash

# To execute periodically, add
# */15 * * * * cd /var/www/loris/project/tools && ./pipeline.sh
# in crontab -e

# change the <UPDATE_HERE> with your project name
PROJECT_NAME='<UPDATE_HERE>'
DATA_FOLDER='/data/${PROJECT_NAME}'

source /opt/$PROJECT_NAME/bin/mri/environment

# use nullglob in case there are no matching files
shopt -s nullglob

# check if new archives were uploaded in DATA_FOLDER/incoming
archives=(${DATA_FOLDER}/incoming/*.tar.gz)

for ((i=0; i<${#archives[@]}; i++)); do
    folder=$(date +"%F-%T")

    # untar the archive in processing
    mkdir -p ${DATA_FOLDER}/processing/bidsFiles/${folder}/
    tar xvzf "${archives[$i]}" -C ${DATA_FOLDER}/processing/bidsFiles/${folder}/

    # move the archive in archives
    mv "${archives[$i]}" ${DATA_FOLDER}/archives/

    # locate dataset_description.json and extract path
    path=$(dirname $(find ${DATA_FOLDER}/processing/bidsFiles/${folder} -type f -name "dataset_description.json"))

    # import
    python3 /opt/${PROJECT_NAME}/bin/mri/python/bids_import.py -d "$path" -p database_config.py -csv

    if [ $? -eq 0 ]
    then
      # if import successful delete the folder in processing
      echo "Successfully imported ${DATA_FOLDER}/processing/bidsFiles/${folder}"
      rm -R ${DATA_FOLDER}/processing/bidsFiles/${folder}
    else
      echo "Could not import ${DATA_FOLDER}/processing/bidsFiles/${folder}" >&2
    fi
done
```

Data should be extracted to

```bash
# extracted BIDS archive files
ls /data/$PROJECT_NAME/data/bids_imports
```





## Troubleshooting

### BIDS Import

> Note: this should change, participants and events should have their data right.

#### Extract BIDS file

```bash
# extract
tar xzf PIDCC0046_500574_V03_bids.tar.gz
```

#### Update EEG data participants

```bash
# change the participants data
nano PIDCC0046_500574_V03_bids/participants.tsv

# should be added: the `site name` and the `project name`
# here is an example with `site = Data Coordinating Center`
# and `project = Pumpernickel`
# participant_id  age     sex     hand    site    subproject      project
# sub-PIDCC0046   -23     Female          Data Coordinating Center                Pumpernickel
```

#### Update events files

```bash
# events files
ls -l /data/$PROJECT_NAME/data/bids_imports/PIDCC0046_V03_BIDSVersion_1.6.0/sub-PIDCC0046/ses-V03/eeg/sub-PIDCC0046_ses-V03_*_events.tsv
```

Those files should have a `response_time` column with `0` values as base. Some `NaN`, `nan`, or `null` values are errors. change those by `0`.

Referenced in [Issue #365](https://github.com/aces/HBCD/issues/365)


#### Recompress BIDS archive

```bash
# compress back the folder into one tar
tar czf PIDCC0046_500574_V03_bids.tar.gz PIDCC0046_500574_V03_bids/
```

