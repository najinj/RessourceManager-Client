import axiosInstance from "../../config";

const fetchRessourceTypes = () =>
  axiosInstance({
    method: "GET",
    url: "RessourceType"
  });

const updateRessourceType = (id, ressourceType) =>
  axiosInstance.put(`RessourceType/${id}`, ressourceType);

const addRessourceType = ressourceType =>
  axiosInstance.post("RessourceType/", ressourceType);

const deleteRessourceType = id =>
  axiosInstance({
    method: "DELETE",
    url: `RessourceType/${id}`
  });

const RessourceTypesServices = {
  updateRessourceType,
  deleteRessourceType,
  fetchRessourceTypes,
  addRessourceType
};

export default RessourceTypesServices;
