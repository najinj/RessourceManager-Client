import axiosInstance from "../../config";

function logoutRequest() {
  /* return axiosInstance({
    method: "get",
    url: "Account/logout",
    data: null
  }); */
  return null;
}

function signinRequest(body) {
  return axiosInstance({
    method: "post",
    url: "Account/Login",
    data: body
  });
}

const signupRequest = body => {
  return axiosInstance({
    method: "post",
    url: "Account/Register",
    data: body
  });
};

const AuthServices = {
  signinRequest,
  signupRequest,
  logoutRequest
};

export default AuthServices;
