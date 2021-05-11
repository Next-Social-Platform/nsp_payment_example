import { Router } from 'express'
import OrderController from '../controllers/OrderController'


const router = Router()

const orderController = new OrderController()


router.post(['/invoice'], orderController.createInvoice)


export default router
