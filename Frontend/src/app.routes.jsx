import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import ErrorPage from "./features/error/pages/ErrorPage";
import Home from "./features/interview/pages/Home";
import Protected from "./features/auth/components/Protected";

import Report from "./features/interview/pages/Report";

export const router = createBrowserRouter([
      {
            path: "/",
            element: <Protected><Home /></Protected>
      },
      {
            path: "/report",
            element: <Protected><Report /></Protected>
      },
      {
            path: "/login",
            element: <Login />,
            errorElement: <ErrorPage />
      },
      {
            path: "/register",
            element: <Register />,
            errorElement: <ErrorPage />
      },
      {
            path: "*",
            element: <ErrorPage />
      }
])

