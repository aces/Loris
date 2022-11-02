

# Signal Viewer UI Install

> Last update: 2022-11-02

## Context

This document is a guide to install and configure Loris HBCD to use the `Signal Viewer` UI for EEG (BIDS files).

## TOC

1. Install
    1. [Environment](#environment)
    1. [Versions](#versions)
    1. [Install Loris-MRI](#install-loris-mri)
    1. [Install Protobuf](#install-protobuf)
    1. [Update `electrophysiology_browser` module](#update-electrophysiology_browser-module)
    1. [Installed environment](#installed-environment)
1. [EEG upload to Loris](#eeg-upload-to-loris)
    1. [Get EEG files](#get-eeg-files)
    1. [Chunk EEG files](#chunk-eeg-files)
    1. [Import BIDS to Loris](#import-bids-to-loris)
1. [Troubleshooting](#troubleshooting)
    1. [BIDS import](#bids-import)

## Install

### Environment

> Note: right now, only `24.0 release` with `php 8.0` works. More recent versions are on the way.

Environment:
- `Ubuntu` machine
- A `Loris instance` at `24.0` release (or `24.0-release` branch)
- HBCD project should in `project` folder (`staging` branch)

### Versions

Versions:
- `php 8.0`, and all packages required for php and apache:

```bash
# install
sudo apt install -y \
    php 8.0 \
    php8.0-mysql \
    php8.0-xml \
    php8.0-mbstring \
    php8.0-gd \
    php8.0-zip \
    php8.0-curl \
    libapache2-mod-php8.0

# select php8.0
sudo update-alternatives --config php

# in Loris, update php deps
cd /path/to/loris
composer update

# make
make
make dev
```

- Apache2 with `php8.0` module enabled

```bash
# disable php modules in apache
sudo a2dismod php7.4
sudo a2dismod php8.1

# enable apache php 8.0 module
sudo a2enmod php8.0

# restart apache
sudo service apache2 restart
```

### Install Loris-MRI

Follow the steps mentionned in [Loris-MRI README.md](https://github.com/regisoc/Loris-MRI#installation). This includes the [BIC MNI toolkit](https://github.com/aces/Loris-MRI#3-install-minc-toolkit-from-httpbic-mnigithubio) and [a Loris database update](https://github.com/aces/Loris-MRI#4-run-installer-to-set-up-directories-configure-environment-install-perl-libraries-and-dicom-toolkit).

### Install Protobuf

Install [Protobuf](https://github.com/protocolbuffers/protobuf#protocol-compiler-installation). See also [PR #8193](https://github.com/aces/Loris/pull/8193) to install a recent version of Protobuf with current troubleshooting.

### Update `electrophysiology_browser` module

Update the module with the [step detailed for visualization features](https://github.com/aces/Loris/tree/main/modules/electrophysiology_browser#-installation-requirements-to-use-the-visualization-features).


```bash
# run
make
make dev
```

### Installed environment

At this point:

- languages installed:
    - python3
    - perl
- folders should be:
    - a project folder base in: `/data/$PROJECT_NAME`
    - MRI tools in:             `/opt/$PROJECT_NAME/bin/mri`
    - MINC tools in:            `/opt/minc`
    - MINC bins in:             `/opt/minc/$minc_version/bin` (and added to $PATH)
- the `~/.bashrc` file should have the environment for Loris-MRI scripts (e.g. `source /opt/$PROJECT_NAME/bin/mri/environment`).
- the environment used should be noted at the start of the shell prompt with `(loris-mri-python)` (if not, just disconnect, then reconnect to your session).

## EEG upload to Loris

### Get EEG files

> Note: from DICOM files? In an archive `.tar.gz`?

## Chunk EEG files

To generated chunks, use the script `eeglab_to_chunk.py`.

```bash
# python 3 is used through (loris-mri-python) env
cd /opt/$PROJECT_NAME/bin/mri
python ./python/react-series-data-viewer/eeglab_to_chunks.py -h

# usage: eeglab_to_chunks.py [-h] [--channel_index CHANNEL_INDEX]
#                            [--channel_count CHANNEL_COUNT]
#                            [--chunk-size CHUNK_SIZE]
#                            [--downsamplings DOWNSAMPLINGS]
#                            [--destination DESTINATION] [--prefix PREFIX]
#                            FILE [FILE ...]
#
# Convert .set files to chunks for browser based visualisation.
```

To get `.set` files, extract them from BIDS archive files.

```bash
# tar xzf $your_archive
# example with a ficitonal file named PIDCC0046_500574_V03_bids.ta.gz
tar xzf PIDCC0046_500574_V03_bids.ta.gz -C /data/archives/

# this should create
```

Then, use the `eeglab_to_chunk.py` to generate chunks.

```bash
# Use it on a `.set` file
cd /opt/$PROJECT_NAME/bin/mri/python/react-series-data-viewer
python eeglab_to_chunks.py /data/archives/PIDCC0046_500574_V03_bids/sub-PIDCC0046/ses-V03/eeg/sub-PIDCC0046_ses-V03_task-VEP_acq-eeg_eeg.set
```

By default

Chunks should be generated into
`/data/archives/PIDCC0046_500574_V03_bids/sub-PIDCC0046/ses-V03/eeg/sub-PIDCC0046_ses-V03_task-VEP_acq-eeg_eeg.chunks/`

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

PROJECT_NAME='hbcd'
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

