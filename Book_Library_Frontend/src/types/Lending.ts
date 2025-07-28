
export type LendingBook = {
    title: string,
    isbn: string,
}

export type Lending = {
    _id: string;
    readerName: string;
    books: LendingBook[];
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: string;
};

export type LendingFormData = {
    readerName: string;
    books: LendingBook[];
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: string;
}