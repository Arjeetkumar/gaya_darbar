import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'restaurant.db');
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath);

// Helper to run query with promise
const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Helper to get all records with promise
const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Helper to get single record with promise
const getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize database schema
export const initializeDatabase = async () => {
  db.serialize(() => {
    // Menu items table
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      calories INTEGER,
      protein REAL,
      carbs REAL,
      fats REAL,
      rating REAL,
      fuelPoints INTEGER,
      dietType TEXT
    )`);

    // Delivery Boys table
    db.run(`CREATE TABLE IF NOT EXISTS delivery_boys (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      status TEXT NOT NULL,
      phone TEXT NOT NULL
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      total REAL NOT NULL,
      totalProtein REAL NOT NULL,
      totalCarbs REAL NOT NULL,
      totalFats REAL NOT NULL,
      totalCalories INTEGER NOT NULL,
      status TEXT NOT NULL,
      paymentStatus TEXT NOT NULL,
      paymentId TEXT,
      deliveryType TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      address TEXT,
      flatInfo TEXT,
      landmark TEXT,
      lat REAL,
      lng REAL,
      deliveryPersonId TEXT,
      specialInstructions TEXT,
      estimatedDeliveryTime TEXT
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      itemId TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fats REAL NOT NULL,
      image TEXT NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )`);

    // Check and seed menu items
    db.get("SELECT COUNT(*) as count FROM menu_items", (err, row) => {
      if (row && row.count === 0) {
        console.log("Seeding menu items...");
        const MENU_ITEMS = [
          {
            id: 'f1',
            name: 'Brown Rice Mutton Dum Biryani',
            description: 'Lean mutton pieces slow-cooked with high-fiber brown basmati rice. High protein, complex carbs.',
            price: 495,
            category: 'Mass Gain',
            image: '/images/mutton_dum_biryani.png',
            calories: 620,
            macros: { p: 45, c: 65, f: 12 },
            rating: 4.9,
            fuelPoints: 49,
            dietType: 'non-veg'
          },
          {
            id: 'f2',
            name: 'Grilled Butter Chicken (No Cream)',
            description: 'Charcoal-grilled chicken breast in a Greek yogurt-based makhani gravy. Zero added sugar.',
            price: 380,
            category: 'Lean Shred',
            image: '/images/grilled_butter_chicken.png',
            calories: 340,
            macros: { p: 52, c: 8, f: 10 },
            rating: 4.8,
            fuelPoints: 38,
            dietType: 'non-veg'
          },
          {
            id: 'f3',
            name: 'Keto Paneer Lababdar',
            description: 'Fresh paneer in a heavy cream and cashew-free gravy using almond paste. Perfect for Keto.',
            price: 320,
            category: 'Clean Keto',
            image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
            calories: 410,
            macros: { p: 22, c: 6, f: 32 },
            rating: 4.7,
            fuelPoints: 32,
            dietType: 'veg'
          },
          {
            id: 'f5',
            name: 'Nitro Pre-Workout Pasta',
            description: 'Whole wheat fusilli with a beetroot-pesto sauce (nitrates for pump) and grilled chicken.',
            price: 390,
            category: 'Pre-Workout Fuel',
            image: '/images/nitro_workout_pasta.png',
            calories: 450,
            macros: { p: 30, c: 55, f: 8 },
            rating: 5.0,
            fuelPoints: 39,
            dietType: 'non-veg'
          },
          {
            id: 'f6',
            name: 'Lean Chicken Steak & Broccoli',
            description: '250g Chicken breast steak with steamed broccoli mash and zero-calorie pepper jus.',
            price: 420,
            category: 'Lean Shred',
            image: '/images/chicken_steak_broccoli.png',
            calories: 310,
            macros: { p: 58, c: 4, f: 6 },
            rating: 4.9,
            fuelPoints: 42,
            dietType: 'non-veg'
          },
          {
            id: 'f9',
            name: 'Zucchini Ribbon Hakka Noodles',
            description: 'Low-carb zucchini spiralized "noodles" tossed with lean chicken breast and bell peppers.',
            price: 290,
            category: 'Clean Keto',
            image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
            calories: 195,
            macros: { p: 32, c: 5, f: 7 },
            rating: 4.8,
            fuelPoints: 29,
            dietType: 'non-veg'
          },
          {
            id: 'f13',
            name: 'Grilled Sole Lemon-Mughlai',
            description: 'River Sole fillets in a tangy lemon and mustard infusion. Extremely lean and rich in Omega-3.',
            price: 520,
            category: 'Lean Shred',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
            calories: 240,
            macros: { p: 48, c: 2, f: 5 },
            rating: 5.0,
            fuelPoints: 52,
            dietType: 'non-veg'
          },
          {
            id: 'f14',
            name: 'Vegan Gains Szechuan Bowl',
            description: 'Sprouted moong beans, smoked tofu, and edamame tossed in fiery sugar-free Szechuan sauce.',
            price: 340,
            category: 'Lean Shred',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
            calories: 280,
            macros: { p: 28, c: 32, f: 6 },
            rating: 4.8,
            fuelPoints: 34,
            dietType: 'vegan'
          },
          {
            id: 'f15',
            name: 'Spiced Quinoa Tikka Bowl',
            description: 'High-protein Paneer Tikkas served over cumin-infused quinoa and fresh garden salad.',
            price: 360,
            category: 'Mass Gain',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
            calories: 420,
            macros: { p: 26, c: 48, f: 14 },
            rating: 4.7,
            fuelPoints: 36,
            dietType: 'veg'
          },
          {
            id: 'f16',
            name: 'Whey Recovery Muffins',
            description: 'Box of 2 muffins made with chocolate whey, almond flour, and organic blueberries.',
            price: 195,
            category: 'Healthy Desserts',
            image: '/images/whey_recovery_muffins.png',
            calories: 220,
            macros: { p: 20, c: 14, f: 8 },
            rating: 4.9,
            fuelPoints: 19,
            dietType: 'veg'
          },
          {
            id: 'f17',
            name: 'Tandoori Salmon Steak',
            description: 'Fresh salmon fillet marinated in red spices and yogurt, slow-grilled in tandoor. High Omega-3.',
            price: 590,
            category: 'Lean Shred',
            image: '/images/tandoori_salmon_steak.png',
            calories: 380,
            macros: { p: 42, c: 4, f: 22 },
            rating: 5.0,
            fuelPoints: 59,
            dietType: 'non-veg'
          },
          {
            id: 'f18',
            name: 'Garlic Herb Chicken Tikka',
            description: 'Charcoal-grilled chicken breast chunks marinated in fresh garlic paste, coriander and mint. Zero carbs.',
            price: 350,
            category: 'Clean Keto',
            image: '/images/garlic_chicken_tikka.png',
            calories: 290,
            macros: { p: 38, c: 3, f: 12 },
            rating: 4.8,
            fuelPoints: 35,
            dietType: 'non-veg'
          },
          {
            id: 'f19',
            name: 'High Protein Soya Keema Bowl',
            description: 'Minced soya granules cooked with spices, served with fresh cucumbers and brown rice.',
            price: 280,
            category: 'Mass Gain',
            image: '/images/soya_keema_bowl.png',
            calories: 320,
            macros: { p: 30, c: 25, f: 8 },
            rating: 4.7,
            fuelPoints: 28,
            dietType: 'veg'
          },
          {
            id: 'f20',
            name: 'Sugar-Free Oats & Dates Halwa',
            description: 'Fiber-rich oats and organic dates pudding sweetened naturally, topped with roasted pistachios.',
            price: 180,
            category: 'Healthy Desserts',
            image: '/images/oats_dates_halwa.png',
            calories: 210,
            macros: { p: 8, c: 35, f: 5 },
            rating: 4.9,
            fuelPoints: 18,
            dietType: 'veg'
          },
          {
            id: 'mp1',
            name: 'Weekly Shred Pack (7 Meals)',
            description: 'Curated batch of 7 high-protein, low-carb performance meals designed for fat loss.',
            price: 2450,
            category: 'Meal Prep Bundles',
            image: '/images/weekly_shred_pack.png',
            calories: 2100,
            macros: { p: 350, c: 80, f: 45 },
            rating: 5.0,
            fuelPoints: 245,
            dietType: 'vegan'
          },
          {
            id: 'mp2',
            name: 'Bulking Phase Bundle (5 Meals)',
            description: 'Curated batch of 5 high-calorie, high-carb muscle fuel meals to power heavy training.',
            price: 1850,
            category: 'Meal Prep Bundles',
            image: '/images/bulking_phase_bundle.png',
            calories: 3500,
            macros: { p: 250, c: 450, f: 70 },
            rating: 5.0,
            fuelPoints: 185,
            dietType: 'non-veg'
          }
        ];

        const stmt = db.prepare(`INSERT INTO menu_items (
          id, name, description, price, category, image, calories, protein, carbs, fats, rating, fuelPoints, dietType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        MENU_ITEMS.forEach(item => {
          stmt.run(
            item.id,
            item.name,
            item.description,
            item.price,
            item.category,
            item.image,
            item.calories,
            item.macros.p,
            item.macros.c,
            item.macros.f,
            item.rating,
            item.fuelPoints,
            item.dietType
          );
        });
        stmt.finalize();
      }
    });

    // Check and seed delivery boys
    db.get("SELECT COUNT(*) as count FROM delivery_boys", (err, row) => {
      if (row && row.count === 0) {
        console.log("Seeding delivery personnel...");
        const MOCK_DELIVERY_BOYS = [
          { id: 'd1', name: 'Rohan Sharma', lat: 25.5941, lng: 85.1376, status: 'busy', phone: '+91 91428 05071' },
          { id: 'd2', name: 'Amit Kumar', lat: 25.6122, lng: 85.1212, status: 'active', phone: '+91 99999 12345' },
          { id: 'd3', name: 'Suresh Das', lat: 25.6000, lng: 85.1500, status: 'active', phone: '+91 88888 54321' }
        ];

        const stmt = db.prepare(`INSERT INTO delivery_boys (
          id, name, lat, lng, status, phone
        ) VALUES (?, ?, ?, ?, ?, ?)`);

        MOCK_DELIVERY_BOYS.forEach(boy => {
          stmt.run(boy.id, boy.name, boy.lat, boy.lng, boy.status, boy.phone);
        });
        stmt.finalize();
      }
    });
  });
};

// Database functions
export const getMenu = async () => {
  const rows = await allAsync("SELECT * FROM menu_items");
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image,
    calories: row.calories,
    macros: { p: row.protein, c: row.carbs, f: row.fats },
    rating: row.rating,
    fuelPoints: row.fuelPoints,
    dietType: row.dietType
  }));
};

export const getDeliveryBoys = async () => {
  return allAsync("SELECT * FROM delivery_boys");
};

export const getOrders = async () => {
  const orders = await allAsync("SELECT * FROM orders ORDER BY timestamp DESC");
  const result = [];

  for (const order of orders) {
    const items = await allAsync("SELECT * FROM order_items WHERE orderId = ?", [order.id]);
    result.push({
      id: order.id,
      customerName: order.customerName,
      total: order.total,
      totalMacros: { p: order.totalProtein, c: order.totalCarbs, f: order.totalFats },
      totalCalories: order.totalCalories,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentId: order.paymentId,
      deliveryType: order.deliveryType,
      timestamp: new Date(order.timestamp),
      location: {
        address: order.address,
        flatInfo: order.flatInfo,
        landmark: order.landmark,
        lat: order.lat,
        lng: order.lng
      },
      deliveryPersonId: order.deliveryPersonId,
      specialInstructions: order.specialInstructions,
      estimatedDeliveryTime: order.estimatedDeliveryTime
    });
  }
  return result;
};

export const createOrder = async (orderData) => {
  const {
    customerName,
    items,
    total,
    totalMacros,
    totalCalories,
    deliveryType,
    location,
    specialInstructions
  } = orderData;

  const orderId = `O-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toISOString();
  
  // Pick an active or random delivery boy if available
  const deliveryBoys = await getDeliveryBoys();
  const availableBoys = deliveryBoys.filter(b => b.status === 'active');
  const assignedBoy = availableBoys.length > 0 
    ? availableBoys[Math.floor(Math.random() * availableBoys.length)] 
    : (deliveryBoys.length > 0 ? deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)] : null);

  const deliveryPersonId = assignedBoy ? assignedBoy.id : null;
  const estimatedDeliveryTime = '35 mins';

  // If a courier was assigned, set their status to busy in database
  if (deliveryPersonId) {
    await runAsync("UPDATE delivery_boys SET status = 'busy' WHERE id = ?", [deliveryPersonId]);
  }

  // Insert order
  await runAsync(`INSERT INTO orders (
    id, customerName, total, totalProtein, totalCarbs, totalFats, totalCalories, 
    status, paymentStatus, paymentId, deliveryType, timestamp, 
    address, flatInfo, landmark, lat, lng, deliveryPersonId, specialInstructions, estimatedDeliveryTime
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', 'Paid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    orderId,
    customerName,
    total,
    totalMacros.p,
    totalMacros.c,
    totalMacros.f,
    totalCalories,
    `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    deliveryType,
    timestamp,
    location.address || '',
    location.flatInfo || '',
    location.landmark || '',
    location.lat || 25.5941,
    location.lng || 85.1376,
    deliveryPersonId,
    specialInstructions || '',
    estimatedDeliveryTime
  ]);

  // Insert items
  for (const item of items) {
    await runAsync(`INSERT INTO order_items (
      orderId, itemId, name, price, quantity, calories, protein, carbs, fats, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      orderId,
      item.id,
      item.name,
      item.price,
      item.quantity,
      item.calories || 0,
      item.macros?.p || 0,
      item.macros?.c || 0,
      item.macros?.f || 0,
      item.image || ''
    ]);
  }

  return orderId;
};

export const updateOrderStatus = async (orderId, status) => {
  await runAsync("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
  
  // If order is delivered or cancelled, free up delivery boy
  if (status === 'Delivered' || status === 'Cancelled') {
    const order = await getAsync("SELECT deliveryPersonId FROM orders WHERE id = ?", [orderId]);
    if (order && order.deliveryPersonId) {
      await runAsync("UPDATE delivery_boys SET status = 'active' WHERE id = ?", [order.deliveryPersonId]);
    }
  }
};

export const cancelOrder = async (orderId) => {
  const order = await getAsync("SELECT deliveryPersonId FROM orders WHERE id = ?", [orderId]);
  if (order && order.deliveryPersonId) {
    await runAsync("UPDATE delivery_boys SET status = 'active' WHERE id = ?", [order.deliveryPersonId]);
  }
  await runAsync("DELETE FROM orders WHERE id = ?", [orderId]);
  await runAsync("DELETE FROM order_items WHERE orderId = ?", [orderId]);
};
