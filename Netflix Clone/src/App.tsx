import React, { useEffect, useState } from "react";
import { createBrowserRouter,createRoutesFromElements,Navigate,Outlet,redirect,Route, RouterProvider } from "react-router-dom"
import { AuthProvider, useAuth } from "./common/auth";
import ProfilesProvider from "./common/profiles-context";
import Layout from "./components/layout";
import Browse from "./pages/browse";
import Login from "./pages/login";
import Profile from "./pages/profile";

function ProtectedRoute({children}:{children:React.ReactElement}){
  const {user,loading}=useAuth();
  
  if(!user && !loading){
    return <Navigate to="/login" />
  }
  return children;
}

function AppRouter(){
  const {loading,user}=useAuth();
  const router= createBrowserRouter(createRoutesFromElements(<>
    <Route path="/" element={
    <ProtectedRoute>
      <Outlet/>
    </ProtectedRoute>
    }>
      <Route index element={<Profile/>} />
      <Route path="ManageProfiles" element={<Profile edit/>} />
      <Route path="/browse" element={<Layout />}>
        <Route index element={<Browse />}/>
      </Route>
      <Route path="latest" element={<Layout />}>
        <Route index element={<h1>Latest</h1>}/>
      </Route>
    </Route>
    <Route path="/login" element={<Login />}/>
    </>
  ));
  return loading && !user? <section className="grid place-items-center h-screen w-screen text-6xl">Loading...</section> : <RouterProvider router={router}></RouterProvider>
}

export default function App() {
  return (
    <AuthProvider>
      <ProfilesProvider>
        <AppRouter/>
      </ProfilesProvider>
    </AuthProvider>
  );
}