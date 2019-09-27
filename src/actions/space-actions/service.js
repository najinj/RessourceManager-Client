import axiosInstance from "../../config";

const getSpace = id => {
  axiosInstance.get(`Space/Get/${id}`);
};

const fetchSpaces = () =>
  axiosInstance({
    method: "GET",
    url: "Space/Get"
  });

const updateSpace = (id, ressourceType) =>
  axiosInstance.put(`Space/Update/${id}`, ressourceType);

const addSpace = ressourceType =>
  axiosInstance.post("Space/Create", ressourceType);

const deleteSpace = id =>
  axiosInstance({
    method: "DELETE",
    url: `Space/Delete/${id}`
  });

const RemoveAssetFromSpace = (assetId, spaceId) => {
  axiosInstance({
    method: "GET",
    url: "Space/RemoveAssetFromSpace",
    params: {
      assetId,
      spaceId
    }
  });
};

const AddAssetToSpace = (assetId, spaceId) => {
  axiosInstance({
    method: "GET",
    url: "Space/AddAssetToSpace",
    params: {
      assetId,
      spaceId
    }
  });
};

const SpaceServices = {
  updateSpace,
  deleteSpace,
  fetchSpaces,
  addSpace,
  RemoveAssetFromSpace,
  AddAssetToSpace,
  getSpace
};

export default SpaceServices;
