require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Vérifier si la clé Stripe est bien chargée
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ ERREUR : Clé Stripe non définie !");
  process.exit(1);
}

// Vérifier si MongoDB URI est bien chargé
if (!process.env.MONGO_URI) {
  console.error("❌ ERREUR : URI MongoDB non définie !");
  process.exit(1);
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => {
    console.error("❌ Erreur MongoDB", err);
    process.exit(1);
  });

// Routes API des commandes
app.use("/api/orders", require("./routes/orderRoutes"));

// **Route Stripe : Création d'un paiement**
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide." });
    }

    console.log(`🔹 Demande de paiement reçue : ${amount}€`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convertir en centimes
      currency: "eur",
      payment_method_types: ["card"], // Seules les cartes sont autorisées
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Erreur Stripe :", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
