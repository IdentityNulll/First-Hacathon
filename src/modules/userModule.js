const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number],
  }, // [lon, lat]
});

const PaymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["card", "bank_transfer", "crypto", "other"],
      required: true,
    },
    label: String,
    token: String, // tokenized reference from payment provider
    last4: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["passport", "id", "utility_bill", "other"] },
    url: String,
    uploadedAt: Date,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { _id: true }
);

const PassportSchema = new mongoose.Schema(
  {
    country: String,
    series: String,
    number: String,
    issueDate: Date,
    expiryDate: Date,
    scanUrl: String,
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ["male", "female", "other", "unspecified"],
    default: "unspecified",
  },
  email: { type: String, required: true, index: true, unique: true },
  password: {type: String,}, 
  phone: String,
  avatar: { url: String, thumbUrl: String, storageProvider: String },
  passport: PassportSchema,
  billing: {
    companyName: String,
    taxId: String,
    billingAddress: AddressSchema,
    paymentMethods: [PaymentMethodSchema],
  },
  address: AddressSchema,
  ipAddresses: [
    { ip: String, firstSeen: Date, lastSeen: Date, device: String },
  ],
  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  documents: [DocumentSchema],
  roles: [String],
  preferences: mongoose.Schema.Types.Mixed,
  consents: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  deletedAt: Date,
});

// Indexes for geo and passport number (if needed hashed)
ProfileSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("Profile", ProfileSchema);