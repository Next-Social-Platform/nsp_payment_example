declare namespace Express {
  interface Request {
    token?: any
    svc?: string
    user?: any
    merchant?: any
    product?: any
    category?: any
    order?: any
  }
}
