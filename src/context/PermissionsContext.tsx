"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// Define your permission type
interface Permission {
  id: number;
  name: string;
}

// Define the context shape
interface PermissionsContextType {
  permissions: Permission[];
  loading: boolean;
  hasPermission: (permissionName: string) => boolean;
}

// Create the context
const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Props for provider
interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { loading: authLoading, user } = useAuth(); // from your AuthContext
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const PF = process.env.NEXT_PUBLIC_API_URL;
  const { token } = useAuth();

  console.log("user permissions", user?.permissions);

  useEffect(() => {
    const fetchPermissions = async () => {
      // Don't fetch if auth is still loading or token is missing
      if (authLoading ) {
        setLoading(false);
        return;
      }else{
        try {
            const response = await axios.get<Permission[]>(`${PF}/permissions/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setPermissions(response.data);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
        } finally {
            setLoading(false);
        }
      }
    };

    fetchPermissions();
  }, [token, authLoading]);
  
    console.log("Permissions:", permissions);

  //Check whether user has certain permissions or not
  const userPermissions = user?.permissions || [];
  const hasPermission = (permissionName: string) =>
    userPermissions.some((permission) => permission === permissionName);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook to use the context
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
