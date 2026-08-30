import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

import { getProfile } from "../../services/profileService";

/**
 * Guards nested routes by the current user's `role` (from the
 * `profiles` table). Renders <Outlet /> only if the user's role is
 * included in `allowedRoles`; otherwise redirects to the home page.
 *
 * Must be rendered *inside* <ProtectedRoute>, since it assumes the
 * user is already authenticated.
 */
const RoleRoute = ({ allowedRoles = [] }) => {
  const [status, setStatus] = useState("loading"); // loading | allowed | denied

  useEffect(() => {
    let active = true;

    getProfile()
      .then((profile) => {
        if (!active) return;

        const role = profile?.role || "user";

        if (allowedRoles.includes(role)) {
          setStatus("allowed");
        } else {
          setStatus("denied");
        }
      })
      .catch((err) => {
        console.error("RoleRoute: failed to load profile", err);
        if (active) setStatus("denied");
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (status === "denied") {
    toast.error("You don't have access to that page.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
