import React from "react";
import {
  useMsal,
  useIsAuthenticated,

} from "@azure/msal-react";
import { loginRequest } from "../../authConfig";

const SharePointLogin: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(console.error);
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      if (error) {
        const response = await instance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      }
      console.error(error);
      return null;
    }
  };

  const fetchSharePointSite = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    const siteUrl = "https://1work.sharepoint.com/sites/eofficev3";
    const endpoint = `${siteUrl}/_api/web`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      alert("Tên site SharePoint: " + data.d.Title);
      console.log(data);
    } catch (error) {
      console.error("Lỗi gọi API SharePoint:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Đăng nhập SharePoint
        </button>
      ) : (
        <div>
          <p className="mb-4">Xin chào, {accounts[0].username}</p>
          <button
            onClick={fetchSharePointSite}
            className="mr-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Lấy thông tin SharePoint Site
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default SharePointLogin;
