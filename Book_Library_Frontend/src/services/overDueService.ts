import type {Lending} from "../types/Lending.ts";
import apiClient from "./apiClient.ts";

export const viewAllOverDues = async () : Promise<Lending[]> => {
    const response = await apiClient.get(`/overdue/get`)
    return response.data
}


export interface OverdueReaderInfo {
    name: string;
    email: string;
}

export const getOverDueWithBook = async (): Promise<string[]> => {
    const response = await apiClient.get(`/overdue/get-overDues`);
    const data: { readerName: string; bookTitle: string }[] = response.data;


    const readerNames = Array.from(new Set(data.map(entry => entry.readerName)));
    return readerNames;
};



export const getEmailByReader = async (readerName: string): Promise<string> => {
    if (!readerName || typeof readerName !== "string") {
        throw new Error("Invalid reader name provided");
    }

    const response = await apiClient.get(`/reader/get-email/${encodeURIComponent(readerName)}`);
    return response.data?.email ?? "Not found";
};



export const getOverdueReadersWithEmail = async (): Promise<OverdueReaderInfo[]> => {
    try {
        const readerNames = await getOverDueWithBook(); // readerNames is string[]

        const results: OverdueReaderInfo[] = await Promise.all(
            readerNames.map(async (readerName) => {
                try {
                    const email = await getEmailByReader(readerName);
                    return { name: readerName, email };
                } catch (err) {
                    console.warn(`Failed to get email for reader: ${readerName}`, err);
                    return { name: readerName, email: "Not found" };
                }
            })
        );

        return results;
    } catch (err) {
        console.error("Failed to fetch overdue readers with emails", err);
        return [];
    }
};