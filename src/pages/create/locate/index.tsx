import React, { useEffect, useState } from "react";

import { LayoutComponent } from "@components/layout/LayoutComponent";
import MapScreen from "@pages/map";
import { useRouter } from "next/router";
import { Coordinates, MapView } from "@components/map/MapView";
import { CompressedMint } from "@components/create/minting/CompressedMint";
import { getFirstArrayElementOrValue } from "utils/formatUtils";

const Locate: React.FC = () => {
  const router = useRouter();
  const { timeStamp, theVibe } = router.query;

  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(
    undefined
  );

  let parsedVibe;

  const parsedTimeStamp = getFirstArrayElementOrValue(timeStamp);

  if (theVibe === "") {
    parsedVibe = "Bullish";
  } else {
    parsedVibe = getFirstArrayElementOrValue(theVibe);
  }
  const [hasError, setHasError] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const handleClick = () => {
    const coordinatesString = JSON.stringify(coordinates);

    router.push({
      pathname: "/create/mint/",
      query: {
        timeStamp,
        theVibe,
        coordinates: coordinatesString,
      },
    });
  };

  return (
    <LayoutComponent
      showWallet="none"
      justifyStyling="center"
      showTitle="locate & mint"
    >
      <div className="h-2/3">
        <MapView setCoordinates={setCoordinates} />
      </div>
      <div className="flex justify-center align-center items-center">
        {/* <button className="text-xl m-10 p-2" onClick={handleClick}>
          next
        </button> */}
        {coordinates && (
          <CompressedMint
            timeStamp={parsedTimeStamp ?? new Date().toString()}
            theVibe={parsedVibe ?? "Bullish"}
            longitude={coordinates.longitude.toString()}
            latitude={coordinates.latitude.toString()}
            setIsMinting={setIsMinting}
            isMinting={isMinting}
          />
        )}
      </div>
    </LayoutComponent>
  );
};

export default Locate;
