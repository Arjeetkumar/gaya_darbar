import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  initializeDatabase,
  getMenu,
  getDeliveryBoys,
  getOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder
} from './database.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local in parent folder
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
initializeDatabase()
  .then(() => console.log('SQLite database initialized successfully.'))
  .catch(err => console.error('Failed to initialize database:', err));

// Initialize Gemini AI client if key exists and isn't placeholder
const apiKey = process.env.GEMINI_API_KEY;
const isApiKeyValid = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' && apiKey.trim() !== '';
let ai = null;

if (isApiKeyValid) {
  ai = new GoogleGenAI({ apiKey });
  console.log('Gemini AI client configured successfully on backend.');
} else {
  console.warn('WARNING: Gemini API Key is missing or using PLACEHOLDER_API_KEY. AI Chef will run in fallback simulation mode.');
}

// API Endpoints

// Get Menu Items
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await getMenu();
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to retrieve menu items.' });
  }
});

// Get Delivery Personnel Status
app.get('/api/delivery', async (req, res) => {
  try {
    const boys = await getDeliveryBoys();
    res.json(boys);
  } catch (error) {
    console.error('Error fetching delivery personnel:', error);
    res.status(500).json({ error: 'Failed to retrieve delivery data.' });
  }
});

// Get Live Orders Queue
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// Create Order (Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const orderId = await createOrder(req.body);
    res.status(201).json({ success: true, orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to process and place order.' });
  }
});

// Update Order Status (Preparing, Out for Delivery, etc.)
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Cancel or delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await cancelOrder(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});

// Gemini AI Recommendation Safe Proxy
app.post('/api/recommend', async (req, res) => {
  const { moodOrGoal, intensity } = req.body;
  if (!moodOrGoal) {
    return res.status(400).json({ error: 'moodOrGoal prompt is required.' });
  }

  // Fallback if AI client isn't loaded
  if (!ai) {
    return res.json({
      recommendation: "Our signature Grilled Butter Chicken (Greek-yogurt makhani) is recommended for your training program. High protein (52g) and minimal fats support optimal muscle tissue recovery."
    });
  }

  try {
    const MENU_ITEMS = await getMenu();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class Fitness Nutritionist at "GAYA DARBAR IRON & FUEL HOUSE". 
      The customer's current feeling or goal is: "${moodOrGoal}". 
      THEIR TRAINING INTENSITY TODAY: "${intensity || 'Rest Day'}".
      Based on our high-protein, macro-calculated menu: ${JSON.stringify(MENU_ITEMS)}, 
      recommend exactly 1 dish from the menu, state its key macros (Protein as P, Carbs as C, Fat as F), and explain why it supports their fitness goal given their specific intensity today (e.g., higher carbs for Heavy Lifting, leaner protein for Rest Day). 
      Keep the tone encouraging, professional, and Appetizing. Max 65 words.`,
      config: {
        temperature: 0.7,
      },
    });

    res.json({ recommendation: response.text || "Fuel your gains with our Brown Rice Mutton Biryani - 45g Protein for peak recovery." });
  } catch (error) {
    console.error('Gemini Recommendation Service Error:', error);
    res.json({
      recommendation: "Fuel your gains with our Brown Rice Mutton Biryani - 45g Protein and complex carbs for peak recovery."
    });
  }
});

// Serve React frontend in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all: send index.html for any non-API route (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
