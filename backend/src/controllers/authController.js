require("dotenv").config();

const login = (req, res) => {
  const { email, password } = req.body;

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (email === validEmail && password === validPassword) {
    // TODO: En el futuro implementar JWT real
    return res.json({
      success: true,
      token: "token_secreto_backend_12345",
      user: { name: "Admin", email: validEmail },
    });
  }

  return res.status(401).json({
    success: false,
    error: "Credenciales inválidas",
  });
};

module.exports = { login };
