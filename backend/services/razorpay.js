const Razorpay = require('razorpay');
const crypto = require('crypto');

let instance = null;

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
};

const createRazorpayOrder = async (amountInRupees, receipt) => {
  const razorpay = getRazorpay();
  if (!razorpay) {
    const err = new Error('Razorpay is not configured');
    err.statusCode = 503;
    throw err;
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    receipt: String(receipt),
  });

  return order;
};

const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
};

module.exports = { getRazorpay, createRazorpayOrder, verifyPaymentSignature };
