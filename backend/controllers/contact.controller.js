const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message);
  res.status(200).json({
    message: "We have received your message and we will get back to you soon.",
  });
};

module.exports = { submitContactForm };
