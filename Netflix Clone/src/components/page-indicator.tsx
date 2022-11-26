import React from "react";

export default function PageIndicator({pagesCount,currentPage,className}:{
    pagesCount:number;
    currentPage:number;
    className:string;
}){
    return (
        isFinite(pagesCount)?
        (<ul className={`flex gap-1 justify-end pr-4 items-center ${className}`}>
            {Array(pagesCount).fill(0).map((page,index)=>(
                <li className={`w-3 h-[2px] ${currentPage===index?"bg-gray-100":"bg-gray-600"}`} key={index}></li>
            ))}
        </ul>):null
    );
}