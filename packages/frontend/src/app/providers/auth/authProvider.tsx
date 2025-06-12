import { getBrowserCookies } from '@/utils/cookies';
import jwt from 'jsonwebtoken';
import { RACETRACK_AUTH_COOKIE, RacetrackAuthenticatedClient } from 'racetrack-shared/types';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type AuthenticationState = {
    isAuthenticated: boolean;
    racetrackClient: RacetrackAuthenticatedClient | null;
    jwt : string | null;
}


export interface AuthenticationStateContext {
    authState: AuthenticationState;
    authenticate: (token : string) => Promise<AuthenticationState>;
 }

const AuthenicationStateContext = createContext<AuthenticationStateContext | null>(null);


export const AuthenticationProvider = ({children} : {children : ReactNode}) => {

    const [authState, setAuthState] = useState<AuthenticationState>({
        isAuthenticated: false,
        racetrackClient: null,
        jwt: null,
    });

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

    useEffect(() => {
        const cookies = getBrowserCookies()

        console.log("[AUTH]: Cookies found:", cookies);
        const jwtToken = cookies[RACETRACK_AUTH_COOKIE];
        const authenticatedClient : RacetrackAuthenticatedClient | null = jwtToken ? tryExtractJwtData(jwtToken) : null;

        setAuthState({
            isAuthenticated: authenticatedClient == null ? true : false,
            racetrackClient: authenticatedClient,
            jwt: jwtToken,
        });
    }, [])


    const authenticate = async (token : string) : Promise<AuthenticationState> => {
        const body = { token: token };
        const headers = { 'Content-Type': 'application/json' };
        const result = await fetch(`${window.location.origin}/auth`, {
            method : 'POST',
            credentials: 'include',
            body : JSON.stringify(body),
            headers})

        if (result.status === 200) {
            const jwtToken = result.headers.get(RACETRACK_AUTH_COOKIE);
            if (jwtToken) {
                const authenticatedClient : RacetrackAuthenticatedClient | null = tryExtractJwtData(jwtToken);
                setAuthState({
                    isAuthenticated: true,
                    racetrackClient: authenticatedClient,
                    jwt: jwtToken,
                });
            }
        }

        return {
            isAuthenticated: false,
            racetrackClient: null,
            jwt: null,
        };
    }

    return (
        <AuthenicationStateContext.Provider value={{authState, authenticate}}>
            {children}
        </AuthenicationStateContext.Provider>
    )
}

export const useAuthentication = () : AuthenticationStateContext => {
  const context = useContext(AuthenicationStateContext);

  if (!context) {
    throw new Error("useAuthentication must be used within an AuthStateProvider");
  }

  return context;
};