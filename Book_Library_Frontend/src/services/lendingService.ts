import type {Lending} from "../types/Lending.ts";
import apiClient from "./apiClient.ts";


export const lendingBooks = async (lendingData:Omit<Lending, "_id">) : Promise<Lending> => {
    const response = await apiClient.post(`/lending/lend`,lendingData)
    return response.data;
}

export const updateLendings = async (_id:string, lendingData:Omit<Lending, "_id">) : Promise<Lending> => {
    const response = await apiClient.put(`/lending/${_id}`,lendingData);
    return response.data;
}

export const fetchAllLendings = async () : Promise<Lending[]> => {
    const response = await apiClient.get(`/lending/get`);
    return response.data;
}

export const viewLendingByName = async (name: string): Promise<Lending[]> => {
    const response = await apiClient.get(`/lending/by-reader/${encodeURIComponent(name)}`);
    return response.data;
};

export const deleteLending = async (_id:string) : Promise<void>  => {
    await apiClient.delete(`/lending/delete/${_id}`)

}

export const getTotalLendingBooks = async (): Promise<number> => {
    const response = await apiClient.get(`/lending/lend-books-total`);
    return response.data.total;
};
