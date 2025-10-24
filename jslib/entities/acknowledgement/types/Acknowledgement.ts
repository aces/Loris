export interface Acknowledgement {
  ordering: number,
  fullName: string,
  citationName: string,
  affiliations: string,
  degrees: string,
  roles: string,
  startDate: string, // to be converted to Date object when possible
  endDate: string, // to be converted to Date object when possible
}
