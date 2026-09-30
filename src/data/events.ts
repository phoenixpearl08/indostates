import { healthEventsData as centralizedEvents } from './hospitalData';

/**
 * CENTRALIZED HEALTH EVENTS DATA RE-EXPORT
 * Single authoritative source: masterHospitalData.events in src/data/hospitalData.ts
 */
export const healthEventsData = centralizedEvents;
export default healthEventsData;
