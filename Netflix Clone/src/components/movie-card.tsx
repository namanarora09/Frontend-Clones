import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { fetchRequest, fetchVideoInfo, MovieVideoInfo } from "../common/api";
import { ENDPOINT } from "../common/endpoints";
import { createImageURL } from "../common/utils";
import Modal from "./modal";

import PlayIcon from "@heroicons/react/24/solid/PlayCircleIcon";
import LikeIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ChevronDown from "@heroicons/react/24/outline/ChevronDownIcon";
import { Position } from "../common/types";

const CARD_WIDTH=200;

type MoveCardProp={
    poster_path:string;
    id:number;
    title:string;
    uid:string;
}

export default function MovieCard({poster_path,id,title,uid}:MoveCardProp){
    const [isOpen,setIsOpen]=useState(false);
    const [videoInfo,setVideoInfo]=useState<MovieVideoInfo|null>(null);
    const movieCardRef=useRef<HTMLSelectElement>(null);
    const [hidePoster,setHidePoster]=useState(false);
    const [position,setPosition]=useState<Position|null>(null);
    
    
    async function onMouseEnter(event:any){
        const [videoInfo]=await fetchVideoInfo(id.toString());
        let calculatedPosition=movieCardRef.current?.getBoundingClientRect();
        console.log(calculatedPosition);
        let top=(calculatedPosition?.top ?? 0)-100;
        let left=(calculatedPosition?.left ?? 0)-100;
        if(left<0){
            left=calculatedPosition?.left as number;
        }
        let totalWidth=left+470;
        if(totalWidth>document.body.clientWidth){
            left=left-(totalWidth-document.body.clientWidth);
        }
        setPosition({top,left});
        setVideoInfo(videoInfo);
        setIsOpen(true);
    }
    useEffect(()=>{
        movieCardRef.current?.addEventListener("mouseenter",onMouseEnter);
        ()=>movieCardRef.current?.removeEventListener("mouseenter",onMouseEnter);
    },[]);

    useEffect(()=>{
        if(videoInfo?.key){
            setTimeout(()=>{
                setHidePoster(true);
            },800);
        }
        if(!isOpen){
            setHidePoster(false);
        }
    },[videoInfo,isOpen]);

    function onClose(value:boolean){
        setIsOpen(value);
    }
    function closeModal(){
        setIsOpen(false);
    }
    return (
        <>
        <section ref={movieCardRef} key={uid} className="aspect-square flex-none overflow-hidden rounded-md">
            <img loading="lazy" className="w-full h-full" src={createImageURL(poster_path,CARD_WIDTH)} alt={title} />
        </section>
        <Modal title={""} isOpen={isOpen} key={id} onClose={onClose} closeModal={closeModal} position={position}>
            <section className="aspect-square transition-[height] duration-500 ease-in">
                <img src={createImageURL(poster_path,400)} alt={title} className={`${hidePoster?"invisible h-0":"visible h-full"} w-full`}/>
                <YouTube opts={{
                 width:"400",
                 height:"400",
                    playerVars:{
                        autoplay:1,
                        playsinline:1,
                        controls:0,
                    },
                }} videoId={videoInfo?.key} className={`${!hidePoster?"invisible h-0":"visible h-full"}`} />
                <section className="flex items-center justify-between p-6">
                    <ul className="flex items-center justify-evenly gap-4">
                        <li className="h-12 w-12">
                            <button className="w-full h-full">
                                <PlayIcon></PlayIcon>
                            </button>
                        </li>
                        <li className="h-12 w-12 border-2 rounded-full border-gray-500 p-2 hover:border-white">
                            <button className="w-full h-full">
                                <PlusIcon></PlusIcon>
                            </button>
                        </li>
                        <li className="h-12 w-12 border-2 rounded-full border-gray-500 p-2 hover:border-white">
                            <button className="w-full h-full">
                                <LikeIcon></LikeIcon>
                            </button>
                        </li>
                    </ul>
                    <ul className="flex items-center justify-evenly gap-4">
                        <li className="h-12 w-12 border-2 rounded-full border-gray-500 p-2 hover:border-white">
                            <button className="w-full h-full">
                                <ChevronDown></ChevronDown>
                            </button>
                        </li>
                    </ul>
                </section>
            </section>
        </Modal>
        </>
    );
}