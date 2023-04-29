const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    publishAt: { type: String, required: true },
    image: { type: String },
    userId: { type: String }
});

const News = mongoose.model("news", newsSchema);

module.exports = { News };
