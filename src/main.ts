import Tesseract from "tesseract.js";
import "./style.css";

const video = document.querySelector("video");
const text = document.querySelector("[data-text]");

async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (!video) return;
    video.srcObject = stream;
    video.addEventListener("playing", async () => onVideoPlaying());
}

async function onVideoPlaying() {
    document.addEventListener("keypress", async (e) => onKeyPress(e));
}

async function onKeyPress(e: KeyboardEvent) {
    if (e.code !== "Space") return;
    await detectTextFromCamera();
}

async function detectTextFromCamera() {
    const worker = await getTesseractWorker();
    const canvas = document.createElement("canvas");

    if (!video) return;
    canvas.width = video.width;
    canvas.height = video.height;

    const twoDimensionContext = canvas.getContext("2d");
    if (!twoDimensionContext) return;

    twoDimensionContext.drawImage(video, 0, 0, video.width, video.height);

    const result = await worker.recognize(canvas);
    const data = result.data.text;
    const utterance = new SpeechSynthesisUtterance(data.replace(/\s/g, " "));

    speechSynthesis.speak(utterance);

    if (!text) return;
    text.textContent = data;
}

async function getTesseractWorker() {
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    return worker;
}

init();
