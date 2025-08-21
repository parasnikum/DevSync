const ContactMessage = require("../models/ContactMessage");

const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contactMessage = new ContactMessage({ name, email, message });
    await contactMessage.save();
    res.status(201).json({
      message:
        "We have receieved your message and we will get back to you soon.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { submitContactForm };
