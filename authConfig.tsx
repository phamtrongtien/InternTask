export const msalConfig = {
    auth: {
      clientId: "197aa42e-b3b5-4d41-8de9-23f0a49bbad3",
      authority: "https://login.microsoftonline.com/8d72c235-dd33-4381-b69c-95c5221f9041",
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const loginRequest = {
    scopes: ["User.Read", "Sites.Read.All"]
  };
  