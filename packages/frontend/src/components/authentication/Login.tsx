import { AuthenticationState, useAuthentication } from "@/app/providers/auth/authProvider";
import { RacetrackClientRole } from "racetrack-shared/types";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { Button, Form, Input, Label, TextField } from "react-aria-components";


export type LoginWrapperProps = {
    options: {
        permittedRoles: RacetrackClientRole[];
    }
    children: ReactNode;
}

export const LoginWrapper = ({children, options} : LoginWrapperProps) => {

    const { permittedRoles } = options;
    const authProvider = useAuthentication();
    const { authState, authenticate } = authProvider;

    
    const isPermitted = (authState : AuthenticationState) =>  authState.isAuthenticated
     && authState.racetrackClient?.role
     && permittedRoles.includes(authState.racetrackClient?.role);

     const handleSubmit = async (token: string, setError : Dispatch<SetStateAction<string>>) => {
        const result = await authenticate(token);

        if (result && isPermitted(result)) {
            setError("");
        } else  {
            setError("Invalid token or insufficient permissions.");
        }
     }
  return (<>
    {isPermitted(authState) ? children : 
    
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <TokenLoginCard onSubmit={handleSubmit} />
      </div>
    </div>
    }
  </>);
};


interface TokenLoginProps {
  onSubmit: (token: string, setError : Dispatch<SetStateAction<string>>) => void
  title?: string
  description?: string
  buttonText?: string
}

export function TokenLoginCard({
  onSubmit,
  title = "Login with Token",
  description = "Enter your access token to continue",
  buttonText = "Login",
}: TokenLoginProps) {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    onSubmit?.(token, setError)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <TextField className="grid w-full gap-1.5" isRequired>
            <Label className="text-sm font-medium text-gray-700">Accesss Token</Label>
            <Input
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? "border-red-500" : ""}`}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your token"
            />
            {error && <div className="text-sm text-red-500">{error}</div>}
          </TextField>

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {buttonText}
          </Button>
        </Form>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-center text-gray-500">Secure token-based authentication</p>
      </div>
    </div>
  )
}