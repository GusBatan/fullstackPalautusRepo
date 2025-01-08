const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    minlength: 8,
    maxlength: 12,
    required: true,
    validate: {
      validator: function (val) {
        return /^(\d{2,3})-(\d{6,7})/.test(val);
      },
    },
  },
  id: Number,
});

module.exports = mongoose.model('Person', personSchema);
