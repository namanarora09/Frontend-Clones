import React, { useEffect, useRef, useState } from "react";
import { fetchRequest, MovieResponse, MovieResult } from "../common/api";
import { ENDPOINT } from "../common/endpoints";
import ChevronLeft from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRight from "@heroicons/react/24/outline/ChevronRightIcon";
import PageIndicator from "./page-indicator";
import MovieCard from "./movie-card";
type RowProp={
    endpoint:string;
    title:string;
};
const CARD_WIDTH=200;
export default function ContentRows({title,endpoint}:RowProp){
    const sliderRef=useRef<HTMLSelectElement>(null);
    const containerRef=useRef<HTMLSelectElement>(null);
    const [rowData,setRowData]=useState<MovieResult[]>([]);
    const [translateX,setTranslateX]=useState(0);
    const [pagesCount,setPagesCount]=useState(0);
    const [currentPage,setCurrentPage]=useState(0);
    const cardsPerPage=useRef(0);
    const disablePrev=currentPage===0;
    const disableNext=currentPage+1===pagesCount;
    async function fetchRowData(){
        const response=await fetchRequest<MovieResponse<MovieResult[]>>(endpoint);
        setRowData(response.results.filter(res=>res.poster_path));
    }

    function onNextClick(){
        if(sliderRef.current){
            let updatedTranslateX=translateX - getTranslateXValue();
            sliderRef.current.style.transform=`translateX(${updatedTranslateX}%)`;
            setTranslateX(updatedTranslateX);
            setCurrentPage(currentPage+1);
        }
    }

    function prevClick(){
        if(sliderRef.current){
            let updatedTranslateX=translateX+ getTranslateXValue();
            sliderRef.current.style.transform=`translateX(${updatedTranslateX}%)`;
            setTranslateX(updatedTranslateX);
            setCurrentPage(currentPage-1);
        }
    }

    function getTranslateXValue(){
        let translateX=0;
        if(sliderRef.current){
            translateX=((cardsPerPage.current* CARD_WIDTH)/sliderRef.current.clientWidth)*100;
        }
        return translateX;
    }

    useEffect(()=>{
        if(rowData?.length){
            if(containerRef.current){
                cardsPerPage.current=Math.floor (containerRef.current.clientWidth/CARD_WIDTH);
                setPagesCount(Math.ceil(rowData.length/cardsPerPage.current));
            }
        }
    },[rowData.length])

    useEffect(()=>{
        fetchRowData();
    },[]);
    return (
        <section className="row-container ml-12 hover:cursor-pointer">
            <h2 className="text-xl">{title}</h2>
            <PageIndicator className="mb-4 opacity-0 transition-opacity duration-300 ease-in" pagesCount={pagesCount} currentPage={currentPage} />
            <section ref={containerRef} className="relative flex flex-nowrap overflow-hidden gap-2 mb-8">
                {!disablePrev?<button className="absolute h-full w-12 bg-black/25 z-[1] opacity-0 transition-opacity duration-300 ease-in" onClick={prevClick}>
                    <ChevronLeft />
                </button>:null}
                {!disableNext?<button className="z-[1] absolute right-0 h-full w-12 bg-black/25 opacity-0 transition-opacity duration-300 ease-in" onClick={onNextClick}>
                    <ChevronRight />
                </button>:null}
                <section ref={sliderRef} className="flex gap-2 transition-transform duration-700 ease-linear">
                    {rowData?.map((row,index)=>{
                    const {id,title,poster_path,backdrop_path}=row;

                    return <MovieCard uid={`${row.id}-${title}`} key={`${row.id}-${title}`} {...row} />;
                })}
                    </section>
            </section>
        </section>
    );
}
