document
  .getElementById("formulario")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    const resposta = document.getElementById("resposta");

    try {
      const res = await fetch("/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(
          email
        )}&mensagem=${encodeURIComponent(mensagem)}`,
      });

      if (res.ok) {
        resposta.innerHTML = `<span style="color:lightgreen;">Mensagem enviada com sucesso!</span>`;
        document.getElementById("formulario").reset();
      } else {
        resposta.innerHTML = `<span style="color:red;">Erro ao enviar mensagem.</span>`;
      }
    } catch (error) {
      resposta.innerHTML = `<span style="color:red;">Falha na conexão com o servidor.</span>`;
    }
  });
