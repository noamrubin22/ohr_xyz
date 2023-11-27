import Toaster from "@components/Toaster";
import { ContactForm } from "@components/contact/ContactForm";
import { GDPR } from "@components/contact/GDPR";
import { LayoutComponent } from "@components/layout/LayoutComponent";
import { Instagram } from "@components/layout/footer/icons/Instagram";
import { OhrLogo } from "@components/layout/footer/icons/OhrLogo";
import { Tiktok } from "@components/layout/footer/icons/Tiktok";
import { Twitter } from "@components/layout/footer/icons/twitter";
import React, { useState } from "react";

const ContactScreen = () => {
  const [showGDPR, setShowGDPR] = useState<boolean>(false);
  const [startSecondAnimation, setStartSecondAnimation] =
    useState<boolean>(false);
  const [isSent, setIsSent] = useState(false);

  return (
    <LayoutComponent
      justifyStyling="center"
      showTitle="Contact"
      showFooter={true}
    >
      <div className="flex flex-col m-5 items-center align-center justify-center h-full overflow-scroll">
        <Toaster />
        {showGDPR ? (
          <GDPR handleOnClose={() => setShowGDPR(false)} />
        ) : (
          <ContactForm
            setShowGDPR={setShowGDPR}
            isSent={isSent}
            setIsSent={setIsSent}
          />
        )}
      </div>
    </LayoutComponent>
  );
};

export default ContactScreen;