/**
 * Image file informations
 */
interface Image {
  FileID: number;
  Filename: string;
  FullFilename: string;
  APIFile: string;
  Caveat: boolean;
  Comment: string | null;
  EditableCaveat: boolean;
  New: boolean;
  OtherTimepoints: number;
  QCDate: string; // timestamp
  QCStatus: QcStatus;
  SNR: string; // float
  Selected: boolean | null;
  SourceFile: string; // may be empty
  Tool: string | null;
  headers: ImageHeaders;
  files: ImageFiles;
  HasQCPerm: boolean; // it is a user permission, not related to the image
  // so it should be factored out in the future
}

/**
 * Image headers
 */
interface ImageHeaders {
	AcquisitionDate: string; // YYYY-MM-DD
	AcquisitionProtocol: string;
	CoordinateSpace: string;
	EchoNumber: number;
	EchoTime: number;
	ImageType: string;
	InsertedDate: string; // date timestamp format
	IntergradientRejected: string | null;
	InterlaceRejected: string | null;
	InversionTime: number;
	NumVolumes: number;
	OutputType: string;
	PhaseEncodingDirection: string | null;
	ProcDate: string | null;
	ProcessingPipeline: string | null;
	RepetitionTime: number;
	SeriesDescription: number;
	SeriesNumber: number;
	SeriesUID: string;
	SliceThickness: number;
	SlicewiseRejected: string | null
	TotalRejected: string | null
	Xstep: number;
	Ystep: number;
	Zstep: number;
}

/**
 * Paths to auxiliary image files.
 */
interface ImageFiles {
  protocol: string | null; /* XML protocol */
  report: string | null; /* XML report */
  nrrd: string | null;
  nii: string | null; /* NIFTI file */
  bval: string | null;
  bvec: string | null;
  json: string | null; /* BIDS JSON file */
}

type QcStatus = 'Pass' | 'Fail';

export {
  Image,
  ImageHeaders,
  ImageFiles,
  QcStatus,
};
