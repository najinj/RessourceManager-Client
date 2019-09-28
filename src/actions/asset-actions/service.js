import axiosInstance from "../../config";

const getAsset = id => {
  axiosInstance.get(`Asset/Get/${id}`);
};

const fetchAssets = () =>
  axiosInstance({
    method: "GET",
    url: "Asset/Get"
  });

const updateAsset = (id, asset) =>
  axiosInstance.put(`Asset/Update/${id}`, asset);

const addAsset = asset => axiosInstance.post("Asset/Create", asset);

const deleteAsset = id =>
  axiosInstance({
    method: "DELETE",
    url: `Asset/Delete/${id}`
  });

const AssetServices = {
  updateAsset,
  deleteAsset,
  fetchAssets,
  addAsset,
  getAsset
};

export default AssetServices;
