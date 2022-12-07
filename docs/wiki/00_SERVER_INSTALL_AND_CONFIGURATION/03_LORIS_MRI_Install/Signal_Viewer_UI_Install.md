# EEG Visualization Install

> Last update: 2022-11-02

## Context

This document is a guide to install and configure Loris to use the `EEG Visualization` features.

## TOC

1. Install
    1. [Environment](#environment)
    1. [Installation requirements](#installation-requirements)
1. [Import EEG BIDS data to Loris](#import-eeg-bids-data-to-loris)

## Install

### Environment

- `Loris` `v24.0` or above.
- `Loris-MRI` installed.


### Installation requirements

Follow the [installation steps for the visualization features](https://github.com/aces/Loris/tree/main/modules/electrophysiology_browser#-installation-requirements-to-use-the-visualization-features).


## Import EEG BIDS data to Loris

Adapt and use the following `pipeline.sh` script. It will:
- take BIDS archives located in `/data/incoming`
- extract them to their folder in `/data/processing/bidsFiles/`
- move the archive to `/data/archive`
- import data into Loris DB with `/opt/$PROJECT_NAME/bin/mri/python/bids_import.py`

```bash
#!/usr/bin/env bash

# To execute periodically, add
# */15 * * * * cd /var/www/loris/project/tools && ./pipeline.sh
# in crontab -e

# change the <UPDATE_HERE> with your project name
PROJECT_NAME='<UPDATE_HERE>'
DATA_FOLDER='/data/'${PROJECT_NAME}

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
