import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* =========================
   SCENE
========================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x555555);

/* =========================
   CANVAS + SIZE
========================= */
const canvas = document.querySelector("#experience-canvas");

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/* =========================
   CAMERA
========================= */
const camera = new THREE.PerspectiveCamera(
    25,
    sizes.width / sizes.height,
    0.1,
    1000
);

/* initial position (desktop) */
camera.position.set(10.45, 2.24, -0.09);

/* =========================
   RENDERER
========================= */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* =========================
   CONTROLS
========================= */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.target.set(-0.61, 2.04, -0.01);

controls.minAzimuthAngle = 50 * Math.PI / 180;
controls.maxAzimuthAngle = 130 * Math.PI / 180;

controls.minDistance = 5;
controls.maxDistance = 13;

/* =========================
   LIGHTING
========================= */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

/* =========================
   MOBILE CAMERA FIX
========================= */
function updateCameraForDevice() {
    if (window.innerWidth <= 768) {
        camera.position.set(10.45, 2.24, 6); // mai departe pe telefon
        camera.fov = 35;
    } else {
        camera.position.set(10.45, 2.24, -0.09);
        camera.fov = 25;
    }

    camera.updateProjectionMatrix();
}

updateCameraForDevice();

/* =========================
   LOADER
========================= */
const manager = new THREE.LoadingManager();

manager.onLoad = () => {
    console.log("All assets loaded!");
};

const loader = new GLTFLoader(manager);

loader.load(
    '/fundal2.glb',
    (glb) => {
        console.log("Model loaded!");
        scene.add(glb.scene);
    },
    undefined,
    (error) => {
        console.error("Error loading model:", error);
    }
);

/* =========================
   RESIZE
========================= */
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    updateCameraForDevice();
});

/* =========================
   ANIMATION LOOP
========================= */
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();

/* =========================
   MODALS + CARDS (UI LOGIC)
========================= */
window.openModal = function (id) {
    document.getElementById(id).classList.remove('hidden');
};

window.closeModal = function (id) {
    document.getElementById(id).classList.add('hidden');
};

window.toggleCard = function (card) {
    card.classList.toggle("active");
};