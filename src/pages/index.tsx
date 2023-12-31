import Head from "next/head";
import { LayoutComponent } from "../components/layout/LayoutComponent";
import Toaster from "../components/Toaster";
import RecordingPage from "./create";
import Script from "next/script";
import useMenuStore from "../utils/useMenuStore";
import React from "react";
import MapScreen from "./map";

export default function Home() {
  const { isMenuDisabled } = useMenuStore();
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-1RPC444F7W" />
      <Script id="google-analytics">
        {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
       
         gtag('config', 'G-1RPC444F7W');
        `}
      </Script>
      <Head>
        <title>øhr</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LayoutComponent
        showNavBar={true}
        showTitle="Record"
        showFooter={!isMenuDisabled ? true : false}
      >
        <Toaster />
        {/* <MapScreen /> */}
        <RecordingPage />
      </LayoutComponent>
    </>
  );
}
