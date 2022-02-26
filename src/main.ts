import Tesseract from "tesseract.js";
import "./style.css";

const video = document.querySelector("video") as HTMLVideoElement;
const text = document.querySelector("[data-text]") as HTMLPreElement;

async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.addEventListener("playing", async () => onVideoPlaying());
}

async function onVideoPlaying() {
    document.addEventListener("keypress", async (e) => onKeyPress(e));
}

async function onKeyPress(e: KeyboardEvent) {
    if (e.code !== "Space") return;

    const data = await getTextFromVideo();

    speak(data);
    text.textContent = data;
}

async function getTextFromVideo() {
    const worker = await getTesseractWorker();
    const image = getImageFromVideo();

    const result = await worker.recognize(image);
    return result.data.text;
}

async function getTesseractWorker() {
    const language = "eng";
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    return worker;
}

function getImageFromVideo() {
    const canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.drawImage(video, 0, 0, video.width, video.height);

    return canvas;
}

function speak(data: string) {
    const utterance = new SpeechSynthesisUtterance(data.replace(/\s/g, " "));
    speechSynthesis.speak(utterance);
}

init();
