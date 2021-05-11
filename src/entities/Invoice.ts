import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Order from './Order'
import Payment from './Payment'
import PaymentRequest from './PaymentRequest'

@Entity('invoice')
class Invoice {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  invoiceId: string //from external system

  @Column({ nullable: true })
  token: string //from external system

  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, default: null })
  amount: number

  @Column({ type: 'json', nullable: true })
  payload: any

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date


  @ManyToOne(() => Order, (order) => order.invoices)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[]
  
  @OneToMany(() => PaymentRequest, (req) => req.invoice)
  requests: PaymentRequest[]


  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date
}

export default Invoice
