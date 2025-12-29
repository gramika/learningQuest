const Contact = require("../model/contactModel");

// user sends message
exports.sendMessage = async (req, res) => {
  try {
    console.log("CONTACT BODY:", req.body); // 🔥 ADD THIS

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json("All fields required");
    }

    await Contact.create({ name, email, message });

    res.status(200).json("Message sent successfully");
  } catch (err) {
    console.error("CONTACT ERROR:", err); // 🔥 ADD THIS
    res.status(500).json("Failed to send message");
  }
};


// admin gets all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json("Failed to fetch messages");
  }
};

// admin deletes message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json("Message deleted");
  } catch (err) {
    res.status(500).json("Delete failed");
  }
};
