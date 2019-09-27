import axiosInstance from "../../config";

const getRessourceTypeByType = (type) => 
axiosInstance({
  method: "GET",
  url: "RessourceType/GetRessourceTypeByType",
  params : type
});


const fetchRessourceTypes = () =>
  axiosInstance({
    method: "GET",
    url: "RessourceType/Get"
  });

const updateRessourceType = (id, ressourceType) =>
  axiosInstance.put(`RessourceType/Update/${id}`, ressourceType);

const addRessourceType = ressourceType =>
  axiosInstance.post("RessourceType/Create", ressourceType);

const deleteRessourceType = id =>
  axiosInstance({
    method: "DELETE",
    url: `RessourceType/Delete/${id}`
  });

const RessourceTypesServices = {
  updateRessourceType,
  deleteRessourceType,
  fetchRessourceTypes,
  addRessourceType,
  getRessourceTypeByType
};

export default RessourceTypesServices;
