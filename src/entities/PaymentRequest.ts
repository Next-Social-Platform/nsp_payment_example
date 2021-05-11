import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Invoice from './Invoice'

@Entity("payment_request")
export default class PaymentRequest {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'json', nullable: true })
    payload: any
    
    @ManyToOne(() => Invoice, (invoice) => invoice.requests)
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice

    @Column()
    reqId: string // payment request message socialpay, qpay
    
    @Column()
    type: string // payment request message socialpay, qpay
    
    @Column({type: 'text', nullable: true})
    qr: string // payment request message
    
    @Column({type: 'text', nullable: true})
    deeplink: string // payment request message
    
    @Column({type: 'text', nullable: true})
    code: string // payment request message
    

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date
}
