import React from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

const SharePointLogin: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = accounts && accounts.length > 0 ? accounts[0] : null;
  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then((response) => {
        alert(response)
        console.log("Đăng nhập thành công:", response);
      })
      .catch((error) => {
        console.error("Login error chi tiết:", error);
        alert(`Đăng nhập thất bại, vui lòng thử lại.\nLỗi: ${error.message || error}`);
      });
  };
  

  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!account) {
      alert("Không tìm thấy tài khoản đăng nhập.");
      return null;
    }
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const response = await instance.acquireTokenPopup(loginRequest);
          return response.accessToken;
        } catch (popupError) {
          console.error("Acquire token popup error:", popupError);
          alert("Lấy token thất bại.");
          return null;
        }
      } else {
        console.error("Acquire token silent error:", error);
        alert("Lấy token thất bại.");
        return null;
      }
    }
  };

  const fetchSharePointSite = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      alert("Không thể lấy token truy cập.");
      return;
    }

    const siteUrl = "https://work1.sharepoint.com/sites/eofficev3";
    const endpoint = `${siteUrl}/_api/web`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Tên site SharePoint: " + data.d.Title);
      console.log(data);
    } catch (error) {
      console.error("Lỗi gọi API SharePoint:", error);
      alert("Lỗi khi gọi API SharePoint.");
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
          <p className="mb-4">Xin chào, {account?.username}</p>
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
