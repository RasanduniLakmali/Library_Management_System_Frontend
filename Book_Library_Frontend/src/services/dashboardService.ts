import apiClient from "./apiClient.ts";

export const getOverdueBooksCount = async (): Promise<number> => {
    const response = await apiClient.get("/overdue/overdue-books");
    return response.data.total;
};
