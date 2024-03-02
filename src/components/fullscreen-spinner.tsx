export default function FullscreeenSpinner() {
  return (
    // Center spinner, take up full area
    <div className="flex justify-center items-center h-full w-full">
      {/* Spinner using spin animation on rounded border div */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
    </div>
  );
}
