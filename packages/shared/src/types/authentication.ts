export const RACETRACK_AUTH_COOKIE = "Authorization";
export const RACETRACK_AUTH_HEADER = "Authorization";

export enum RacetrackClientRole  {
    OBSERVER = 'OBSERVER',
    RECEPTIONIST = 'RECEPTIONIST',
    SAFETY = 'SAFETY',
    GUEST = 'GUEST'
} 

export type SignedToken = string;

export type AuthenicationRequest = {
    token?: string;
    isGuest?: boolean;
}

export type RacetrackAuthenticatedClient = {
    token: string;
    role: RacetrackClientRole;
}