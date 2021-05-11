import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Order from '../entities/Order'
import OrderService from '../services/OrderService'
import PaymentService from '../services/PaymentService'
import { PaymentEventType } from '../types/webhook'

class WebhookController {
    private paymentService: PaymentService
    private orderService: OrderService

    constructor() {
        this.paymentService = new PaymentService()
        this.orderService = new OrderService()
    }

    public payment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const type: PaymentEventType = req.body

            this.paymentService.processPayment(type).catch((err) => {
                console.log('processPayment err', err)
            })

            res.status(200).json({ status: 'OK' }) //must send
        } catch (err) {
            next(err)
        }
    }


}

export default WebhookController
