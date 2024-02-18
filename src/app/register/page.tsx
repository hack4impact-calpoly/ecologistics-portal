"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [clerkID, setClerkID] = useState("");
  const [logo, setLogo] = useState("");
  const [reimbursements, setReimbursements] = useState([]);
  const [status, setStatus] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  // Form Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        name,
        description,
        website,
        clerkID,
        logo,
        reimbursements,
        status,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="border p-5 rounded" style={{ width: "500px" }}>
      <h1 className="text-2xl mb-4">Register</h1>
      {!pendingVerification && (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Organization Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Organization Description
            </label>
            <textarea
              name="description"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor="website"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Organization Website
            </label>
            <input
              type="text"
              name="website"
              id="website"
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={false}
            />
          </div>
          <div>
            <label
              htmlFor="clerkID"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Organization Clerk ID
            </label>
            <input
              type="text"
              name="clerkID"
              id="clerkID"
              onChange={(e) => setClerkID(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor="logo"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Organization Logo
            </label>
            <input
              type="text"
              name="logo"
              id="logo"
              onChange={(e) => setLogo(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={false}
            />
          </div>
          <div>
            <label
              htmlFor="reimbursements"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Reimbursements (Array of ObjectIds)
            </label>
            <input
              type="text"
              name="reimbursements"
              id="reimbursements"
              onChange={(e) => setReimbursements(e.target.value.split(","))}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Organization Status
            </label>
            <input
              type="text"
              name="status"
              id="status"
              onChange={(e) => setStatus(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required={true}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Create an account
          </button>
        </form>
      )}
      {pendingVerification && (
        <div>
          <form className="space-y-4 md:space-y-6">
            <input
              value={code}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              placeholder="Enter Verification Code..."
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="submit"
              onClick={onPressVerify}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Verify Email
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
