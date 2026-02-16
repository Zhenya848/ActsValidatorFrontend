import Home from "../pages/Home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      
      children: [
        /*{
          path: "/",
          element: <MainPage />
        }*/
      ],
      errorElement: <div>404 Страница не найдена!</div>
    }
  ])
  