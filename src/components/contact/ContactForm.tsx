"use client";

import emailjs from "@emailjs/browser";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Success } from "./Success";
import { Form } from "./Form";
import React from "react";

const SERVICE_ID = "default_service";
const TEMPLATE_ID_USER = "template_zqmimuf";
const TEMPLATE_ID_US = "template_tbqod6s";

const ALPHA_NUM_REGEX = /[A-Za-z0-9]/g;
const EMAIL_REGEX = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

interface ContactFormProps {
  setShowGDPR: Dispatch<SetStateAction<boolean>>;
  isSent: boolean;
  setIsSent: Dispatch<SetStateAction<boolean>>;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  setShowGDPR,
  isSent,
  setIsSent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sending.mp3");
  }, []);

  const playSendingSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { name, email, telegram } = Object.fromEntries(formData.entries());

    if (
      ALPHA_NUM_REGEX.test(telegram as string) &&
      EMAIL_REGEX.test(email as string)
    ) {
      if (!isChecked) {
        toast.error("Please accept the GDPR compliance.");
        return;
      }
      setIsLoading(true);
      fetch(`/api/user`, {
        method: "POST",
        body: JSON.stringify({ name, email, telegram }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          playSendingSound();
          // send confirmation email to interested user
          emailjs
            .send(
              SERVICE_ID,
              TEMPLATE_ID_USER,
              { name, email },
              process.env.NEXT_PUBLIC_EMAILJS_KEY
            )
            .then(
              (result) => {
                form.reset();
              },
              (error) => {
                toast.error(
                  "There was an error sending the email and saving the contact."
                );
              }
            );

          // send email to us
          emailjs
            .send(
              SERVICE_ID,
              TEMPLATE_ID_US,
              { name, email, telegram },
              process.env.NEXT_PUBLIC_EMAILJS_KEY
            )
            .then(
              (result) => {
                form.reset();
              },
              (error) => {
                toast.error(
                  "There was an error sending the email and saving the contact."
                );
              }
            );
        })
        .finally(() => {
          setIsLoading(false);
          setIsSent(true);
        });
    }
  };

  return isSent ? (
    <Success />
  ) : (
    <div className="w-full max-w-md h-full overflow-none flex flex-col justify-center">
      <h2 className="text-xl text-center font-bold">Want to stay in touch?</h2>
      <p className="text-md mx-20 my-2 text-center self-center">
        Follow along or join our closed community
      </p>
      <Form
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        setIsChecked={setIsChecked}
        isChecked={isChecked}
        setShowGDPR={setShowGDPR}
      />
    </div>
  );
};
