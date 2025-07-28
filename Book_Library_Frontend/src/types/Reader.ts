
export type Reader = {
    _id: string;
    readerId: string;
    name:string,
    email:string,
    phone:string,
    address:string,
    membershipDate:string,
    status:'Active' | 'Inactive' | 'Suspended',
    avatar?: string
}

export type ReaderFormData = {
    readerId: string;
    name:string,
    email:string,
    phone:string,
    address:string,
    membershipDate:string,
    status:'Active' | 'Inactive' | 'Suspended',
    avatar?: string
}