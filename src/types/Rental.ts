import Item from "./Item"
import Client from "./Client"
// import mongoose from "mongoose"
// import RentalModel from "../models/rental"

export interface RentalPopulatedWithData {
    _id?: string,
    priceTotal: number,
    startDate: string,
    endDate: string,
    ongoing: boolean,
    rented: [{
        item: Item,
        itemRealIdentifier: number
    }]
    client: Client,
    createdOn: Date
}
export interface RentalNotPopulated{
    _id?: string,
    priceTotal: number
    startDate: Date
    endDate: Date
    ongoing: boolean
    rented: [{
        item: Item,
        itemRealIdentifier: string
    }]
    client: Client,
    createdOn: Date
}