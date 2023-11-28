import React, { useEffect, useMemo, useState } from "react";
import { LayoutComponent } from "@components/layout/LayoutComponent";
import { MapView } from "@components/map/MapView";
import { getNFTs } from "utils/nftUtils";
import NFTModal, { AudioNFT } from "@components/map/NFTModal";
import { Marker } from "react-map-gl";
import Image from "next/image";
import marker from "../../assets/ear_small.png";
import { LoadingComponent } from "@components/LoadingComponent";

const MapScreen: React.FC = () => {
  const [audioNFTs, setAudioNFTs] = useState<AudioNFT[] | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [audioNFT, setAudioNFT] = useState<AudioNFT | undefined>(undefined);
  const [position, setPosition] = useState<{
    longitude: number;
    latitude: number;
  }>({ longitude: 13.35037231777517, latitude: 52.52709769976026 });

  useEffect(() => {
    const fetchNFTs = async () => {
      await getNFTs(setAudioNFTs, 1);
      checkIfAudioNFTisShared();
    };

    const intervalId = setInterval(fetchNFTs, 2000);
    return () => clearInterval(intervalId);
  }, [audioNFTs]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const longitude = url.searchParams.get("longitude");
    const latitude = url.searchParams.get("latitude");

    if (latitude && longitude) {
      setPosition({
        longitude: Number(longitude),
        latitude: Number(latitude),
      });
    }
  }, []);

  const checkIfAudioNFTisShared = () => {
    const url = new URL(window.location.href);
    const audioNFTid = url.searchParams.get("id");
    console.log("audioNFTid: ", audioNFTid);
    if (audioNFTid) {
      const sharedAudioNFT = audioNFTs?.find(
        (audioNFT) => audioNFT.id == Number(audioNFTid)
      );
      console.log("SharedAudioNFT: ", sharedAudioNFT);
      setAudioNFT(sharedAudioNFT);
      setShowModal(true);
    }
  };

  const markers: JSX.Element[] = useMemo(
    () =>
      audioNFTs
        ? audioNFTs
            .filter(
              (audioNFT) => audioNFT.attributes.Long && audioNFT.attributes.Lat
            )
            .map((audioNFT, index) => (
              <Marker
                key={index}
                longitude={Number(audioNFT.attributes.Long)}
                latitude={Number(audioNFT.attributes.Lat)}
                color="red"
                onClick={() => {
                  setAudioNFT(audioNFT);
                  setShowModal(true);
                }}
              >
                <Image src={marker} alt="øhr logo" width={40} height={40} />
              </Marker>
            ))
        : [],
    [audioNFTs]
  );

  return (
    <LayoutComponent
      justifyStyling="center"
      showTitle="Explore"
      showFooter={true}
      showNavBar={true}
    >
      <div className="h-5/6">
        <h2 className="text-center text-sm"> to listen, click on the ears</h2>
        {audioNFT && (
          <NFTModal
            showModal={showModal}
            setShowModal={setShowModal}
            audioNFT={audioNFT}
          />
        )}
        {audioNFTs ? (
          <MapView {...position} markers={markers} />
        ) : (
          <div className="flex h-full justify-center align-center">
            <LoadingComponent />
          </div>
        )}
      </div>
    </LayoutComponent>
  );
};

export default MapScreen;
