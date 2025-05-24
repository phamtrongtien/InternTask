import {
    InteractionRequiredAuthError,
    PublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

// Thêm font Inter qua CSS (nhớ thêm link Google Fonts vào index.html hoặc public/index.html)
/*
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
*/

// Interface cho dữ liệu profile
interface ProfileData {
    displayName: string;
    userPrincipalName: string;
}

// Cấu hình MSAL
const msalConfig = {
    auth: {
        clientId: "ba343fef-be4a-455d-8d99-75b732cbdda6",
        authority:
            "https://login.microsoftonline.com/8d72c235-dd33-4381-b69c-95c5221f9041",
        redirectUri: "http://localhost:5173",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

const loginRequest = {
    scopes: ["User.Read"],
};

const msalInstance = new PublicClientApplication(msalConfig);

function Profile() {
    const { instance, accounts } = useMsal();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    useEffect(() => {
        const requestProfile = async () => {
            try {
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                });
                const graphResponse = await fetch(
                    "https://graph.microsoft.com/v1.0/me",
                    {
                        headers: {
                            Authorization: `Bearer ${response.accessToken}`,
                        },
                    }
                );
                const data = await graphResponse.json();
                setProfileData(data);
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    instance.acquireTokenRedirect(loginRequest);
                } else {
                    console.error(error);
                }
            }
        };

        if (accounts && accounts.length > 0) {
            requestProfile();
        }
    }, [accounts, instance]);

    return (
        <div>
            {profileData ? (
                <div>
                    <h2>{profileData.displayName}</h2>
                    <p>{profileData.userPrincipalName}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
}

export default function Home() {
    const handleLogin = () => {
        msalInstance.loginRedirect(loginRequest);
    };

    return (
        <MsalProvider instance={msalInstance}>
            <div style={{ fontFamily: "'Inter', sans-serif" }}>
                <h1>Welcome to MSAL React App</h1>
                <button onClick={handleLogin}>Login</button>
                <Profile />
            </div>
        </MsalProvider>
    );
}
