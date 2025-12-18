'use client';
import {useEffect,useRef} from "react";



const useTradingViewWidget= (scriptUrl: string | undefined, config: Record<string, unknown>, height?: number | undefined)=>{
    const containerRef=useRef<HTMLDivElement|null>(null);



    useEffect(
        () => {
        if(!containerRef.current)return;
        if(containerRef.current.dataset.loaded)return;
        containerRef.current.innerHTML=`<div class='tradingView-widget-container_widget style=' width:100%; height:${height}px;'>`
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.innerHTML = JSON.stringify(config);


            containerRef.current.appendChild(script);
            containerRef.current.dataset.loaded='true';

            return () => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                    delete containerRef.current.dataset.loaded;
                }
            };


        },[scriptUrl,config,height]
    );


    return containerRef;
}

export default useTradingViewWidget
