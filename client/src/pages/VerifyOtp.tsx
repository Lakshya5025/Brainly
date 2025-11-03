import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../components/Button";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return (
      <div className="bg-purple-100 h-screen w-screen flex justify-center items-center">
        <div className="bg-white w-80 rounded-lg px-5 py-7 text-center">
          <p className="text-red-500">
            No email specified. Please sign up first.
          </p>
          <Link
            to="/signup"
            className="text-purple-500 hover:underline mt-4 inline-block">
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  const onVerify = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/otp-verification`, {
        email,
        otp,
      });

      if (response.status === 200) {
        setMessage("Verification successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Verification failed.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Verification failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-purple-100 h-screen w-screen flex justify-center items-center">
      <div className="bg-white w-80 rounded-lg px-5 py-7">
        <div className="flex justify-center text-xl mb-2 font-semibold">
          Verify Your Email
        </div>
        <p className="text-center text-gray-600 mb-4">
          An OTP has been sent to <strong>{email}</strong>.
        </p>
        <div className="relative">
          <input
            onChange={(e) => setOtp(e.target.value)}
            className="bg-grey-200 w-full rounded-md py-2 pl-2"
            type="text"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
        </div>

        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="flex mt-7 justify-center">
          <Button
            onClick={onVerify}
            varient="primary"
            customCSS="w-full flex justify-center"
            text={isLoading ? "Verifying..." : "Verify"}
            disabled={isLoading || message.includes("successful")}
          />
        </div>
        <div className="text-center mt-4">
          <p>
            Didn't receive the code?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline">
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
