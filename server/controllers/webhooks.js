import { Webhook } from 'svix'
import User from '../models/User.js'
import Stripe from 'stripe'
import { Purchase } from '../models/Purchase.js'
import Course from '../models/Course.js'

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    const evt = wh.verify(req.body, {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature']
    })

    const { data, type } = evt

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name} ${data.last_name==null?"":data.last_name  }`,
          imageUrl: data.image_url,
        }
        await User.create(userData)
        break
      }

      case 'user.updated': {
        const updatedData = {
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, updatedData)
        break
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        break
      }

      default:
        console.log('Unhandled event type:', type)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook Error:', error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}



const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (req, res) => {
  console.log("Stripe webhook hit"); // Add this

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      courseData.enrolledStudents.push(userData);
      await courseData.save();
      console.log(courseData);

      userData.enrolledCourses.push(courseData._id);
      await userData.save();
      

      purchaseData.status = 'completed';
      await purchaseData.save();
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = 'failed';
      await purchaseData.save();
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
