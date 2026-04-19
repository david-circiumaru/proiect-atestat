import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x555555);

const canvas = document.querySelector("#experience-canvas");

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera Setup
const camera = new THREE.PerspectiveCamera(
    25,
    sizes.width / sizes.height,
    0.1,
    1000
);

camera.position.set(10.45, 2.24, -0.09);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//MOBIL TOUCH
renderer.domElement.style.touchAction = "none";

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.target.set(-0.61, 2.04, -0.01);

controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;

controls.minAzimuthAngle = 50 * Math.PI / 180;
controls.maxAzimuthAngle = 130 * Math.PI / 180;

controls.minDistance = 5;
controls.maxDistance = 13;

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Loader
const manager = new THREE.LoadingManager();

manager.onLoad = () => {
    console.log("All assets loaded!");
};

const loader = new GLTFLoader(manager);

// =======================
// MODAL STATE
// =======================
let activeModal = null;

function setModalState(isOpen) {
    activeModal = isOpen ? "open" : null;
}

window.openModal = function (id) {
    document.getElementById(id).classList.remove('hidden');
    setModalState(true);
};

window.closeModal = function (id) {
    document.getElementById(id).classList.add('hidden');
    setModalState(false);
};

window.toggleCard = function (card) {
    card.classList.toggle("active");
};

// =======================
// CLICK + TOUCH
// =======================

let fridgeModel = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

loader.load(
    '/fundal2.glb',
    (glb) => {
        console.log("Model loaded successfully!");

        const model = glb.scene;
        scene.add(model);

        model.traverse((child) => {
            if (child.name === "Cube") {
                fridgeModel = child;
                console.log("Cube found!");
            }
        });
    }
);

//(CLICK + TOUCH)
function handleInteraction(event) {

    if (activeModal !== null) return;

    const x = event.clientX ?? event.touches?.[0]?.clientX;
    const y = event.clientY ?? event.touches?.[0]?.clientY;

    if (x === undefined || y === undefined) return;

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clicked = intersects[0].object;

        if (clicked.name === "Cube" || clicked === fridgeModel) {

            if (clicked.material) {
                clicked.material.emissive = new THREE.Color(0x333333);
                clicked.material.emissiveIntensity = 1;
            }

            window.openModal("fridge-modal");
        }
    }
}

// EVENTS
window.addEventListener("click", handleInteraction);
window.addEventListener("touchstart", handleInteraction);

// Resize
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

function isMobile() {
    return window.innerWidth <= 768;
}

if (isMobile()) {
    camera.position.z = 10;
}

tick();