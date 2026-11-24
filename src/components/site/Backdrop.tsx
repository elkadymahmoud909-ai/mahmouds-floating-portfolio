import { lazy, Suspense, useEffect } from "react";

import { useDeviceProfile } from "@/hooks/use-device-profile";

const loadScene = () => import("@/components/three/Scene3D");
const Scene3D = lazy(loadScene);

/** Fixed cinematic background: aurora light, grid, and the lazily loaded 3D world. */
export function Backdrop({ ready }: { ready: boolean }) {
  const device = useDeviceProfile();
  const showScene = ready && device.ready && device.webgl;

  useEffect(() => {
    if (device.ready && device.webgl) void loadScene();
  }, [device.ready, device.webgl]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void">
      <div className="absolute inset-0 bg-aurora" />
      <div className="grid-lines absolute inset-0 opacity-60" />
      {showScene && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 animate-in fade-in duration-1000">
            <Scene3D
              quality={device.lowPower ? "low" : "high"}
              mobile={device.mobile}
              still={device.reducedMotion}
            />
          </div>
        </Suspense>
      )}
      <div className="absolute inset-0 vignette" />
    </div>
  );
}
