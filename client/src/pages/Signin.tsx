import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EyeOpen } from "../icons/EyeOpen";
import { EyeClose } from "../icons/EyeClose";
import { Link } from "react-router-dom";
import axios from "axios"; // No change here
const apiUrl = import.meta.env.VITE_API_URL;

interface InputProps {
  placeholder: string;
  type?: string;
  setValue: (e: string) => void;
}

function Input({ placeholder, type = "text", setValue }: InputProps) {
  return (
    <div className="my-2">
      <input
        onChange={(e) => setValue(e.target.value)}
        className="bg-grey-200 w-full rounded-md py-2 pl-2"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

export function Signin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState("password");
  const navigate = useNavigate();

  async function onSignin() {
    try {
      const response = await axios.post(
        `${apiUrl}/signin`,
        {
          username: userName,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "An unknown error occurred.");
      } else {
        alert("Login failed. Please check your connection and try again.");
      }
    }
  }
  // --- END OF UPDATE ---

  function handelVisibility() {
    if (passType == "text") setPassType("password");
    else if (passType == "password") setPassType("text");
  }
  return (
    <div className="bg-purple-100 h-screen w-screen  flex justify-center items-center">
      <div className="bg-white w-80 rounded-lg px-5 py-7">
        <div className="flex justify-center text-xl mb-2 font-semibold">
          Signin
        </div>
        <div className="relative">
          <Input placeholder="Username" setValue={setUserName} />
          <Input
            placeholder="password"
            setValue={setPassword}
            type={passType}
          />
          {password ? (
            <div
              className="absolute right-2 bottom-2 hover:cursor-pointer"
              onClick={handelVisibility}>
              {passType == "text" ? <EyeClose /> : <EyeOpen />}
            </div>
          ) : null}
        </div>
        <div className="flex mt-7 justify-center">
          <Button
            onClick={onSignin}
            varient="primary"
            customCSS="w-full flex justify-center"
            text="Submit"
          />
        </div>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
