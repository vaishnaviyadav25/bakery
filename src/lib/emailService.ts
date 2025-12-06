import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  orderId: string,
  products: Array<{ name: string; price: number; quantity: number }>,
  totalAmount: number,
  paymentMethod: string,
  address: string
) => {
  const productList = products
    .map(product => `${product.name} - ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`)
    .join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Order Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for your order! Here are the details:</p>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Delivery Address:</strong> ${address}</p>

          <h4>Products:</h4>
          <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${productList}</pre>

          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        </div>

        <p>We will process your order soon. You can track your order status in your account.</p>
        <p>If you have any questions, please contact us.</p>

        <p>Best regards,<br>Meet Bakery Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
