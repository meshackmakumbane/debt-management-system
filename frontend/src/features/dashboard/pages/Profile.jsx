import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { CiSaveDown1 } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { IoMailOutline } from "react-icons/io5";
import { BsPhone } from "react-icons/bs";
import { LuMapPin } from "react-icons/lu";
import { SiHomeadvisor } from "react-icons/si";

import { getProfile } from '../../auth/authSlice'

const Profile = () => {
  const dispatch = useDispatch()
  const { user, loading, error, role } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@company.com",
    phone: "+27 82 123 4567",
    role: "Agent",
    location: "Johannesburg, South Africa",
    organization: "Debt Hero",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    // API call here later
    setIsEditing(false);
  };

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  console.log(user)

  return (
    <div className="min-h-[calc(100vh-5rem)] p-6 rounded-lg bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 mt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{user?.name || "User Profile"}</h1>
            <p className="text-gray-500 text-sm">
              Manage account information and settings
            </p>
          </div>

          <button
            onClick={isEditing ? handleSave : toggleEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            {isEditing ? <CiSaveDown1 size={18} /> : <CiEdit size={18} />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left - Avatar */}
          <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-3xl font-bold">
              {user?.name.charAt(0)}
            </div>

            <h2 className="mt-4 font-semibold text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.role.toUpperCase()}</p>

            <span className="mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
              Active
            </span>
          </div>

          {/* Right - Details */}
          <div className="md:col-span-2 grid grid-cols-1 gap-4">

            {/* Full Name */}
            <Field
              icon={<CiUser size={18} />}
              label="Full Name"
              name="fullName"
              value={user?.name}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {/* Email */}
            <Field
              icon={<IoMailOutline size={18} />}
              label="Email"
              name="email"
              value={user?.email}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {/* Phone */}
            <Field
              icon={<BsPhone size={18} />}
              label="Phone"
              name="phone"
              value={user?.phone}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {/* Location */}
            <Field
              icon={<LuMapPin size={18} />}
              label="Location"
              name="location"
              value={profile.location}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {/* Department */}
            <Field
              icon={<SiHomeadvisor size={18} />}
              label="Organization"
              name="organization"
              value={profile.organization}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Field Component */
const Field = ({ icon, label, name, value, isEditing, onChange }) => {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      {isEditing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded-md px-2 py-1 text-sm w-1/2"
        />
      ) : (
        <span className="text-sm font-medium text-gray-800">{value}</span>
      )}
    </div>
  );
};

export default Profile;