const parseJwt = token => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const ROLES_CLAIMS =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export { ROLES_CLAIMS };

export default parseJwt;

// '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
