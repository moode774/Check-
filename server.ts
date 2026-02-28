import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("sakanyemen.db");
const JWT_SECRET = process.env.JWT_SECRET || "sakan-yemen-secret-2026";

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'owner', 'tenant', 'agent')) NOT NULL,
    phone TEXT,
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    agent_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('apartment', 'house', 'shop', 'office', 'villa', 'land')),
    price REAL NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    area REAL,
    rooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    features TEXT, -- JSON string
    images TEXT, -- JSON string
    status TEXT CHECK(status IN ('available', 'rented', 'reserved')) DEFAULT 'available',
    lat REAL,
    lng REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id),
    FOREIGN KEY(agent_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    tenant_id INTEGER,
    owner_id INTEGER,
    agent_id INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent REAL NOT NULL,
    deposit REAL,
    status TEXT CHECK(status IN ('pending', 'active', 'expired', 'terminated')) DEFAULT 'pending',
    owner_signed INTEGER DEFAULT 0,
    tenant_signed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(property_id) REFERENCES properties(id),
    FOREIGN KEY(tenant_id) REFERENCES users(id),
    FOREIGN KEY(owner_id) REFERENCES users(id),
    FOREIGN KEY(agent_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id INTEGER,
    amount REAL NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    method TEXT,
    status TEXT CHECK(status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    receipt_url TEXT,
    FOREIGN KEY(contract_id) REFERENCES contracts(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    reviewer_id INTEGER,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(property_id) REFERENCES properties(id),
    FOREIGN KEY(reviewer_id) REFERENCES users(id)
  );
`);

// Seed Data
const seedData = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
  if (userCount.count === 0) {
    // ... (existing seed logic)
  }

  // Update existing properties to use local images if they are still using Unsplash
  const updateImages = () => {
    const properties = db.prepare("SELECT id, title, images FROM properties").all() as any[];
    const updateStmt = db.prepare("UPDATE properties SET images = ? WHERE id = ?");

    properties.forEach(p => {
      const images = JSON.parse(p.images);
      let updated = false;
      const newImages = images.map((img: string) => {
        if (img.includes("unsplash.com")) {
          updated = true;
          if (p.title.includes("حدة")) return "/images/luxury_apartment_sanaa.png";
          if (p.title.includes("الأصبحي")) return "/images/modern_villa_garden.png";
          if (p.title.includes("الستين")) return "/images/commercial_office_space.png";
          return "/images/luxury_apartment_sanaa.png";
        }
        return img;
      });

      if (updated) {
        updateStmt.run(JSON.stringify(newImages), p.id);
      }
    });

    // Also check if we need to add the missing 3 properties if there are only 3
    const propCount = db.prepare("SELECT COUNT(*) as count FROM properties").get() as any;
    if (propCount.count === 3) {
      const extraProperties = [
        {
          title: "منزل تقليدي في صنعاء القديمة",
          description: "منزل أثري تم ترميمه بعناية ليجمع بين عبق التاريخ ووسائل الراحة الحديثة. تجربة فريدة للسكن.",
          type: "house",
          price: 180000,
          city: "صنعاء",
          district: "صنعاء القديمة",
          area: 200,
          rooms: 4,
          bathrooms: 3,
          floor: 4,
          features: ["تاريخي", "ترميم حديث", "إطلالة بانورامية"],
          images: ["/images/traditional_house_old_sanaa.png"]
        },
        {
          title: "شقة عصرية مع مطبخ مجهز",
          description: "شقة تتميز بتصميم داخلي أنيق ومطبخ عصري مجهز بالكامل بأحدث الأجهزة.",
          type: "apartment",
          price: 120000,
          city: "صنعاء",
          district: "بيت بوس",
          area: 110,
          rooms: 2,
          bathrooms: 2,
          floor: 2,
          features: ["مطبخ مجهز", "بناء حديث", "قريب من المولات"],
          images: ["/images/modern_kitchen_apartment.png"]
        },
        {
          title: "جناح نوم فاخر في فيلا بالروضة",
          description: "غرفة نوم رئيسية واسعة مع حمام خاص وتصميمات داخلية فاخرة تضمن الراحة والسكينة.",
          type: "villa",
          price: 300000,
          city: "صنعاء",
          district: "الروضة",
          area: 250,
          rooms: 4,
          bathrooms: 3,
          floor: 1,
          features: ["هدوء", "تصميم فاخر", "حراسة"],
          images: ["/images/luxury_bedroom_villa_yemen.png"]
        }
      ];

      const insertStmt = db.prepare(`
        INSERT INTO properties (owner_id, title, description, type, price, city, district, area, rooms, bathrooms, floor, features, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const ownerId = 2; // Assuming owner 2 still exists
      extraProperties.forEach(p => {
        insertStmt.run(ownerId, p.title, p.description, p.type, p.price, p.city, p.district, p.area, p.rooms, p.bathrooms, p.floor, JSON.stringify(p.features), JSON.stringify(p.images));
      });
    }
  };

  updateImages();
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/images", express.static(path.join(__dirname, "public/images")));

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, role, phone } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const stmt = db.prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(name, email, hashedPassword, role, phone);
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  });

  // Properties
  app.get("/api/properties", (req, res) => {
    const { city, type, minPrice, maxPrice } = req.query;
    let query = "SELECT * FROM properties WHERE status = 'available'";
    const params: any[] = [];

    if (city) { query += " AND city = ?"; params.push(city); }
    if (type) { query += " AND type = ?"; params.push(type); }
    if (minPrice) { query += " AND price >= ?"; params.push(minPrice); }
    if (maxPrice) { query += " AND price <= ?"; params.push(maxPrice); }

    const properties = db.prepare(query).all(...params).map((p: any) => ({
      ...p,
      features: JSON.parse(p.features || '[]'),
      images: JSON.parse(p.images || '[]'),
      verified: !!p.verified
    }));
    res.json(properties);
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id) as any;
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json({
      ...property,
      features: JSON.parse(property.features || '[]'),
      images: JSON.parse(property.images || '[]'),
    });
  });

  app.post("/api/properties", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'owner' && req.user.role !== 'agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { title, description, type, price, city, district, area, rooms, bathrooms, floor, features, images, lat, lng } = req.body;
    const stmt = db.prepare(`
      INSERT INTO properties (owner_id, agent_id, title, description, type, price, city, district, area, rooms, bathrooms, floor, features, images, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const owner_id = req.user.role === 'owner' ? req.user.id : null;
    const agent_id = req.user.role === 'agent' ? req.user.id : null;

    const result = stmt.run(
      owner_id, agent_id, title, description, type, price, city, district, area, rooms, bathrooms, floor,
      JSON.stringify(features), JSON.stringify(images), lat, lng
    );
    res.json({ id: result.lastInsertRowid });
  });

  // Contracts
  app.post("/api/contracts", authenticateToken, (req: any, res) => {
    const { property_id, start_date, end_date, monthly_rent, deposit } = req.body;
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(property_id) as any;
    if (!property) return res.status(404).json({ error: "Property not found" });

    const stmt = db.prepare(`
      INSERT INTO contracts (property_id, tenant_id, owner_id, agent_id, start_date, end_date, monthly_rent, deposit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(property_id, req.user.id, property.owner_id, property.agent_id, start_date, end_date, monthly_rent, deposit);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/my-contracts", authenticateToken, (req: any, res) => {
    let query = "";
    if (req.user.role === 'tenant') query = "SELECT * FROM contracts WHERE tenant_id = ?";
    else if (req.user.role === 'owner') query = "SELECT * FROM contracts WHERE owner_id = ?";
    else if (req.user.role === 'agent') query = "SELECT * FROM contracts WHERE agent_id = ?";
    else query = "SELECT * FROM contracts";

    const contracts = db.prepare(query).all(req.user.id);
    res.json(contracts);
  });

  // Payments
  app.post("/api/payments", authenticateToken, (req: any, res) => {
    const { contract_id, amount, method } = req.body;
    const stmt = db.prepare("INSERT INTO payments (contract_id, amount, method, status) VALUES (?, ?, ?, 'paid')");
    const result = stmt.run(contract_id, amount, method);
    res.json({ id: result.lastInsertRowid });
  });

  // AI Smart Tips
  app.get("/api/ai/tips", authenticateToken, async (req: any, res) => {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "أعطني نصيحة عقارية واحدة قصيرة ومفيدة للملاك في اليمن باللغة العربية. اجعلها احترافية.",
      });
      res.json({ tip: response.text });
    } catch (e) {
      res.json({ tip: "العقارات في حي حدة تشهد طلباً متزايداً بنسبة 15% هذا الشهر. فكر في تحديث أسعارك." });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
