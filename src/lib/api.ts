/// <reference types="vite/client" />
import { User, Property, Contract, Payment, Review } from "../types";
import { mockProperties } from "./mockData";

const API_BASE = "/api";
const IS_PROD = import.meta.env.PROD;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      if (IS_PROD) {
        const mockUser: User = { id: 1, name: "مستخدم تجريبي", email, role: "tenant", verified: true, created_at: new Date().toISOString() };
        localStorage.setItem("token", "mock-token");
        localStorage.setItem("user", JSON.stringify(mockUser));
        return { token: "mock-token", user: mockUser };
      }
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    },
    register: async (userData: any) => {
      if (IS_PROD) return { id: 1 };
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    getCurrentUser: (): User | null => {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },
  },
  properties: {
    getAll: async (filters: any = {}): Promise<Property[]> => {
      if (IS_PROD) {
        let filtered = [...mockProperties];
        if (filters.city) filtered = filtered.filter(p => p.city === filters.city);
        if (filters.limit) filtered = filtered.slice(0, filters.limit);
        return filtered;
      }
      const params = new URLSearchParams(filters);
      const res = await fetch(`${API_BASE}/properties?${params}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
    getOne: async (id: number): Promise<Property> => {
      if (IS_PROD) {
        const p = mockProperties.find(p => p.id === Number(id));
        if (!p) throw new Error("Not found");
        return p;
      }
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch property");
      return res.json();
    },
    create: async (propertyData: Partial<Property>): Promise<{ id: number }> => {
      if (IS_PROD) return { id: Date.now() };
      const res = await fetch(`${API_BASE}/properties`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(propertyData),
      });
      if (!res.ok) throw new Error("Failed to create property");
      return res.json();
    },
  },
  contracts: {
    create: async (contractData: any): Promise<{ id: number }> => {
      if (IS_PROD) return { id: Date.now() };
      const res = await fetch(`${API_BASE}/contracts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(contractData),
      });
      if (!res.ok) throw new Error("Failed to create contract");
      return res.json();
    },
    getMyContracts: async (): Promise<Contract[]> => {
      if (IS_PROD) return [];
      const res = await fetch(`${API_BASE}/my-contracts`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },
  },
  payments: {
    create: async (paymentData: any): Promise<{ id: number }> => {
      if (IS_PROD) return { id: Date.now() };
      const res = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(paymentData),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      return res.json();
    },
  },
};
