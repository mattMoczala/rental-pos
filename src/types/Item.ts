export default interface Item{
    _id?: string,
    name: string,
    price: number,
    image: string,
    unitsTotal: number,
    unitsAviable: number,
    createdOn: Date,
}