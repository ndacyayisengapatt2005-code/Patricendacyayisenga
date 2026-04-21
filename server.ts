import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Wildlife Data API
  app.get("/api/wildlife", (req, res) => {
    // This would eventually fetch from a DB
    res.json([
      { id: '1', name: 'Mountain Gorilla', species: 'Gorilla beringei beringei', habitat: 'Volcanoes National Park', status: 'Endangered' },
      { id: '2', name: 'Golden Monkey', species: 'Cercopithecus kandti', habitat: 'Volcanoes National Park', status: 'Endangered' },
      { id: '3', name: 'African Elephant', species: 'Loxodonta africana', habitat: 'Akagera National Park', status: 'Vulnerable' },
      { id: '4', name: 'Chimpanzee', species: 'Pan troglodytes', habitat: 'Nyungwe Forest National Park', status: 'Endangered' },
    ]);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ecotrackr Server running on http://localhost:${PORT}`);
  });
}

startServer();
