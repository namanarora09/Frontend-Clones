import React, { createContext, useContext, useEffect, useReducer } from "react";
import profilesReducer from "../reducer/profilesReducer";
import { useAuth } from "./auth";
import { ActionType, ProfilesContextType, UserProfile } from "./types";

type StoreProfiles=Map<string,ProfilesContextType>;
const LOCAL_STORAGE_KEY="profiles";

const ProfileContext=createContext<ProfilesContextType|null>(null);

const ProfileDispatchContext=createContext<React.Dispatch<ActionType>|null>(null);

export default function ProfilesProvider({children}:{children:React.ReactElement}){
    const {user}=useAuth();

    const userProfiles=findProfile(user?.email as string);

    const [state,dispatch]=useReducer(profilesReducer,userProfiles)

    useEffect(()=>{
        if(user?.email){
            if(state){
                const storedProfiles=getProfiles();
                storedProfiles.set(user.email,userProfiles as ProfilesContextType);
                updatedProfiles(storedProfiles);
            }else{
                dispatch({type:"load",payload:userProfiles});
            }
        }
    },[user?.email,state])

    return <ProfileContext.Provider value={state}>
        <ProfileDispatchContext.Provider value={dispatch }>
            {children}
        </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
}

function getProfiles():StoreProfiles{
    return new Map(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)??"[]"))
}

function findProfile(id:string){
    const profiles=getProfiles();
    return id? (profiles).get(id)??null:null;
}

function updatedProfiles(profiles:StoreProfiles){
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(Array.from(profiles)))
}

export const useProfilesContext=()=> useContext(ProfileContext);
export const useProfilesDispatchContext=()=> useContext(ProfileDispatchContext) as React.Dispatch<ActionType>;