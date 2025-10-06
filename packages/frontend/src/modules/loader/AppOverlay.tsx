import React, { useEffect, useState } from "react";
import { loaderSignal } from "@src/modules/loader/loaderSignal";

export default function AppOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = loaderSignal.subscribe(setVisible);
    return unsubscribe;
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="h-20 w-20 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-t-white border-gray-400 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
