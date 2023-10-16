import { Dialog, Transition } from "@headlessui/react";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AudioNFT } from "./MapView";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { extractPlayBackIdFromUrl } from "utils/formatUtils";

interface NFTModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  audioNFT: AudioNFT;
}

const NFTModal: React.FC<NFTModalProps> = ({
  showModal,
  setShowModal,
  audioNFT,
}) => {
  const getPlaybackIdForPlayer = () => {
    const extractedPlaybackId = extractPlayBackIdFromUrl(audioNFT.animationUrl);
    return extractedPlaybackId ?? "undefined";
  };

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl border text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg py-4 px-6 font-semibold leading-6 border-b primaryBorder text-center  flex justify-between text-[#64ed14]"
                  >
                    <p className="txt-secondary">{audioNFT.name}</p>
                    <p>{audioNFT.symbol}</p>
                  </Dialog.Title>
                  <div className="mt-4 px-6">{audioNFT.description}</div>
                  <div className="mt-2">
                    <img src={audioNFT.image} alt="AudioNFT image" />
                  </div>
                  {audioNFT.description === "New York City Vibez" ? (
                    <div className="flex justify-center self-center mt-5">
                      <audio controls>
                        <source src={audioNFT.animationUrl} type="audio/mp4" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : (
                    <MuxPlayer
                      streamType="on-demand"
                      playbackId={getPlaybackIdForPlayer()}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default NFTModal;
