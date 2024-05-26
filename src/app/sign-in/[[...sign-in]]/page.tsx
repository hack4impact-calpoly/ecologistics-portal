import FullscreenSpinner from "@/components/fullscreen-spinner";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const signInAppearance = {
    elements: {
      formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
    },
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-0">
      <div className="w-full h-screen flex justify-center items-center">
        <SignIn appearance={signInAppearance} />
      </div>
    </div>
  );
}
