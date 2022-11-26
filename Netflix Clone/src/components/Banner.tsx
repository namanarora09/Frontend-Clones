import React, { useEffect, useState } from "react";
import YouTube,{YouTubeEvent, YouTubeProps} from "react-youtube";
import { fetchRequest, fetchVideoInfo, MovieResponse, MovieResult, MovieVideoInfo } from "../common/api";
import { ENDPOINT } from "../common/endpoints";
import { createImageURL } from "../common/utils";
import PlayIcon from "@heroicons/react/24/solid/PlayIcon";
import Info from "@heroicons/react/24/outline/InformationCircleIcon";

export default function(){

    const [randomMovie,setRandomMovie]=useState<MovieResult>();
    const [videoInfo,setVideoInfo]=useState<MovieVideoInfo>();
    const [hidePoster,setHidePoster]=useState(false);
    const [showBackdrop,setShowBackdrop]=useState(false);
    const options:YouTubeProps["opts"]={
        width:document.body.clientWidth,
        height:"800",
        playerVars:{
            autoplay:1,
            playsinline:1,
            controls:0,
        },
    }

    function getRandomIndex(last:number){
        return Math.floor(Math.random()*(last-1))
    }

    async function fetchPopularMovies(){
        const response=await fetchRequest<MovieResponse<MovieResult[]>>(ENDPOINT.MOVIES_POPULAR);
        const filteredMovies= response.results.filter(movies=>movies.backdrop_path);
        const randomSelection=filteredMovies[getRandomIndex(filteredMovies.length)];
        console.log({randomSelection});
        setRandomMovie(randomSelection)
        
        const videoInfo=await fetchVideoInfo(randomSelection.id.toString());
        setVideoInfo(videoInfo[0]);
        setTimeout(()=>{
            setHidePoster(true);
        },800)
    }

    useEffect(()=>{
        fetchPopularMovies();
    },[])

    function onStateChange(event:YouTubeEvent<number>){
        //video has finished paying
        if(event.data===0){
            setHidePoster(false);
            setShowBackdrop(true);
        }else if(event.data=1){
            setHidePoster(true);
            setShowBackdrop(false);
        }
    }

    return randomMovie? (<section className="relative aspect-video h-[800px] w-full">
            <img src={createImageURL(randomMovie?.backdrop_path as string,0,"original")} alt={randomMovie?.title} className={hidePoster? `h-0 invisible`: `visible w-full h-full`} />
            {videoInfo?<YouTube videoId={videoInfo?.key} id="banner-video" opts={options} className={`${hidePoster? "visible h-full":"invisible h-0"} absolute -mt-14 z-[1]`} onStateChange={onStateChange} />:null}
            {showBackdrop? <section className="absolute z-[1] top-0 left-0 w-full h-full bg-dark/60"></section>:null}
            <section className="absolute z-[1] bottom-16 ml-16 max-w-sm flex flex-col gap-2">
                <h2 className="text-6xl">{randomMovie.title}</h2>
                <p className="text-sm line-clamp-3">{randomMovie.overview}</p>
                <section className="flex gap-2">
                    <button className="flex items-center w-[100px] bg-white p-2 text-dark rounded-md">
                        <PlayIcon className="w-8 h-8" /> <span>Play</span>
                    </button>
                    <button className="flex items-center w-[150px] bg-zinc-400/50 p-2 text-white rounded-md"><Info className="w-8 h-8" /> <span>More Info</span></button>
                </section>
            </section>
        </section>):null;
}