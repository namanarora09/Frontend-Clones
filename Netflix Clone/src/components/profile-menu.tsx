import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../common/auth";
import { useProfilesContext, useProfilesDispatchContext } from "../common/profiles-context";
import { UserProfile } from "../common/types";

export default function ProfileMenu(){
    const {signOut}=useAuth();
    const [showMenu,setShowMenu]=useState(false);
    const profileMenuContainer=useRef<HTMLElement>(null);
    const timerId=useRef(0);
    const navigate=useNavigate();
    const userProfiles=useProfilesContext();
    const dispatch=useProfilesDispatchContext();
    const currentProfile=userProfiles?.profiles.find(profile=>profile.id===userProfiles.selectedProfileId);
    function onMouseEnter(){
        if(timerId.current){
            clearTimeout(timerId.current);
        }
        setShowMenu(true);
    }
    function onMouseExit(){
        timerId.current=window.setTimeout(() => {
            setShowMenu(false);
        }, 300);
    }
    useEffect(()=>{
        profileMenuContainer.current?.addEventListener("mouseenter",onMouseEnter)
        profileMenuContainer.current?.addEventListener("mouseleave",onMouseExit)

        return ()=>{
            profileMenuContainer.current?.removeEventListener("mouseenter",onMouseEnter)
            profileMenuContainer.current?.removeEventListener("mouseleave",onMouseExit)
        }
    },[])

    async function signOutOfNetflix(){
        await signOut();
        dispatch({type:"load",payload:null})
        navigate("/login");
    }

    function loadProfile(profile:UserProfile){
        dispatch({type:"current",payload:profile});
        window.location.reload();
    }

    return( 
        <section ref={profileMenuContainer} className="relative">
            <section className="flex items-center gap-2">
                <img className="h-10 w-10 rounded-md" src={currentProfile?.imageUrl} alt="User profile image" />
                <ChevronDownIcon style={{strokeWidth:"0.2rem"}} className={`h-6 w-6 transition-transform duration-200 ${showMenu? "rotate-180":""}`} />
            </section>
            {showMenu? <ul className="absolute top-[60px] flex flex-col gap-4 bg-dark justify-center px-4 py-2 w-[200px] -left-24">
                {userProfiles?.profiles.filter(profile=>profile.id!==currentProfile?.id)?.map(profile=> <li className="flex cursor-pointer items-center gap-2 hover:underline" key={profile.id} onClick={()=>loadProfile(profile)}> <img className="h-8 w-8" src={profile.imageUrl} alt={profile.name} /> {profile.name}</li>)}
                <li className={(userProfiles?.profiles.length??0)>1? "border-t border-t-gray-500 -mx-4 px-4 pt-2":""}>
                    <Link className="hover:underline" to="/ManageProfiles">
                        Manage Profiles
                    </Link>
                </li>
                <li>Transfer Profile</li>
                <li>Account</li>
                <li>Help Center</li>
                <li onClick={signOutOfNetflix} className="border-t border-t-gray-500 -mx-4 px-4 pt-2 hover:underline cursor-pointer">Sign out</li>
            </ul>:null}
        </section>
    );
}