// player.js — playlist estável entre .audio-player
document.addEventListener("DOMContentLoaded", () => {
  const players = Array.from(document.querySelectorAll(".audio-player"));

  // cria <audio> dentro de cada player, com preload e src do data-src
  const audios = players.map((p) => {
    const a = document.createElement("audio");
    a.src = p.dataset.src || "";
    a.preload = "metadata";
    a.style.display = "none"; // fica invisível
    p.appendChild(a);
    return a;
  });

  let currentIndex = -1;

  const formatTime = (sec) => {
    if (!isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const setIcon = (i, playing) => {
    const icon = players[i]?.querySelector(".play-btn i");
    if (!icon) return;
    icon.classList.toggle("fa-play", !playing);
    icon.classList.toggle("fa-pause", playing);
  };

  const updateUI = (i) => {
    const player = players[i];
    const audio = audios[i];
    if (!player || !audio) return;

    const progressBar = player.querySelector(".progress-bar");
    const handle = player.querySelector(".progress-handle");
    const timeLabel = player.querySelector(".time");

    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const pct = dur ? (cur / dur) * 100 : 0;

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (handle) handle.style.left = `${pct}%`;
    if (timeLabel) timeLabel.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
  };

  const pauseAll = () => {
    audios.forEach((a, idx) => {
      if (!a.paused) a.pause();
      setIcon(idx, false);
    });
  };

  const playAt = (i) => {
    if (i < 0 || i >= audios.length) return;
    pauseAll();
    currentIndex = i;
    const audio = audios[i];
    audio.play().then(() => {
      setIcon(i, true);
      updateUI(i);
    }).catch(() => {
      // se o navegador bloquear autoplay, o ícone fica em "play"
      setIcon(i, false);
    });
  };

  // liga eventos por player
  players.forEach((player, i) => {
    const audio = audios[i];
    const btn = player.querySelector(".play-btn");
    const progress = player.querySelector(".progress-container");

    // play/pause
    btn?.addEventListener("click", () => {
      if (currentIndex !== i) {
        playAt(i);
        return;
      }
      if (audio.paused) {
        audio.play().then(() => setIcon(i, true)).catch(() => setIcon(i, false));
      } else {
        audio.pause();
        setIcon(i, false);
      }
    });

    // duração disponível
    audio.addEventListener("loadedmetadata", () => updateUI(i));
    // progresso
    audio.addEventListener("timeupdate", () => updateUI(i));

    // seek por clique
    progress?.addEventListener("click", (e) => {
      const rect = progress.getBoundingClientRect();
      const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      if (isFinite(audio.duration)) {
        audio.currentTime = pct * audio.duration;
        updateUI(i);
      }
    });

    // terminou → próximo
    audio.addEventListener("ended", () => {
      setIcon(i, false);
      const next = i + 1;
      if (next < audios.length) {
        playAt(next);
      } else {
        currentIndex = -1; // fim da lista
      }
    });
  });

  // Se quiser iniciar automático no 1º item ao carregar, descomente:
  // playAt(0);
});
