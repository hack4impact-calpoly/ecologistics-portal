export default function CenteredSpinner() {
  return (
    // Center spinner
    <div className="flex justify-center items-center w-screen h-screen">
      {/* Spinner using spin animation on rounded border div */}
      <div className="w-6 h-6 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
    </div>
  );
}
