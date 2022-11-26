import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import netflixLogo from "../assets/Netflix_Logo_RGB.png"
import Notification from "@heroicons/react/24/outline/BellIcon";
import SearchBar from './search-bar';
import ProfileMenu from './profile-menu';

export default function Header(){
    const [fixed,setFixed]=useState(false);
    function isActiveLink({isActive}:{isActive:boolean}){
        return isActive? "font-semibold text-white" : undefined;
    }

    function onWindwoScroll(){
        if(window.scrollY>8){
            setFixed(true);
        }
        else{
            setFixed(false);
        }
    }

    useEffect(()=>{
        window.addEventListener("scroll",onWindwoScroll);

        () => window.removeEventListener("scroll",onWindwoScroll);
    },[]);

    return (<header className={`py-2 z-10 pr-16 ${fixed?"fixed top-0 bg-dark":"relative bg-transparent"} transition-colors duration-300 ease-linear w-full`}>
        <nav className="grid grid-cols-[200px_auto_auto] items-center gap-4">
            <section className="h-14">
                <Link to="/browse">
                    <img className="h-full w-full object-contain" src={netflixLogo} alt="Netflix Logo" />
                </Link>
            </section>
            <section className="text-base text-gray-300 font-normal">
                <ul className="flex gap-8">
                    <li>
                        <NavLink className={isActiveLink} to="/browse">Home</NavLink>
                    </li>
                    <li>
                        <NavLink className={isActiveLink} to="/browse/genre">TV Shows</NavLink>
                    </li>
                    <li>
                        <NavLink className={isActiveLink} to="/browse/genre/movies">Movies</NavLink>
                    </li>
                    <li>
                        <NavLink className={isActiveLink} to="/latest">New & Popular</NavLink>
                    </li>
                </ul>
            </section>
            <section className="flex items-center gap-4 justify-self-end">
                <SearchBar />
                <Notification className="w-8 h-8" />
                <ProfileMenu />
            </section>
        </nav>
    </header>
    );
}