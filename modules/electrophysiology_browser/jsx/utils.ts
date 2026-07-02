type PatientRecordingPath = {
  pscid: string;
  'visit_label': string;
};

type EventInstance = {
  TrialType?: string;
  EventValue?: string;
};

type EventExtraColumn = {
  PropertyName: string;
  PropertyValue: string;
};

export type RecordingEvents = {
  'hed_tags': unknown[];
  instances: EventInstance[];
  'extra_columns': EventExtraColumn[];
};

export type DatasetTags = Record<string, Record<string, unknown[]>>;

/**
 * Build the channel metadata URL for a recording.
 */
export function getRecordingChannelsURL(
  baseURL: string,
  patient: PatientRecordingPath,
  recordingName: string
): string {
  return `${baseURL}/api/v0.0.4-dev/candidates`
    + `/${patient.pscid}/${patient['visit_label']}`
    + `/recordings/${recordingName}`
    + `/channels`;
}

/**
 * Check whether a recording has HED tags.
 */
export function hasRecordingHED(
  events: RecordingEvents,
  datasetTags: DatasetTags
): boolean {
  return events['hed_tags'].length > 0 ||
    Object.keys(datasetTags).some((column) => {
      return Object.keys(datasetTags[column]).filter((columnValue) => {
        return datasetTags[column][columnValue].length > 0;
      }).some((columnValue) => {
        if (column === 'trial_type') {
          return events.instances.some((event) => {
            return event.TrialType === columnValue;
          });
        } else if (column === 'value') {
          return events.instances.some((event) => {
            return event.EventValue === columnValue;
          });
        }

        return events['extra_columns'].some((prop) => {
          return prop.PropertyName === column &&
            prop.PropertyValue === columnValue;
        });
      });
    });
}
