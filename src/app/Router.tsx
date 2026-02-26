import Home from "../pages/Home";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../RootLayout";
import Upload from "../pages/Upload";
import History from "../pages/History";
import CollationDetails from "../pages/CollationDetails";
import Register from "../pages/Register";
import Login from "../pages/Login";

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
          path: "/collationDetails",
          element: <CollationDetails />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/login",
          element: <Login />
        }
      ],
      errorElement: <div>404 Страница не найдена!</div>
    }
  ])
  