//This will wrap the entire app and allow the feedback modal to pop up for the user to submit a bug report

import { FeedbackModal } from "@/components/Tools/ErrorHandling/FeedbackModal";
import React, { PropsWithChildren, useEffect, useState } from "react";

type FeedbackOpener = () => void;

let openerRef: FeedbackOpener | undefined;

export function requestFeedbackModal() {
  openerRef?.();
}

/**
 * Provides a host for the feedback modal and exposes a global opener.
 *
 * Must wrap the application root so requestFeedbackModal can render UI.
 */
export function FeedbackHost({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    openerRef = () => setOpen(true);
    return () => {
      openerRef = undefined;
    };
  }, []);

  return (
    <>
      {children}
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
