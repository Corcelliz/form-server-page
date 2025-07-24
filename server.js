// server.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "mensagens.json");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Utilitário: lê dados salvos
function lerMensagens() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH, "utf8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Utilitário: salva mensagens no JSON
function salvarMensagens(mensagens) {
  fs.writeFileSync(DB_PATH, JSON.stringify(mensagens, null, 2));
}

// POST: recebe e armazena nova mensagem
app.post("/enviar", (req, res) => {
  const { nome, email, mensagem } = req.body;
  const mensagens = lerMensagens();

  mensagens.push({
    nome,
    email,
    mensagem,
    data: new Date().toLocaleString(),
  });

  salvarMensagens(mensagens);

  res.send(`
    <h2 style="color:green;text-align:center;">Mensagem recebida com sucesso!</h2>
    <p style="text-align:center;"><a href='/mensagens'>&larr; Ver mensagens</a></p>
  `);
});

// GET: exibe todas as mensagens salvas
app.get("/", (req, res) => {
  const mensagens = lerMensagens();

  if (mensagens.length === 0) {
    return res.send(
      '<h2 style="text-align:center;">Nenhuma mensagem recebida ainda.</h2>'
    );
  }

  let html = `
    <h2 style="text-align:center;">Mensagens Recebidas</h2>
    <ul style="max-width:600px;margin:auto;">`;

  mensagens.forEach((msg, index) => {
    html += `
      <li style="background:#f0f0f0;color:#333;padding:1rem;margin:1rem 0;border-radius:10px;">
        <strong>#${index + 1} - ${msg.nome}</strong> <em>(${msg.email})</em><br>
        <small>Enviado em: ${msg.data}</small>
        <p>${msg.mensagem}</p>
      </li>`;
  });

  html += `</ul><div style="text-align:center;"><a href="/">← Voltar ao formulário</a></div>`;

  res.send(html);
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
