import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Invoice from './Invoice'

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

@Entity('orders')
export default class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'customer_id', nullable: true })
  customerId: number

  @Column({ name: 'customer_name', type: 'varchar', length: '100', nullable: true })
  customerName: string

  @Column({ name: 'total_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalAmount: number

  @Column({ name: 'total_quantity', type: 'int', default: 0 })
  totalQuantity: number


  @CreateDateColumn({ name: 'order_date', type: 'timestamp' })
  orderDate: Date

  @Column({ name: 'status', type: 'enum', enum: OrderStatus, default: OrderStatus.DRAFT })
  status: OrderStatus

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus


  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date


  @OneToMany(() => Invoice, (invoice) => invoice.order)
  invoices: Invoice[]



}
