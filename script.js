//-----------------------------------------CARROSSEL ----------------------------------//

const containerFilmes = document.querySelector(".movies");
const botaoVoltar = document.querySelector(".btn-prev");
const botaoAvancar = document.querySelector(".btn-next");
const botaoTema = document.querySelector(".btn-theme");
let todosOsFilmes = [];
let paginaAtual = 0;

async function buscarFilmes() {
  const { results } = await (
    await fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
    )
  ).json();

  while (results.length > 1) {
    let pagina = results.splice(0, 5);
    todosOsFilmes.push(pagina);
  }
  criarFilmes(todosOsFilmes[0]);
}

function criarFilmes(arrayDeFilmes) {
  containerFilmes.innerHTML = "";
  arrayDeFilmes.forEach((filme) => {
    if (!filme.poster_path) return;

    const containerDoFilme = document.createElement("div");
    containerDoFilme.classList.add("movie");
    containerDoFilme.style.backgroundImage = `url(${filme.poster_path})`;
    containerDoFilme.id = filme.id;

    containerDoFilme.addEventListener("click", (event) => {
      abrirModal(event.target.id);
    });

    const infoDoFilme = document.createElement("div");
    infoDoFilme.classList.add("movie__info");

    const titudoDoFilme = document.createElement("span");
    titudoDoFilme.classList.add("movie__title");
    titudoDoFilme.textContent = filme.title;

    const estrela = document.createElement("img");
    estrela.src = "./assets/estrela.svg";

    const notaDoFilme = document.createElement("span");
    notaDoFilme.classList.add("movie__rating");
    notaDoFilme.textContent = filme.vote_average.toFixed(1);

    notaDoFilme.append(estrela);
    infoDoFilme.append(titudoDoFilme, notaDoFilme);
    containerDoFilme.append(infoDoFilme);
    containerFilmes.append(containerDoFilme);
  });
}

function avancar() {
  paginaAtual += 1;

  if (paginaAtual >= todosOsFilmes.length) {
    paginaAtual = 0;
  }
  criarFilmes(todosOsFilmes[paginaAtual]);
}

function voltar() {
  paginaAtual -= 1;

  if (paginaAtual < 0) {
    paginaAtual = todosOsFilmes.length - 1;
  }
  criarFilmes(todosOsFilmes[paginaAtual]);
}

botaoAvancar.addEventListener("click", avancar);
botaoVoltar.addEventListener("click", voltar);
buscarFilmes();

//-----------------------------------------BUSCA ----------------------------------//

const input = document.querySelector(".input");

async function filtrarFilmes() {
  todosOsFilmes = [];

  if (!input.value) {
    return buscarFilmes();
  }

  const buscaDeFilmes = await (
    await fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=" +
        input.value +
        ""
    )
  ).json();

  let results = buscaDeFilmes.results;

  while (results.length > 1) {
    let pagina = results.splice(0, 5);
    todosOsFilmes.push(pagina);
  }
  criarFilmes(todosOsFilmes[0]);
}

input.addEventListener("keydown", (key) => {
  if (key.key === "Enter") {
    filtrarFilmes();
  }
});

//-----------------------------------------HIGLIGHT ----------------------------------//

const filmeDoDia = document.querySelector(".highlight__video");
const filmeDoDiaTitulo = document.querySelector(".highlight__title");
const filmeDoDiaNota = document.querySelector(".highlight__rating");
const filmeDoDiaGeneros = document.querySelector(".highlight__genres");
const filmeDoDiaLancamento = document.querySelector(".highlight__launch");
const filmeDoDiaDescricao = document.querySelector(".highlight__description");
const filmeDoDiaTrailer = document.querySelector(".highlight__video-link");

async function criarHighlight() {
  const filmeDestaque = await (
    await fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
    )
  ).json();

  filmeDoDia.style.backgroundImage = `url(${filmeDestaque.backdrop_path})`;
  filmeDoDiaTitulo.textContent = filmeDestaque.title;
  filmeDoDiaNota.textContent = Number(filmeDestaque.vote_average).toFixed(1);
  filmeDoDiaGeneros.textContent = `${filmeDestaque.genres[0].name}, ${filmeDestaque.genres[1].name}, ${filmeDestaque.genres[2].name} `;
  filmeDoDiaLancamento.textContent = new Date(
    filmeDestaque.release_date
  ).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  filmeDoDiaDescricao.textContent = filmeDestaque.overview;
}

criarHighlight();

async function carregarTrailer() {
  const trailer = await (
    await fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
    )
  ).json();

  filmeDoDiaTrailer.href =
    "https://www.youtube.com/watch?v=" + trailer.results[1].key;
}

carregarTrailer();
//-----------------------------------------MODAL ----------------------------------//

const modal = document.querySelector(".modal");
const modalTitulo = document.querySelector(".modal__title");
const modalImagem = document.querySelector(".modal__img");
const modalDescricao = document.querySelector(".modal__description");
const modalGeneros = document.querySelector(".modal__genres");
const modalNota = document.querySelector(".modal__average");

const fecharModal = document.querySelector(".modal__close");
fecharModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

async function abrirModal(id) {
  const filme = await (
    await fetch(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
    )
  ).json();
  console.log(filme);
  modal.classList.remove("hidden");
  modalTitulo.innerText = filme.title;
  modalImagem.src = filme.backdrop_path;
  modalDescricao.textContent = filme.overview;
  modalNota.innerText = filme.vote_average.toFixed(1);

  async function criarGeneros() {
    modalGeneros.innerHTML = "";
    filme.genres.forEach((genero) => {
      const modalGenero = document.createElement("span");
      modalGenero.classList.add("modal__genre");
      modalGenero.textContent = genero.name;
      modalGeneros.append(modalGenero);
    });
  }
  criarGeneros();
}

//-----------------------------------------TEMA ----------------------------------//
const body = document.querySelector("body");

async function alterarTema() {
  botaoTema.addEventListener("click", () => {
    const tema = localStorage.getItem("tema");
    if (tema === "claro") {
      localStorage.setItem("tema", "escuro");
      botaoTema.src = "./assets/dark-mode.svg";
      botaoAvancar.src = "./assets/seta-direita-branca.svg";
      botaoVoltar.src = "./assets/seta-esquerda-branca.svg";
      body.style.setProperty("--background-color", "#242424");
      body.style.setProperty("--highlight-background", "#454545");
      body.style.setProperty("--highlight-description", "#FFF");
      body.style.setProperty("--color", "#FFF");
      body.style.setProperty("--highlight-color", "#FFF");
    } else {
      localStorage.setItem("tema", "claro");
      botaoTema.src = "./assets/light-mode.svg";
      botaoAvancar.src = "./assets/seta-direita-preta.svg";
      botaoVoltar.src = "./assets/seta-esquerda-preta.svg";
      body.style.setProperty("--background-color", "#FFF");
      body.style.setProperty("--highlight-background", "#FFF");
      body.style.setProperty("--highlight-description", "#000");
      body.style.setProperty("--color", "#000");
      body.style.setProperty("--highlight-color", "#000");
    }
  });
}

alterarTema();
