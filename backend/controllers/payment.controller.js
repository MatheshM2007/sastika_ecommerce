const pool = require('../config/db');
const { verifyPaymentSignature } = require('../services/razorpay');

const verifyPayment = async (req, res) => {
  const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const valid = verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!valid) {
    await pool.query(
      `UPDATE orders SET payment_status = 'failed' WHERE id = $1 AND user_id = $2`,
      [order_id, req.user.id]
    );
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  const { rows } = await pool.query(
    `UPDATE orders SET
      payment_status = 'paid',
      razorpay_payment_id = $1,
      status = 'Order Placed'
     WHERE id = $2 AND user_id = $3 AND razorpay_order_id = $4
     RETURNING *`,
    [razorpay_payment_id, order_id, req.user.id, razorpay_order_id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, message: 'Payment verified', data: { order: rows[0] } });
};

module.exports = { verifyPayment };
