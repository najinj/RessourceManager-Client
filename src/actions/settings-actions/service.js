import axiosInstance from "../../config";

const getSettings = () =>
  axiosInstance({
    method: "GET",
    url: "Settings/GetSettings"
  });

const updateSettings = settings =>
  axiosInstance.put("Settings/UpdateSettings/", settings);

const SettingsServices = { getSettings, updateSettings };

export default SettingsServices;
