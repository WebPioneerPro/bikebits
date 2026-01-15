import { FC } from "react";

interface SpinnerOverlayProps {
  isVisible: boolean;
  message?: string;
  fullScreen?: boolean;
}

const SpinnerOverlay: FC<SpinnerOverlayProps> = ({
  isVisible,
  message = "Loading...",
  fullScreen = false
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`${fullScreen ? "fixed" : "absolute"
        } inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-28 w-48 flex items-center justify-center overflow-hidden">
          {/* Speed Lines (Moving Road) */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 gap-3">
            <div className="h-[3px] w-14 bg-orange-600 rounded-full animate-road-move ml-[5%]"></div>
            <div className="h-[3px] w-20 bg-orange-500 rounded-full animate-road-move ml-[35%]" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-[3px] w-12 bg-orange-400 rounded-full animate-road-move ml-[15%]" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Running Bike Logo */}
          <div className="animate-bike-bob z-10">
            <div className="animate-bike-vibrate">
              <img
                src="./images/logo/bikebits-logo-dark.png"
                alt="Running Bike"
                className="h-20 w-auto object-contain transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Under-bike shadow/pulse */}
          <div className="absolute bottom-8 h-2 w-20 bg-black/10 dark:bg-white/10 blur-md rounded-full animate-pulse transition-opacity"></div>
        </div>

        {message && (
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold tracking-[0.2em] text-gray-800 dark:text-gray-100 uppercase italic">
              {message}
            </p>
            <div className="h-[2px] w-12 bg-brand-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinnerOverlay;
