import * as Express from 'express'

export default interface TypedRequestBody<T> extends Express.Request {
    body: T
}