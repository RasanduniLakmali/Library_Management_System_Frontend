import apiClient from "./apiClient.ts";
import type {Book} from "../types/Book.ts";
import type {LendingBook} from "../types/Lending.ts";


export const addBooks = async (booksData:Omit<Book,"_id">) : Promise<Book> => {
    const response = await apiClient.post(`/book/save`,booksData);
    console.log(response)
    return response.data;
}

export const updateBooks = async (_id:string, booksData:Omit<Book, "_id">) : Promise<Book> => {
    const response = await apiClient.put(`/book/${_id}`,booksData);
    return response.data;
}

export const fetchAllBooks = async () : Promise<Book[]> => {
    const response = await apiClient.get(`/book/get`);
    return response.data;
}

export const deleteBooks = async (_id:string) : Promise<void>  => {
    await apiClient.delete(`/book/delete/${_id}`)

}

export const viewBookByName = async (bookName: string): Promise<Book[]> => {
    const response = await apiClient.get(`/book/by-name/${encodeURIComponent(bookName)}`);
    return response.data;
};

export const getBookTitleWithISBN = async (): Promise<LendingBook[]> => {
    const response = await apiClient.get(`/book/get-books`);
    return response.data;
}

export const getTotalBooks = async () : Promise<number> => {
    const response = await apiClient.get(`/book/total-books`)
    return response.data.total;
}