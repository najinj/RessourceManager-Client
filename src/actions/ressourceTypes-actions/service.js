import axiosInstance from "../../config";

const fetchRessourceTypes = () =>
  axiosInstance({
    method: "GET",
    url: "RessourceType"
  });

const updateRessourceType = (id, ressourceType) =>
  axiosInstance.put(`RessourceType/${id}`, ressourceType);

const addRessourceType = ressourceType =>
  axiosInstance({
    method: "POST",
    url: "RessourceType",
    body: ressourceType
  });

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
