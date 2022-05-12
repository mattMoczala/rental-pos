import Item from "./Item"
import Client from "./Client"

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

export interface RentalNotPopulated {
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