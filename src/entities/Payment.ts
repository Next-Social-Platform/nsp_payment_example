import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Invoice from './Invoice'
import Order from './Order'

@Entity()
export default class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'json', nullable: true })
    payload: any

    @Column()
    reqId: string // payment request message socialpay, qpay
    
    @Column()
    type: string // payment request message socialpay, qpay

    @Column({ name:'paid_amount', type: 'decimal', precision: 18, scale: 2, default: null })
    paidAmount: number

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order
    
    @ManyToOne(() => Invoice, (invoice) => invoice.payments)
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice


    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date
}
