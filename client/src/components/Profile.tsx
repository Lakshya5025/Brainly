import { useState } from "react";
import axios from "axios";
import { Cross } from "../icons/Cross";
import { Button } from "./Button";
const apiUrl = import.meta.env.VITE_API_URL;

export function Profile({
  setShowProfile,
}: {
  setShowProfile: (e: boolean) => void;
}) {
  const [user, setUser] = useState({ username: "", email: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${apiUrl}/user`, user, { withCredentials: true });
      alert("Profile updated!");
    } catch (error) {
      console.log(error);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.post(
        `${apiUrl}/user/password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      alert("Password changed!");
    } catch (error) {
      console.log(error);
      alert("Failed to change password.");
    }
  };
  function onClose() {
    setShowProfile(false);
  }

  return (
    <div className="top-0 left-0 r-0  w-95 absolute w-50 p-5  bg-white ">
      <div className="absolute right-5 hover:cursor-pointer" onClick={onClose}>
        <Cross />
      </div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="mt-5">
        <h2 className="text-xl">Update Information</h2>
        <input
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
          className="bg-grey-200 w-full rounded-md py-2 pl-2 my-2"
        />
        <input
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="bg-grey-200 w-full rounded-md py-2 pl-2 my-2"
        />
        <Button
          text="Update"
          varient="primary"
          customCSS="my-3"
          onClick={handleUpdateUser}
        />
      </div>
      <div className="mt-5">
        <h2 className="text-xl">Change Password</h2>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
          className="bg-grey-200 w-full rounded-md py-2 pl-2 my-2"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="bg-grey-200 w-full rounded-md py-2 pl-2 my-2"
        />
        <Button
          text="Change Password"
          varient="primary"
          customCSS="my-3"
          onClick={handleChangePassword}
        />
      </div>
    </div>
  );
}
