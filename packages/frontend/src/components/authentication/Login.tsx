import { ReactNode } from "react";


export const LoginWrapper = ({children} : {children : ReactNode}) => {

    



  return (
  );
};




export default function LoginCard() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-5xl font-bold">Login</h1>
            <form className="flex flex-col items-center justify-center w-full h-full">
                <input type="text" placeholder="Username" className="input" />
                <input type="password" placeholder="Password" className="input" />
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    )
}
    