import { masterHospitalData } from './hospitalData';

/**
 * CENTRAL HOSPITAL CONFIGURATION RE-EXPORT
 * This re-exports the single authoritative hospitalInfo object from masterHospitalData
 * to guarantee there is zero duplicate configuration across components.
 */
export const hospitalInfo = masterHospitalData.hospitalInfo;
export default hospitalInfo;
