import mongoose from 'mongoose';

export interface IOrder {
  _id?: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
  }>;
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed';
    paymentId?: string;
    amount: number;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  review?: {
    rating: number;
    comment: string;
    date: Date;
  };
  message?: string;
}

const OrderSchema = new mongoose.Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  products: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: [{ type: String }],
  }],
  payment: {
    method: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date },
  },
  message: { type: String },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
