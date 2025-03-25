import mongoose, { Schema, Document } from "mongoose";

export type TransactionType = "onramp" | "offramp" | "transfer";

export interface ITransaction extends Document {
  type: TransactionType;
  from: mongoose.Types.ObjectId | string;
  to: mongoose.Types.ObjectId | string;
  amount: number;
  date: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  type: {
    type: String,
    enum: ["onramp", "offramp", "transfer"],
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  to: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

// Add indexes for better query performance
TransactionSchema.index({ from: 1 });
TransactionSchema.index({ to: 1 });
TransactionSchema.index({ date: -1 }); // Descending for newest first

const TransactionModel =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;
