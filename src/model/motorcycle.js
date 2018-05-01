'use strict';

import mongoose from 'mongoose'; // ES6
// const mongoose = require('mongoose'); // Common JS

const motorcycleSchema = mongoose.Schema({
  model: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    unique: true,
  },
});

// Vinicio Mongoose wants to create a model out of a Schema
export default mongoose.model('motorcycle', motorcycleSchema);
