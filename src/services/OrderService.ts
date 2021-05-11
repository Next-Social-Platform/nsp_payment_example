import { EntityManager, getManager, getRepository, getConnection, Brackets, SimpleConsoleLogger } from 'typeorm'
import Order, { OrderStatus, PaymentStatus } from '../entities/Order'
import config from '../config'
import PaymentService from './PaymentService'
import { FetchResult } from '../lib/fetchWithTimeout'
import Invoice from '../entities/Invoice'

class OrderService {
  constructor() {
  }

  public getOrder = async (orderId: string) => {
    const repo = getRepository(Order)

    const order = await repo.findOne({ where: { id: orderId } })

    return order
  }

  public createInvoice = async (order: Order) => {
    const paymentService = new PaymentService()

    const { result, error }: FetchResult = await paymentService.createInvoice({
      mid: '1', // default merchant,
      order: order.id,
      amount: order.totalAmount,
      //amount: 100,
      description: `${order.id} захиалга`,
    })

    if (result && result.invoiceId && result.token) {
      //invoice created
      const repo = getRepository(Invoice)

      const invoice = new Invoice()
      invoice.invoiceId = result.invoiceId
      invoice.token = result.token //used for auth
      invoice.amount = order.totalAmount
      //invoice.amount = 100
      invoice.order = order

      await repo.save(invoice)

      const url = `${config.NSP_PAYMENT_URL}/dialog/${result.token}`

      return url

    }

    throw new Error('Төлбөрийн нэхэмжлэл үүсгэхэд алдаа гарлаа')
  }

  public paymentDone = async (order: Order, paidAmount: number, event: any) => {
    const repo = getRepository(Order)

    // TODO: check paidAmount
    // if (order.price == amount) {
    if (order.paymentStatus == PaymentStatus.UNPAID) {
      repo.merge(order, { paymentStatus: PaymentStatus.PAID })
      await repo.save(order)

    }
  }
}

export default OrderService
