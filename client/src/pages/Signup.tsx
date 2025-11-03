import { useState } from "react";
import { Button } from "../components/Button";
import { EyeOpen } from "../icons/EyeOpen";
import { EyeClose } from "../icons/EyeClose";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
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

export function Signup() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passType, setPassType] = useState("password");
  const navigate = useNavigate();

  function handelVisibility() {
    if (passType == "text") setPassType("password");
    else if (passType == "password") setPassType("text");
  }
  async function onSignup() {
    try {
      const response = await axios.post(`${apiUrl}/signup`, {
        username: userName,
        password,
        email,
      });
      console.log(response);

      if (response.status === 201) {
        navigate("/verify-otp", { state: { email } });
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.message == "Request failed with status code 409"
      ) {
        alert("user already exist");
      } else if (error instanceof AxiosError) {
        console.error("Login failed:", error.response?.data.message);
        alert("Failed to create user");
      }
    }
  }

  return (
    <div className="bg-purple-100 h-screen w-screen  flex justify-center items-center">
      <div className="bg-white w-80 rounded-lg px-5 py-7">
        <div className="flex justify-center text-xl mb-2 font-semibold">
          Signup
        </div>
        <div className="relative">
          <Input placeholder="Email" setValue={setEmail} />
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
            onClick={onSignup}
            varient="primary"
            customCSS="w-full flex justify-center"
            text="Submit"
          />
        </div>
        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link to="/signin" className="text-purple-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
