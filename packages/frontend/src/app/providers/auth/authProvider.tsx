import { getBrowserCookies } from '@/utils/cookies';
import jwt from 'jsonwebtoken';
import { RACETRACK_AUTH_COOKIE, RacetrackAuthenticatedClient } from 'racetrack-backend/services';
import { createContext, ReactNode, useContext, useState } from "react";

export type AuthenticationState = {
    isAuthenticated: boolean;
    racetrackClient: RacetrackAuthenticatedClient | null;
}


export interface AuthenicationStateContextType {
    authState: AuthenticationState;
    authenticate: (token : string) => void;
 }

const AuthenicationStateContext = createContext<AuthenicationStateContextType | null>(null);


export const AuthStateProvider = ({children} : {children : ReactNode}) => {

    function tryExtractJwtData(signedJwt: string) : RacetrackAuthenticatedClient | null {
        const data = jwt.decode(signedJwt);

        if (data && typeof data === 'object') {
            const { role, token } = data as RacetrackAuthenticatedClient;

            return {
                role: role,
                token: token,
            };
        }

        return null;
    }

    const cookies = getBrowserCookies()
    const jwtToken = cookies[RACETRACK_AUTH_COOKIE];
    const authenticatedClient : RacetrackAuthenticatedClient | null = jwtToken ? tryExtractJwtData(jwtToken) : null;

    const authState : AuthenticationState = {
        isAuthenticated: authenticatedClient ? true : false,
        racetrackClient: authenticatedClient,
    }



    const authenticate = (token : string) => {
        const body = { token: token };
        const headers = { 'Content-Type': 'application/json' };
        fetch('http://localhost:3001/auth', {method : 'POST', body : JSON.stringify(body), headers})
    }

    return (
        <AuthenicationStateContext.Provider value={{authState, authenticate}}>
            {children}
        </AuthenicationStateContext.Provider>
    )
}

export const getAuthState = () : AuthenticationState => {
  const context = useContext(AuthenicationStateContext);

  if (!context) {
    throw new Error("useAuthState must be used within an AuthStateProvider");
  }

  return context.authState;
};