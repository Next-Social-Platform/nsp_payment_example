import { Router } from 'express'
import WebhookController from '../controllers/WebhookController'

const router = Router()

const webhookController = new WebhookController()

router.post('/payment', webhookController.payment)

export default router
