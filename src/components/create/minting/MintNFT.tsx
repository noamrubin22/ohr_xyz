import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  getMuxAssetId,
  getPlaybackId as getAudioUrl,
  waitFor,
} from "../../../utils/mux";
import { useRouter } from "next/router";
import LoadingComponent from "../../LoadingComponent";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSession, signIn, signOut } from "next-auth/react";

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
  setHasErrored,
  disabled,
}) => {
  const { publicKey, connected, disconnect } = useWallet();
  const router = useRouter();
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const { data, status } = useSession();

  const handleMintNFT = async (mintType: "Passport" | "Wallet") => {
    setIsMinting(true);

    const recordingUrl = await getRecordingUrl(uploadID);
    const attributes = setTheAttributes(
      timeStamp,
      theVibe,
      longitude,
      latitude
    );

    if (mintType === "Passport") {
      const receiver = { namespace: "øhr", identifier: data?.user?.email };

      try {
        const response = await fetch("/api/nft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiver, attributes, recordingUrl }),
        });

        let queryParams;
        if (longitude && latitude) {
          queryParams = {
            longitude: longitude.toString(),
            latitude: latitude.toString(),
          };
        }
        // NO IDEA WHY THIS IS HERE?
        router.push({
          pathname: `/create/mint`,
          query: queryParams,
        });

        if (response.ok) {
          const data = await response.json();
          const id = data.nftId;
          const fresh = true;
          router.push({
            pathname: "/map",
            query: { longitude, latitude, fresh },
          });
        }
      } catch (error) {
        console.error("Error: ", error);
        setHasErrored("Something didn't work out with the mint. ");
      }
    } else if (mintType === "Wallet") {
      const receiverAddress = publicKey?.toBase58();

      try {
        const response = await fetch("/api/nft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverAddress, attributes, recordingUrl }),
        });

        let queryParams;
        if (longitude && latitude) {
          queryParams = {
            longitude: longitude.toString(),
            latitude: latitude.toString(),
          };
        }
        // NO IDEA WHY THIS IS HERE?
        router.push({
          pathname: `/create/mint`,
          query: queryParams,
        });

        if (response.ok) {
          const data = await response.json();
          const id = data.nftId;
          const fresh = true;
          router.push({
            pathname: "/map",
            query: { longitude, latitude, fresh },
          });
        }
      } catch (error) {
        console.error("Error: ", error);
        setHasErrored("Something didn't work out with the mint. ");
      }
    }
  };

  return (
    <div className="flex justify-center align-center items-center h-full">
      {!isMinting ? (
        <div className="flex flex-col align-center items-center h-full rounded-xl">
          {connected && publicKey?.toBase58() ? (
            <>
              <motion.button
                className={"primary-btn text-3xl mt-5"}
                onClick={() => handleMintNFT("Wallet")}
                variants={mintButtonAnimation}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1,
                }}
                disabled={disabled}
              >
                {isMinting ? <i>MINT</i> : "MINT"}
              </motion.button>
              <div className="m-10 flex flex-col justify-center align-center items-center">
                <h1>Your wallet is connected</h1>
                <button
                  onClick={() => disconnect()}
                  className="mt-4 border-2 p-2 rounded-lg w-1/2 border-purple-200 text-sm"
                >
                  Disconnect
                </button>
              </div>
            </>
          ) : data?.user?.email ? (
            <>
              <motion.button
                className={"primary-btn text-3xl mt-5 w-100"}
                onClick={() => handleMintNFT("Passport")}
                variants={mintButtonAnimation}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1,
                }}
                disabled={disabled}
              >
                {isMinting ? <i>MINT</i> : "MINT"}
              </motion.button>
              <div className="m-10 flex flex-col justify-center align-center items-center">
                <h1>Your email is connected</h1>
                <button
                  onClick={() => signOut()}
                  className="mt-4 border-2 p-2 rounded-lg w-1/2 border-purple-200 text-sm"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center text-center">
              <div className="m-6">
                <WalletMultiButton />
              </div>
              <p>or</p>
              <div className="m-6">
                <button onClick={() => signIn()} className="primary-btn">
                  Connect with email
                </button>
              </div>
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
