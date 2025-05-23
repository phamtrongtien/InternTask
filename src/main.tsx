import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.tsx'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../authConfig.tsx";
const msalInstance = new PublicClientApplication(msalConfig);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <MsalProvider instance={msalInstance}>
    <BrowserRouter>
      <Provider store={store}>
      <App />
    </Provider>
      </BrowserRouter>
      </MsalProvider>
  </StrictMode>,
)
