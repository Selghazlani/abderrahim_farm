const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const ordersPath = path.join(__dirname, "../orders.txt");
const jsonPath = path.join(__dirname, "../orders.json");
const csvPath = path.join(__dirname, "../orders.csv");

let orders = [];

if (fs.existsSync(jsonPath)) {
  orders = fs.readJSONSync(jsonPath);
}

app.post("/api/order", (req, res) => {
  const order = req.body;
  const timestamp = new Date().toLocaleString("fr-MA");

  const logText = `
[${timestamp}]
Nom: ${order.firstName} ${order.lastName}
Téléphone: ${order.phone}
Ville: ${order.city}
Adresse: ${order.address}
Commande:
${order.panier.map(p => `- ${p.nom}: ${p.qty} x ${p.prix} = ${p.qty * p.prix} DH`).join("\n")}
==============================\n`;

  fs.appendFileSync(ordersPath, logText);

  // Enregistre en JSON
  order.timestamp = timestamp;
  orders.push(order);
  fs.writeJSONSync(jsonPath, orders);

  // Enregistre aussi en CSV
  const rows = order.panier.map(p => ({
    Nom: order.firstName + " " + order.lastName,
    Téléphone: order.phone,
    Ville: order.city,
    Adresse: order.address,
    Produit: p.nom,
    Quantité: p.qty,
    Prix_unitaire: p.prix,
    Total: p.qty * p.prix,
    Date: timestamp,
  }));

  const csvHeader = [
    "Nom",
    "Téléphone",
    "Ville",
    "Adresse",
    "Produit",
    "Quantité",
    "Prix_unitaire",
    "Total",
    "Date",
  ];

  const alreadyExists = fs.existsSync(csvPath);
  const csvLine = rows.map(row => csvHeader.map(h => row[h]).join(",")).join("\n");
  if (!alreadyExists) fs.writeFileSync(csvPath, csvHeader.join(",") + "\n");
  fs.appendFileSync(csvPath, csvLine + "\n");

  console.log("✅ Commande enregistrée dans TXT, JSON et CSV");
  res.status(200).send("OK");
});

app.get("/api/all-orders", (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});

