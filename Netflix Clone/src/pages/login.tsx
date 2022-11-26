import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import netflixLogo from "../assets/Netflix_Logo_RGB.png";
import { useAuth } from "../common/auth";

export default function Login(){
    const {signIn}=useAuth();
    const navigate=useNavigate();
    async function authenticateUser(event:React.SyntheticEvent){
        const {email,password}=event.target as typeof event.target & {email:HTMLInputElement; password:HTMLInputElement};
        event.preventDefault();
        const user=await signIn(email.value,password.value)        
        if(user){
            navigate("/");
        }
    }
    return <>
        <header className="relative w-56 z-[1]">
            <img className="w-full h-full " src={netflixLogo} alt="Netflix logo" />
        </header>
        <main>
            <section className={`-z-[1] absolute top-0 bg-[url("/Netflix-Background.jpg")] w-full min-h-screen bg-cover`}></section>
            <section className="absolute inset-0 bg-gradient-to-b from-zinc-900/50"></section>
            <form onSubmit={authenticateUser} className="relative min-h-[70vh] bg-black/75 w-[450px] mx-auto p-16 rounded-lg">
                <article>
                    <h1 className="text-4xl mb-4">Sign In</h1>
                    <section className="flex flex-col gap-4">
                        <input className="rounded-md p-2 bg-zinc-500 text-gray-300 outline-none" type="email" name="email" id="email" />
                        <input className="rounded-md p-2 bg-zinc-500 text-gray-300 outline-none" type="password" name="password" id="password" />
                        <button className="my-8 rounded-md p-2 font-semibold bg-netflixRed outline-none">Sign In</button>
                    </section>
                    <p>New to Netflix? Sign up now.</p>
                </article>
            </form>
        </main>
    </>
}