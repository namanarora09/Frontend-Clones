// Import the functions you need from the SDKs you need
import { ResultType } from "@remix-run/router/dist/utils";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfnsRVDhRC8AyCwlBCCahlJ2KU6xP1RfE",
  authDomain: "netflix-clone-124cc.firebaseapp.com",
  projectId: "netflix-clone-124cc",
  storageBucket: "netflix-clone-124cc.appspot.com",
  messagingSenderId: "379216132493",
  appId: "1:379216132493:web:887e0bc6bc97885d42a5c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);

export type AuthContextType=ReturnType<typeof useProvideAuth>;

const AuthContext=createContext<AuthContextType|null>(null);

export const AuthProvider=({children}:{children:React.ReactElement|React.ReactElement[]})=>{
  const auth=useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
};

export const useAuth=()=> useContext(AuthContext) ?? {} as AuthContextType;

function useProvideAuth(){
    //current user=>null
    //1. firebase is still fetching the InformationCircleIcon. async operation
    //2. when the user is logged out

    //user is logged in  => User
    const [user,setUser]=useState<User | null>(auth.currentUser);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
      const unsubscribe=onAuthStateChanged(auth,(user)=>{
        setLoading(false);
        setUser(user);
      });
      return ()=>{
        unsubscribe();
      }
    },[])

    const signUp=(email:string,password:string)=>createUserWithEmailAndPassword(auth,email,password).then(({user})=>{
      return user;
    });

    const signIn=(email:string,password:string)=>signInWithEmailAndPassword(auth,email,password).then(({user})=>{
      return user;
    });

    const signOutUser=()=>signOut(auth);

    return {
      signUp,
      signIn,
      signOut:signOutUser,
      user,
      loading
    }
}

