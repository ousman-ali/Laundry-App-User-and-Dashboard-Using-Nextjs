"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];        // changed to array for clarity
  permissions: string[];  // changed to array for clarity
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const PF = process.env.NEXT_PUBLIC_API_URL;

  // Load saved user/token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // 🔐 Fetch Authenticated User
  const fetchUser = async (accessToken: string) => {
    try {
      const response = await axios.get(`${PF}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    }
  };

  // ✅ Login and save tokens
  const login = async (email: string, password: string) => {
    const response = await axios.post(`${PF}/auth/login`, {
      email,
      password,
    });

    const { access_token, refresh_token } = response.data.authorization;

    setToken(access_token);
    localStorage.setItem("token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    await fetchUser(access_token);
  };

  // ✅ Logout user
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${PF}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.warn("Logout failed or token already expired.");
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  // 🔁 Refresh token
  const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return;

    try {
      const response = await axios.post(`${PF}/auth/refresh-token`, {
        refresh_token,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      setToken(access_token);
      localStorage.setItem("token", access_token);

      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      await fetchUser(access_token);
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
    }
  };

  // Auto-refresh every 10 mins (or adjust to just before expiry)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
