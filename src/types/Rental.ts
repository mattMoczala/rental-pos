import Item from "./Item"
import Client from "./Client"
// import mongoose from "mongoose"
// import RentalModel from "../models/rental"

export interface RentalPopulatedWithData {
    priceTotal: number,
    startDate: Date,
    endDate: Date,
    ongoing: boolean,
    rented: [{
        item: Item,
        itemRealIdentifier: number
    }]
    client: Client,
    createdOn: Date
}

// type rentmodel = typeof RentalModel;
export interface RentalNotPopulated{
    priceTotal: number
    startDate: Date
    endDate: Date
    ongoing: boolean
    rented: [{
        item: Item,
        itemRealIdentifier: number
    }]
    client: Client,
    createdOn: Date
}