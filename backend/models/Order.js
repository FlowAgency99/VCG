const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  cards: [
    {
      cardName: { type: String, required: true },
      language: { type: String, required: true },
      declaredValue: { type: Number, required: true },
      cardId: { type: String, required: true }
    }
  ],
  insurance: { type: Boolean, default: false },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "processing", "completed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
