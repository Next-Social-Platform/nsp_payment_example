export interface PaymentEventType {
    type: string
    order: string // 
    invoiceId: string
    svc: string
    mid: string
    paymentType?: string
    deeplink?: string
    qr?: string
    code?: string
    reqId?:string
    amount?: number
    payload?: any
}


export interface InvoiceRequestType {
    amount: number | string
    order: number | string
    description?: string
    mid: string
  }