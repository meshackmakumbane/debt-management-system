import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchSettings, saveSettings } from '../../service/settingSlice'
import PageLoader from '../../../components/UI/PageLoader'

const Settings = () => {
  const { settings, status, error } = useSelector((state) => state.setting);
  const dispatch = useDispatch();
  const [settingsData, setSettingsData] = useState({
    appName: settings?.appName || '',
    logo : settings?.logo || '',
    currency : settings?.currency || '',
    dateFormat : settings?.dateFormat || '',
  });

  /* ---- FETCH SETTINGS ---- */
  useEffect(() => {
    dispatch(fetchSettings()) 
  }, []);

  /* ---- HANDLE CHANGE ---- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setSettingsData((prev) => (
      {...prev, [name]: value}
    ))
  };

  /* ---- HANDLE SAVE ---- */
  const handleSave = async () => {
    dispatch(saveSettings(settingsData));
    alert("Settings saved");
  };

  if (status === "loading") return <PageLoader />;

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>

      {/* Currency */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Currency</label>
        <input
          type="text"
          value={settingsData.currency}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Interest Rate */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Date Format
        </label>
        <input
          type="text"
          value={settingsData.dateFormat}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-green-900 text-white px-4 py-2 rounded cursor-pointer"
      >
        {status === "loading" ? "Please wait.." : "Save Settings"}
      </button>
    </div>
  )
}

export default Settings
