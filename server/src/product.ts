import * as mongodb from "mongodb";

export interface Shirts {
    _id?: mongodb.ObjectId;
    id: number;
    name: string;
    image: string;
    price: number;
}