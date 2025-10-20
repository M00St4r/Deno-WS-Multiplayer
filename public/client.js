"use strict";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const protocol = location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(`${protocol}//${location.host}/ws`);
let myId = null;
let players = {};
const char = new Image();
const char2 = new Image();
char.src = "/MiniCharacter.png";
char2.src = "/MiniCharacter2.png";
let charLoaded = false;
let char2Loaded = false;
socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "init") {
        myId = msg.id;
        players = msg.players;
    }
    else if (msg.type === "join") {
        players[msg.player.id] = msg.player;
    }
    else if (msg.type === "update") {
        players[msg.player.id] = msg.player;
    }
    else if (msg.type === "leave") {
        delete players[msg.id];
    }
});
document.addEventListener("keydown", (e) => {
    if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) !== -1) {
        socket.send(JSON.stringify({ type: "move", dir: keyToDir(e.key) }));
    }
});
document.getElementById("controls").addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "BUTTON") {
        const dir = target.id;
        socket.send(JSON.stringify({ type: "move", dir }));
    }
});
function keyToDir(key) {
    switch (key) {
        case "w":
        case "ArrowUp": return "up";
        case "s":
        case "ArrowDown": return "down";
        case "a":
        case "ArrowLeft": return "left";
        case "d":
        case "ArrowRight": return "right";
        default: return "";
    }
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const id in players) {
        const p = players[id];
        if (id === myId && charLoaded) {
            ctx.drawImage(char, p.x, p.y, 50, 50);
        }
        else if (id != myId && char2Loaded) {
            ctx.drawImage(char2, p.x, p.y, 50, 50);
        }
        //ctx.fillStyle = id === myId ? "blue" : "red";
        //ctx.fillRect(p.x, p.y, 20, 20);
    }
    requestAnimationFrame(gameLoop);
}
window.onload = function () {
    gameLoop();
    //
};
