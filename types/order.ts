import Address from "../entities/order/Address";
import Contact from "../entities/order/Contact";
import GpsPoint from "../entities/order/GpsPoint";
import { PaymentType, SVC } from "../entities/order/Order";

export interface OrderPayload {
  orderIdRef?: string
  zuvluhId?: string
  sender?: Contact
  receiver?: Contact
  targetDate: Date
  svc: SVC
  paymentType: PaymentType,
  customerId: number | null,
  customerName: string | null,

  lineItemList: LineItemPayload[]
  additionalServiceList: AdditionalServicePayload[]
}


export interface LineItemPayload {
  id: number,
  name: string,
  weight?: number,
  weightTypeNo: number,
  weightTypeName: string,
  deliveryCost: number,
  additionalCost: number,
  warningName?: string
  warningValue?: string,
}

export interface AdditionalServicePayload {
  id: number,
  selected: boolean
}

export interface OrderPrintPayload {
  order: string[]
}

export interface OrderKafkaPayload {
  payload: {
    orderId: string | number,
    itemList: LineItemKafkaPayload[]
  }
  scanDescription: string
  user: any
}

export interface LineItemKafkaPayload {
  id: string | number
  itemId: string | number
  barcode: string
}

export interface InvoiceRequestType {
  amount: number | string
  order: number | string
  description?: string
  mid: string
}