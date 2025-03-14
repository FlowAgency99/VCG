const Order = require("../models/Order");

// Ajouter une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la commande", error });
  }
};

// Obtenir toutes les commandes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
  }
};

// Obtenir une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la commande", error });
  }
};

// Mettre à jour une commande
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: "Commande non trouvée" });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la commande", error });
  }
};

// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Commande non trouvée" });
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la commande", error });
  }
};
