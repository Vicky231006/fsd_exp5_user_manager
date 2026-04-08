const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
    hobbies: [String],
    bio: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Required Indexes
UserSchema.index({ name: 1 }); // Single field
UserSchema.index({ email: 1, age: -1 }); // Compound
UserSchema.index({ hobbies: 1 }); // Multikey
UserSchema.index({ bio: 'text' }); // Text
UserSchema.index({ userId: 'hashed' }); // Hashed
UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // TTL

module.exports = mongoose.model('User', UserSchema);