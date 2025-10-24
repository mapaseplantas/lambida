function desenharMenu() {
  const menuBox = `
    <a href="./projeto.html">SOBRE O PROJETO</a>
    <hr>
    <a href="./equipe.html">NOSSA EQUIPE</a>
    <hr>
    <a href="https://www.instagram.com/projetolambida" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
  `;

  const menuElement = document.getElementById("menu");
  const menuButton = document.getElementById("menu-button"); // ID do botão do menu (tipo o ícone hambúrguer)

  // Alterna visibilidade do menu
  const isHidden = menuElement.classList.toggle("hide");
  if (isHidden) {
    menuElement.innerHTML = "";
    document.removeEventListener("click", fecharMenuAoClicarFora);
  } else {
    menuElement.innerHTML = menuBox;
    // Aguarda o próximo ciclo para não detectar o próprio clique no botão
    setTimeout(() => {
      document.addEventListener("click", fecharMenuAoClicarFora);
    });
  }

  // Função para fechar o menu se clicar fora
  function fecharMenuAoClicarFora(event) {
    if (!menuElement.contains(event.target) && event.target !== menuButton) {
      menuElement.classList.add("hide");
      menuElement.innerHTML = "";
      document.removeEventListener("click", fecharMenuAoClicarFora);
    }
  }
}

function posicionarItens() {
  const container = document.querySelector('.cozinha-container');
  const img = container.querySelector('.cozinhaImg');
  const itens = container.querySelectorAll('.item');

  const containerWidth  = container.clientWidth;
  const containerHeight = container.clientHeight;

  // proporção da imagem original
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const containerRatio = containerWidth / containerHeight;

  let imgWidth, imgHeight, offsetX, offsetY;

  if (containerRatio > imgRatio) {
    // container mais largo → barras laterais
    imgHeight = containerHeight;
    imgWidth  = imgHeight * imgRatio;
    offsetX  = (containerWidth - imgWidth) / 2;
    offsetY  = 0;
  } else {
    // container mais alto → barras topo/baixo
    imgWidth  = containerWidth;
    imgHeight = imgWidth / imgRatio;
    offsetX   = 0;
    offsetY   = (containerHeight - imgHeight) / 2;
  }

  itens.forEach(item => {
    const x = parseFloat(item.dataset.x); // 0..1
    const y = parseFloat(item.dataset.y); // 0..1

    item.style.left = `${offsetX + imgWidth  * x}px`;
    item.style.top  = `${offsetY + imgHeight * y}px`;
  });
}

window.addEventListener('load', posicionarItens);
window.addEventListener('resize', posicionarItens);
