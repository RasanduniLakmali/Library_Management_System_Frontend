
export type Book = {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    status: 'Available' | 'Lent' | 'Reserved';
    publicationYear: string;
    publisher: string;
    description: string;
}

export type BookFormData = {
    title: string;
    author: string;
    isbn: string;
    category: string;
    status: 'Available' | 'Lent' | 'Reserved';
    publicationYear: string;
    publisher: string;
    description: string;
}