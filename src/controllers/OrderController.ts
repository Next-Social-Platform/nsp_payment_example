import { classToPlain } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'
import { getManager } from 'typeorm'
import Order, { OrderStatus } from '../entities/Order'
import OrderService from '../services/OrderService'

class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  public createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {orderId} = req.body
      
      if (!orderId) {
        throw new Error('захиалгын дугаар хоосон байна')
      }

      const order = await this.orderService.getOrder(orderId)

      const url = await this.orderService.createInvoice(order)

      res.status(200).send({ result: {url} })
    } catch (error) {
      next(error)
    }
  }
}

export default OrderController
