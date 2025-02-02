export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "farmer" | "buyer";
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
  role: "farmer" | "buyer";
}

export interface Crop {
  id: string;
  farmerId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  status: "available" | "sold" | "reserved";
  createdAt: string;
}

export interface Resource {
  id: string;
  ownerId: string;
  name: string;
  type: "equipment" | "tool" | "other";
  availability: "available" | "in_use" | "maintenance";
  pricePerDay: number;
  description: string;
  createdAt: string;
}
