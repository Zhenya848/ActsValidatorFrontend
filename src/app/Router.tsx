import Home from "../pages/Home";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../RootLayout";
import Upload from "../pages/Upload";
import History from "../pages/History";
import CollationDetails from "../pages/CollationDetails";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Pricing from "../pages/Pricing";
import Settings from "../pages/Settings";
import EmailVerified from "../pages/EmailVerified";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout currentPageName={"home"} />,
      
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/upload",
          element: <Upload />
        },
        {
          path: "/history",
          element: <History />
        },
        {
          path: "history/details",
          element: <CollationDetails />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/pricing",
          element: <Pricing />
        },
        {
          path: "/settings",
          element: <Settings />
        },
        {
          path: "/email-verified",
          element: <EmailVerified />
        }
      ],
      errorElement: <div>404 Страница не найдена!</div>
    }
  ])
  