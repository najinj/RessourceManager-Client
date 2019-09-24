import axiosInstance from "../../config";


const fetchRessourceTypes = () =>(
    axiosInstance({
        method:"GET",
        url:"RessourceTypes"
    })
)

const updateRessourceType = (id,ressourceType) =>(
    axiosInstance({
        method:"PUT",
        url:`RessourceTypes/${id}`,
        body:ressourceType,
          
    })
)

const addRessourceType = (ressourceType) =>(
    axiosInstance({
        method:"POST",
        url:"RessourceTypes",
        body:ressourceType,
          
    })
)

const deleteRessourceType = (id) =>(
    axiosInstance({
        method:"DELETE",
        url:`RessourceTypes/${id}`,  
    })
)




const RessourceTypesServices = {
  updateRessourceType,
  deleteRessourceType,
  fetchRessourceTypes,
  addRessourceType
};

export default RessourceTypesServices;