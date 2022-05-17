export interface Auth {
    useNewUrlParser: boolean,
    user: string,
    pass: string,
    dbName: string,
}
export interface DBAuth {
    auth: Auth,
    hostname: string
}