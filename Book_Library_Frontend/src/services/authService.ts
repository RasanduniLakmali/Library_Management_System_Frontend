import type {User} from "../types/User.ts";
import apiClient from "./apiClient.ts";


export interface signUpResponse {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    _id: string
}

export interface loginResponse {
    firstName: string;
    lastName: string;
    email: string;
    accessToken: string;
    _id: string;
}


export const signUpUser = async (userData: Omit<User, "_id">): Promise<signUpResponse> => {
    const response = await apiClient.post("/auth/signUp", userData);
    return response.data;
};


type LoginRequest = {
    email: string;
    password: string;
};

export const loginUser = async (loginData: LoginRequest): Promise<loginResponse> => {
    const response = await apiClient.post("/auth/login", loginData);
    return response.data;
};


export const getUserProfile = async (accessToken: string) => {
    const response = await apiClient.get("/auth/get-profile", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
    });

    return response.data;
};

export const updateUserProfile = async (accessToken: string, updatedUser: Partial<User>) => {
    const response = await apiClient.put("/auth/update-profile", updatedUser, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};


export const updatePassword = async (
    token: string,
    passwordData: {
        currentPassword: string;
        newPassword: string;
    }
) => {
    const response = await fetch("http://localhost:3002/api/auth/change-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
    });

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error("Server response was not valid JSON");
    }

    if (!response.ok) {
        throw new Error(data?.message || "Failed to change password");
    }


    return data;

};
