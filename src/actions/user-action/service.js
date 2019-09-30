import axiosInstance from "../../config";

const fetchUsers = () =>
  axiosInstance({
    method: "GET",
    url: "User/Get"
  });

const ActivateOrDeactivateUser = email => {
  axiosInstance({
    method: "GET",
    url: "User/ActivateOrDeactivateUser",
    params: {
      email
    }
  });
};

const UserServices = {
  ActivateOrDeactivateUser,
  fetchUsers
};

export default UserServices;
