import { useEffect, useState } from "react";

export type DeviceProfile = {
  ready: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
  finePointer: boolean;
  mobile: boolean;
  webgl: boolean;
};

const INITIAL: DeviceProfile = {
  ready: false,
  reducedMotion: false,
  lowPower: false,
  finePointer: false,
  mobile: false,
  webgl: false,
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Client-only device capabilities; returns safe defaults during SSR. */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState(INITIAL);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const webgl = hasWebGL();
    const update = () => {
      const mobile = window.innerWidth < 768;
      const nav = navigator as Navigator & { deviceMemory?: number };
      const cores = nav.hardwareConcurrency ?? 8;
      const memory = nav.deviceMemory ?? 8;
      setProfile({
        ready: true,
        reducedMotion: rm.matches,
        lowPower: mobile || cores <= 4 || memory <= 4,
        finePointer: fine.matches,
        mobile,
        webgl,
      });
    };
    update();
    rm.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      rm.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return profile;
}
