import { getRepository } from 'typeorm'
import config from '../config'
import Invoice from '../entities/Invoice'

import Order from '../entities/Order'
import Payment from '../entities/Payment'
import PaymentRequest from '../entities/PaymentRequest'
import fetchWithTimeout, { FetchResult } from '../lib/fetchWithTimeout'
import { InvoiceRequestType, PaymentEventType } from '../types/webhook'
import OrderService from './OrderService'

class PaymentService {
    constructor() {}

    public processPayment = async (event: PaymentEventType) => {
        try {
            console.log('processPayment type', JSON.stringify(event))

            if (event.type == 'PAYMENT_REQUEST') {
                await this.createPaymentRequest(event)
            } else if (event.type == 'PAYMENT_DONE') {
                await this.createPayment(event)
            }
        } catch (error) {
            console.error('processPayment error', error)
        }
    }

    public createInvoice = async (type: InvoiceRequestType): Promise<FetchResult> => {
        try {
            const body = {
                order: type.order,
                amount: type.amount,
                mid: type.mid,
                description: type.description,
            }

            const auth = config.NSP_CLIENT_ID + ':' + config.NSP_CLIENT_SECRET
            const CLIENT_TOKEN = Buffer.from(auth).toString('base64')

            const PAYMENT_SERVER_URL = config.NSP_PAYMENT_URL

            const json: FetchResult = await fetchWithTimeout(
                `${PAYMENT_SERVER_URL}/invoice`,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Basic ' + CLIENT_TOKEN,
                    },
                    method: 'POST',
                    body: JSON.stringify(body),
                },
                30000
            )
            console.log('createInvoice json', JSON.stringify(json))
            return json
        } catch (error) {
            console.error('createInvoice err', error.message)

            return { error }
        }
    }

    public getOrderAndInvoice = async (oid: string, invoiceId: string) => {
        const ordRepo = getRepository(Order)
        const order = await ordRepo.findOne(oid)

        if (order) {
            // TODO : check order status
            const invRepo = getRepository(Invoice)
            const invoice = await invRepo.findOne({ where: { order, invoiceId } })

            if (invoice) {
                // TODO: check invoice status
                return { order, invoice }
            }
        }

        throw new Error('invalid state')
    }

    public createPaymentRequest = async (event: PaymentEventType) => {
        const paymentType = event.paymentType
        const reqId = event.reqId
        if (reqId) {
            if (paymentType == 'socialpay' || paymentType == 'qpay') {
                const repo = getRepository(PaymentRequest)
                const exist = await repo.findOne({ where: { type: paymentType, reqId } })
                if (exist) {
                    // do nothing
                } else {
                    const { order, invoice } = await this.getOrderAndInvoice(event.order, event.invoiceId)

                    const req = new PaymentRequest()
                    req.invoice = invoice
                    req.payload = event.payload
                    req.type = paymentType
                    req.reqId = reqId
                    req.qr = event.qr
                    req.deeplink = event.deeplink
                    req.code = event.code
                    await repo.save(req)
                }
            }
        }
    }

    public createPayment = async (event: PaymentEventType) => {
        // TODO: check payment from payment service
        const paymentType = event.paymentType
        const reqId = event.reqId
        const amount = event.amount
        if (reqId && Number(amount) > 0) {
            if (paymentType == 'socialpay' || paymentType == 'qpay') {
                const { order, invoice } = await this.getOrderAndInvoice(event.order, event.invoiceId)

                const repo = getRepository(Payment)

                const payment = new Payment()
                payment.order = order
                payment.invoice = invoice
                payment.paidAmount = amount
                payment.paidAt = new Date()
                payment.reqId = reqId
                payment.type = paymentType
                payment.payload = event.payload
                await repo.save(payment)

                // TODO: partial payment
                const orderService = new OrderService()
                await orderService.paymentDone(order, amount, event)
            }
        }
    }
}

export default PaymentService
