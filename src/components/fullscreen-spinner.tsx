export default function FullscreenSpinner() {
  return (
    // Center spinner, take up full screen, blur background
    <div className="flex fixed top-0 left-0 h-screen w-screen backdrop-blur-sm z-50 justify-center">
      {/* Spinner using spin animation on rounded border div */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent self-center"></div>
    </div>
  );
}
