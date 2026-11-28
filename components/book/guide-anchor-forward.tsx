"use client";

import { useEffect } from "react";

/**
 * /book was briefly the guide itself, and the web guide spec gives each
 * section an anchor (/book#house-rules). If anyone links one, send them to the
 * same anchor on the guide's own page instead of the top of the hub.
 */
export function GuideAnchorForward({ ids }: { ids: string[] }) {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && ids.includes(id)) {
      window.location.replace(`/book/nobody-answers#${id}`);
    }
  }, [ids]);
  return null;
}
