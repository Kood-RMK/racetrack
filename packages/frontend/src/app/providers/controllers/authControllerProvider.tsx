import { createContext, ReactNode, RefObject, useRef } from "react";

export type AuthController = {
  tryAuthenticate: (token : string) => void;
}


const AuthControllerContext = createContext<RefObject<AuthController> | null>(null);


export const AuthControllerProvider = ({children} : {children : ReactNode}) => {

  const AuthController = useRef<AuthController>({
    tryAuthenticate: (token : string) => {
      console.error("AuthController: tryAuthenticate not implemented.");
    }
  });


}