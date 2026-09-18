/* ================= TABS ================= */

const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
});

/* ================= HELP TERMINAL ================= */

const terminalOverlay = document.getElementById("terminalOverlay");
const terminalBody = document.getElementById("terminalBody");
const terminalInput = document.getElementById("terminalInput");
const terminalTitle = document.getElementById("terminalTitle");
const termPrompt = document.getElementById("termPrompt");

let terminalLines = [];
let chatbotMode = false;

function getDiscordName() {
    const name = document.getElementById("widgetName").textContent;
    return name && name !== "loading..." ? name : "ficky";
}

const commands = {
    help: () =>
        "Available commands:\n" +
        "  1. about    - About me\n" +
        "  2. webinfo  - Website information\n" +
        "  3. discord  - Discord server invite\n" +
        "  4. music    - Current music rotation\n" +
        "  5. chatbot  - Talk to the site assistant\n" +
        "  6. clear    - Clear terminal",
    about: () => "About me:\n  name: Ficky\n  age: 16\n  hobby: gaming",
    webinfo: () =>
        "Website info:\n" +
        "  personal site by ficky\n" +
        "  built with: html, css & js",
    discord: () => "discord server: discord.gg/gQFvjZKgYk",
    music: () =>
        "currently in rotation:\n" +
        playlist.map((t, i) => `  ${i + 1}. ${t.title} — ${t.artist}`).join("\n"),
    chatbot: () => {
        chatbotMode = true;
        return "assistant activated!\n" +
            "hi! ask me anything about ficky or the website.\n" +
            'type "exit" or "quit" to leave chat mode.';
    }
};

function chatbotReply(text) {
    const q = text.toLowerCase();
    if (/^\s*(hello|hi|hey|halo|hai|yo)/.test(q)) {
        return 'yo! type "help" for commands, or ask me anything.';
    }
    if (/(who are|your name|nama|siapa)/.test(q)) {
        return `my name is ${getDiscordName()} — in-game > irl.`;
    }
    if (/(web|site|built|made|tech)/.test(q)) {
        return "this site is built with plain html, css & js — no frameworks.";
    }
    if (/(musik|music|lagu|song|rotation|playlist)/.test(q)) {
        return 'the rotation is the music i play on repeat — type "music" to see it.';
    }
    if (/(discord)/.test(q)) {
        return 'discord server: discord.gg/gQFvjZKgYk — type "discord" for the invite.';
    }
    if (/(contact|social|link|tiktok|instagram|github|follow)/.test(q)) {
        return "check the contact tab for all my social links.";
    }
    return "hmm, i don't know that one yet. try asking about ficky, the website, or the music.";
}

function renderTerminal() {
    terminalBody.innerHTML = "";
    terminalLines.forEach(line => {
        const div = document.createElement("div");
        div.className = line.type === "input" ? "term-input-line" : "term-output-line";
        div.textContent = line.content;
        terminalBody.appendChild(div);
    });
    terminalBody.scrollTop = terminalBody.scrollHeight;
    termPrompt.textContent = chatbotMode ? "✦>" : ">";
    terminalTitle.textContent = chatbotMode ? "terminal (assistant ✦)" : "terminal";
    terminalInput.placeholder = chatbotMode ? "ask anything..." : "type a command...";
}

function addTerminalLine(type, content) {
    terminalLines.push({ type, content });
}

function openTerminal() {
    terminalOverlay.classList.add("show");
    if (!terminalLines.length) {
        addTerminalLine("output", 'Welcome to Ficky\'s terminal. Type "help" for commands.');
    }
    renderTerminal();
    setTimeout(() => terminalInput.focus(), 50);
}

function closeTerminal() {
    terminalOverlay.classList.remove("show");
    chatbotMode = false;
}

function handleCommand(raw) {
    const text = raw.trim();
    const key = text.toLowerCase();

    addTerminalLine("input", `> ${text}`);

    let output = null;

    if (key === "clear") {
        terminalLines = [];
        addTerminalLine("output", 'Terminal cleared. Type "help" for commands.');
        renderTerminal();
        return;
    }

    if (chatbotMode) {
        if (key === "exit" || key === "quit") {
            chatbotMode = false;
            output = 'exited chat mode. type "help" for commands.';
        } else {
            output = chatbotReply(text);
        }
    } else if (commands[key]) {
        output = commands[key]();
    } else {
        output = `Command not found: "${text}". Type "help" for available commands.`;
    }

    if (output) addTerminalLine("output", output);
    renderTerminal();
}

document.getElementById("helpBtn").addEventListener("click", () => {
    if (terminalOverlay.classList.contains("show")) closeTerminal();
    else openTerminal();
});

terminalOverlay.addEventListener("click", (e) => {
    if (e.target === terminalOverlay) closeTerminal();
});

document.getElementById("terminalCloseBtn").addEventListener("click", closeTerminal);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && terminalOverlay.classList.contains("show")) closeTerminal();
});

terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && terminalInput.value.trim()) {
        handleCommand(terminalInput.value);
        terminalInput.value = "";
    }
});

/* ================= DISCORD STATUS (Lanyard) ================= */

const DISCORD_USER_ID = "271771298772811777";

const statusColors = {
    online: "#3ba55d",
    idle: "#faa61a",
    dnd: "#ed4245",
    offline: "#747f8d"
};

const statusLabels = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline"
};

const activityPrefix = {
    0: "Playing ",
    1: "Streaming ",
    2: "Listening to ",
    3: "Watching ",
    5: "Competing in "
};

function getActivityImage(activity) {
    if (!activity || !activity.assets || !activity.assets.large_image) return null;
    const img = activity.assets.large_image;

    if (img.startsWith("mp:")) {
        return `https://media.discordapp.net/${img.slice(3)}`;
    }
    if (img.startsWith("spotify:")) {
        return `https://i.scdn.co/image/${img.split("spotify:")[1]}`;
    }
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
}

function setStatusText(el, text) {
    if (el.dataset.current === text) return;
    el.dataset.current = text;

    el.textContent = text;
    el.classList.remove("sliding");
    el.style.removeProperty("--scroll-distance");

    requestAnimationFrame(() => {
        const wrap = el.parentElement;
        const overflow = Math.round(el.scrollWidth - wrap.clientWidth);
        if (overflow > 4) {
            el.style.setProperty("--scroll-distance", `-${overflow}px`);
            el.classList.add("sliding");
        }
    });
}

function updateLanyard() {
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
        .then(res => res.json())
        .then(res => {
            if (!res.success) return;
            const d = res.data;

            document.getElementById("widgetName").textContent = d.discord_user.username;

            let statusText = statusLabels[d.discord_status] || "Offline";
            let dotColor = statusColors[d.discord_status] || statusColors.offline;
            let imageUrl = null;

            if (d.listening_to_spotify && d.spotify) {
                statusText = `Listening to ${d.spotify.song} - ${d.spotify.artist}`;
                imageUrl = d.spotify.album_art_url;
            } else {
                const activity = d.activities.find(a => a.type !== 4);
                if (activity) {
                    const prefix = activityPrefix[activity.type] || "";
                    statusText = `${prefix}${activity.name}`;
                    if (activity.type === 1) dotColor = "#593695";
                    imageUrl = getActivityImage(activity);
                }
            }

            document.getElementById("statusDot").style.background = dotColor;
            setStatusText(document.getElementById("widgetStatus"), statusText);

            const activityImg = document.getElementById("activityImage");
            if (imageUrl) {
                activityImg.src = imageUrl;
                activityImg.style.display = "block";
            } else {
                activityImg.style.display = "none";
            }

            const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${d.discord_user.avatar}.png`;
            document.getElementById("widgetAvatar").src = avatarUrl;

            const decoEl = document.getElementById("avatarDecoration");
            const deco = d.discord_user.avatar_decoration_data;
            if (deco && deco.asset) {
                decoEl.src = `https://cdn.discordapp.com/avatar-decoration-presets/${deco.asset}.png`;
                decoEl.style.display = "block";
            } else {
                decoEl.style.display = "none";
            }
        })
        .catch(() => {
            document.getElementById("widgetStatus").textContent = "unavailable";
        });
}

updateLanyard();
setInterval(updateLanyard, 20000);

/* ================= MUSIC PLAYER ================= */

// tambah/ganti lagu di sini — tinggal tambah baris baru di dalam array ini
// src wajib diisi nama file audio yang sudah diupload ke folder yang sama dengan index.html
// art boleh dikosongkan pakai avatar.jpg, atau ganti dengan gambar cover lagu masing-masing
const playlist = [
    { title: "Secondhand", artist: "sincerely Lue.", src: "music/lunarfis.m4a", art: "cover/avatar.jpg" },
    { title: "Hope", artist: "XXXTENTACION", src: "music/lunarfis1.m4a", art: "cover/avatar1.jpg" },
    // { title: "Judul Lagu 3", artist: "Nama Artis 3", src: "music/lagu3.mp3", art: "cover/avatar.jpg" },
];

let trackIndex = 0;
const audio = document.getElementById("audioPlayer");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volumeSlider = document.getElementById("volumeSlider");
const volumeLabel = document.getElementById("volumeLabel");

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function loadTrack(index) {
    const track = playlist[index];
    document.getElementById("trackTitle").textContent = track.title;
    document.getElementById("trackArtist").textContent = track.artist;
    document.getElementById("trackArt").src = track.art;
    audio.src = track.src;
}

function playTrack() {
    audio.play();
    playIcon.className = "fa-solid fa-pause";
}

function pauseTrack() {
    audio.pause();
    playIcon.className = "fa-solid fa-play";
}

document.getElementById("playPauseBtn").addEventListener("click", () => {
    if (audio.paused) playTrack();
    else pauseTrack();
});

document.getElementById("nextBtn").addEventListener("click", () => {
    trackIndex = (trackIndex + 1) % playlist.length;
    loadTrack(trackIndex);
    playTrack();
});

document.getElementById("prevBtn").addEventListener("click", () => {
    trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(trackIndex);
    playTrack();
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
    trackIndex = (trackIndex + 1) % playlist.length;
    loadTrack(trackIndex);
    playTrack();
});

progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audio.duration) audio.currentTime = ratio * audio.duration;
});

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
    volumeLabel.textContent = `${volumeSlider.value}%`;
});

audio.volume = 0.5;
loadTrack(trackIndex);
