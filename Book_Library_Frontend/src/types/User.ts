export type User  = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}


export type UserFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}