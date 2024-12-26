"use client"

import { useEffect } from "react";

type LoadAnalyticsScriptProps = {
    analytics_id: string;
}

export default function LoadAnalyticsScript({ analytics_id }: LoadAnalyticsScriptProps) {

    useEffect(() => {
        const loadAnalytics = async () => {
            // Inject Google Analytics script
            if(analytics_id !== undefined){
            const gtagScript = document.createElement("script");
            gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${analytics_id}`;
            gtagScript.async = true;
            document.head.appendChild(gtagScript);
      
            const inlineScript = document.createElement("script");
            inlineScript.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analytics_id}');
            `;
            document.head.appendChild(inlineScript);
            }else{
             const gtagScript = document.createElement("script");
             gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=G-D5MRSQ7XSQ`;
             gtagScript.async = true;
             document.head.appendChild(gtagScript);
      
             const inlineScript = document.createElement("script");
             inlineScript.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D5MRSQ7XSQ');
             `;
             document.head.appendChild(inlineScript);
           }  
        };

        loadAnalytics();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    null
  )
}
