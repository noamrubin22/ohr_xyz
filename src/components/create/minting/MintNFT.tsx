import React, { Dispatch, SetStateAction, useState } from "react";
import { getMuxAssetId, getPlaybackId as getAudioUrl } from "utils/mux";
import { createNFT } from "../../../utils/nftUtils";
import { useRouter } from "next/router";
import { LoadingComponent } from "../../LoadingComponent";
import { motion } from "framer-motion";
import useMetadataStore from "utils/useMetadataStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const getRecordingUrl = async (uploadId: string) => {
  try {
    const assetId = await getMuxAssetId(uploadId);
    return await getAudioUrl(assetId);
  } catch (err) {
    console.error("Error in getRecording NFT: ", err);
  }
};

const setTheAttributes = (
  timeStamp: string,
  theVibe: string,
  longitude?: number,
  latitude?: number
) => {
  let attributes;

  if (latitude && longitude) {
    attributes = {
      Date: timeStamp,
      Motivation: "LFG",
      Vibe: theVibe,
      Long: longitude,
      Lat: latitude,
    };
  } else {
    attributes = {
      Date: timeStamp,
      Motivation: "LFG",
      Vibe: theVibe,
    };
  }
  return attributes;
};

interface MintNFTProps {
  timeStamp: string;
  theVibe: string;
  longitude?: number;
  latitude?: number;
  isMinting: boolean;
  setIsMinting: Dispatch<SetStateAction<boolean>>;
  uploadID: string;
  setIsMintSuccessful: Dispatch<SetStateAction<boolean>>;
  setHasErrored: Dispatch<SetStateAction<string | undefined>>;
  disabled: boolean;
}

const mintButtonAnimation = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: "0%", opacity: 1 },
};

export const MintNFT: React.FC<MintNFTProps> = ({
  timeStamp,
  theVibe,
  longitude,
  latitude,
  isMinting,
  setIsMinting,
  uploadID,
  setIsMintSuccessful,
  setHasErrored,
  disabled,
}) => {
  const { publicKey, connected } = useWallet();
  const { metadata, resetMetadata } = useMetadataStore();
  const router = useRouter();

  const handleMintNFT = async () => {
    setIsMinting(true);

    const receiverAddress = publicKey?.toBase58();

    if (receiverAddress) {
      const recordingUrl = await getRecordingUrl(uploadID);
      const attributes = setTheAttributes(
        timeStamp,
        theVibe,
        longitude,
        latitude
      );

      const success = await createNFT(
        receiverAddress,
        attributes,
        recordingUrl
      );

      let queryParams;
      if (longitude && latitude) {
        queryParams = {
          longitude: longitude.toString(),
          latitude: latitude.toString(),
        };
      }

      router.push({
        pathname: `/create/mint`,
        query: queryParams,
      });

      if (success) {
        router.push({ pathname: "/map", query: { longitude, latitude } });
        setIsMintSuccessful(true);
      } else {
        setHasErrored("Something didn't work out with the mint. ");
      }
    } else {
      setHasErrored("Your wallet was not connected.");
    }
  };

  return (
    <div className="flex justify-center align-center items-center h-full">
      {!isMinting ? (
        <div className="flex flex-col align-center items-center h-full rounded-xl">
          {connected ? (
            <>
              <motion.button
                className={"primary-btn text-3xl mt-5"}
                onClick={handleMintNFT}
                variants={mintButtonAnimation}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1,
                }}
                disabled={disabled}
              >
                {isMinting ? <i>mint</i> : "mint"}
              </motion.button>
            </>
          ) : (
            <div className="m-6">
              <WalletMultiButton />
            </div>
          )}
        </div>
      ) : (
        <div className="m-6">
          <LoadingComponent />
        </div>
      )}
    </div>
  );
};
