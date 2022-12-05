import React from "react";
import { Link, useNavigate } from "react-router-dom";
import netflixLogo from "../assets/Netflix_Logo_RGB.png";
import { useAuth } from "../common/auth";

export default function Registration(){
    const {signUp,user}=useAuth();
    const navigate=useNavigate();

    async function registerUser(event:React.SyntheticEvent){
        event.preventDefault();
        const {email,password}=event.target as typeof event.target & {email:HTMLInputElement; password:HTMLInputElement};
        await signUp(email.value,password.value);
        navigate("/login");
    }
    return <>
        <header className="relative w-56 z-[1]">
            <img className="w-full h-full " src={netflixLogo} alt="Netflix logo" />
        </header>
        <main>
            <section className={`-z-[1] absolute top-0 bg-[url("/Netflix-Background.jpg")] w-full min-h-screen bg-cover`}></section>
            <section className="absolute inset-0 bg-gradient-to-b from-zinc-900/50"></section>
            <form onSubmit={registerUser} className="relative bg-black/75 w-[350px] mx-auto p-16 rounded-lg">
                <article className="text-gray-300">
                    <h1 className="text-4xl mb-4 text-white">Sign Up</h1>
                    <section className="flex flex-col gap-4">
                        <input className="rounded-md p-2 bg-zinc-500 outline-none" type="email" name="email" id="email" placeholder="Enter username" />
                        <input className="rounded-md p-2 bg-zinc-500 outline-none" type="password" name="password" id="password" placeholder="Enter password" />
                        <button className="my-8 rounded-md p-2 font-semibold bg-netflixRed outline-none text-white">Sign Up</button>
                    </section>
                    <p>Already have an account? <Link className="text-white" to={"/login"}>Sign in now</Link>.</p>
                </article>
            </form>
        </main>
    </>
}