console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../model/paymentModel");
const Course = require("../model/courseModel");
const User = require("../model/userModel");


// stripe checkout
exports.createCheckoutSession = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userEmail = req.payload; // from jwtMiddleware

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json("Course not found");
        }

        // create stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: userEmail,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.title,
                        },
                        unit_amount: course.price * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:5173/user/payment-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/user/payment-cancel",
        });

        // save payment as pending
        await Payment.create({
            userEmail,
            courseId,
            amount: course.price,
            stripeSessionId: session.id,
            status: "pending",
        });



        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error(err);
        res.status(500).json("Payment initiation failed");
    }
};

// to display purchased courses
exports.getMyCourses = async (req, res) => {
    try {
        const userEmail = req.payload;

        const payments = await Payment.find({
            userEmail,
            status: "paid",
        }).populate("courseId");

        const courses = payments.map((p) => p.courseId);

        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to fetch my courses");
    }
};


// to confirm the payment
exports.confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    console.log("SESSION ID:", session_id);

    if (!session_id) {
      return res.status(400).json("Session ID missing");
    }

    const payment = await Payment.findOne({
      stripeSessionId: session_id,
    });

    console.log("PAYMENT FOUND:", payment);

    if (!payment) {
      return res.status(404).json("Payment not found");
    }

    if (payment.status === "paid") {
      return res.status(200).json("Already confirmed");
    }

    payment.status = "paid";
    await payment.save();

    const user = await User.findOne({ email: payment.userEmail });

    console.log("USER FOUND:", user?.email);

    if (!user) {
      return res.status(404).json("User not found");
    }

    if (!Array.isArray(user.purchasedCourses)) {
      user.purchasedCourses = [];
    }

    const alreadyPurchased = user.purchasedCourses.some(
      (c) => c.toString() === payment.courseId.toString()
    );

    if (!alreadyPurchased) {
      user.purchasedCourses.push(payment.courseId);
      await user.save();
    }

    res.status(200).json("Payment confirmed");
  } catch (err) {
    console.error(" CONFIRM PAYMENT ERROR:", err);
    res.status(500).json("Payment confirmation failed");
  }
};






