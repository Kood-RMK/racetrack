import { createContext, ReactNode, useContext, useState } from "react";

export type AuthenicationState = {
    isAuthenticated: boolean;
    rawToken: string | null;
    userId: string | null;
    userRoles: string[] | null;
}


export interface AuthenicationStateContextType {
    authState: AuthenicationState;
    setAuthState: React.Dispatch<React.SetStateAction<AuthenicationState>>;
 }

const AuthenicationStateContext = createContext<AuthenicationStateContextType | null>(null);


export const AuthStateProvider = ({children} : {children : ReactNode}) => {

    const [authState, setAuthState] = useState<AuthenicationState>({
        isAuthenticated: false,õ,
        rawToken: null,
        userId: null,
        userRoles: null,
    });

    return (
        <AuthenicationStateContext.Provider value={{authState, setAuthState}}>
            {children}
        </AuthenicationStateContext.Provider>
    )
}

export const setAuthState = (newState: AuthenicationState) => {
    const authStateContext = useContext(AuthenicationStateContext);

    if (authStateContext === null) {
        throw new Error("setAuthState must be used within an AuthStateProvider");
    }

    authStateContext.setAuthState(newState);
}

export const useAuthState = () : AuthenicationState | null => {
  const context = useContext(AuthenicationStateContext);

  if (!context) {
    throw new Error("useAuthState must be used within an AuthStateProvider");
  }

  return context.authState;
};