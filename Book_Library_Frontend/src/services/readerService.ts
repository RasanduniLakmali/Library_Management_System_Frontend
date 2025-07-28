
import apiClient from "./apiClient.ts";
import type {Reader} from "../types/Reader.ts";

export const addReaders = async (readersData:Omit<Reader,"_id">) : Promise<Reader> => {
    const response = await apiClient.post(`/reader/save`,readersData);
    console.log(response)
    return response.data;
}

export const updateReaders = async (_id:string, readersData:Omit<Reader, "_id">) : Promise<Reader> => {
    const response = await apiClient.put(`/reader/${_id}`,readersData);
    return response.data;
}

export const fetchAllReaders = async () : Promise<Reader[]> => {
    const response = await apiClient.get(`/reader/get`);
    return response.data;
}

export const viewReaderByName = async (name: string): Promise<Reader[]> => {
    const response = await apiClient.get(`/reader/by-name/${encodeURIComponent(name)}`);
    return response.data;
};

export const deleteReaders = async (_id:string) : Promise<void>  => {
    await apiClient.delete(`/reader/${_id}`)

}

export const viewReaderNames = async () : Promise<string[]> => {
    const response = await apiClient.get(`/reader/get-names`)
    return response.data;
}

export const getTotalReaders = async () : Promise<number> => {
    const response = await apiClient.get(`/reader/total-readers`)
    return response.data.total;
}