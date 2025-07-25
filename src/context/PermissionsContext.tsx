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
  const { loading: authLoading } = useAuth(); // from your AuthContext
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const PF = process.env.NEXT_PUBLIC_API_URL;
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTM0Mzg5MDcsImV4cCI6MTc1MzQ0MjUwNywibmJmIjoxNzUzNDM4OTA3LCJqdGkiOiJoVVZ4aEdzMFNZa001Mm9BIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.UCdlybIN5l2uA1jzAi7pGQzaMMbCzOCuvFxUilj9i-o";

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


  const hasPermission = (permissionName: string) =>
    permissions.some((permission) => permission.name === permissionName);

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
