import { Navigate, Route } from "react-router-dom";
import { isAuthenticated } from "./auth";


type PrivateRouteProps = {
    element: React.ReactNode;
    path: string;
  };

  const PrivateRoute = ({ element, ...rest }: PrivateRouteProps) => {
    const { authenticated } = isAuthenticated();
    return authenticated ? (
      <Route {...rest} element={element} />
    ) : (
      <Navigate to="/auth" replace />
    );
  };

  export default PrivateRoute