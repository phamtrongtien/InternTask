import React from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';

const Task3: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = accounts && accounts.length > 0 ? accounts[0] : null;

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then((response) => {
        alert("Đăng nhập thành công: " + response.account?.username);
        console.log(response.account)
      })
      .catch((error) => {
        console.error("Login error:", error);
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

  const uploadProps = {
    name: 'file',
    multiple: false,
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          onError && onError(new Error('Không lấy được access token'));
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('accessToken', accessToken);
console.log(file)
        const res = await fetch('http://localhost:3000/sharepoint/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          onError && onError(new Error(`Upload lỗi: ${errorText}`));
          return;
        }

        const data = await res.json();
        onSuccess && onSuccess(data);
      } catch (err) {
        onError && onError(err);
      }
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} upload thành công`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload thất bại`);
      }
    },
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
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Click để Upload file lên SharePoint</Button>
          </Upload>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-4"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default Task3;
