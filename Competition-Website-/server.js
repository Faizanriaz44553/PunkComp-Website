// server.js

// Required dependencies
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

// Initialize Stripe with secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Handle JSON payloads

// Payment Intent route
app.post('/api/create-checkout-session', async (req, res) => {
    const { Title, Description, Amount, Image } = req.body;

    try {
        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Amount * 100, // Convert amount to cents
            currency: 'gbp', // Set currency (e.g., USD)
            description: `${Title} - ${Description}`,
            metadata: { 
                title: Title,
                image: Image
            }
        });

        // Send clientSecret to the frontend
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

