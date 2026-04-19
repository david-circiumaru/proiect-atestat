import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x555555);

const canvas = document.querySelector("#experience-canvas");

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(
    25,
    sizes.width / sizes.height,
    0.1,
    1000
);

camera.position.set(10.45, 2.24, -0.09);

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.target.set(-0.61, 2.04, -0.01);

controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;

controls.minAzimuthAngle = 50 * Math.PI / 180;
controls.maxAzimuthAngle = 130 * Math.PI / 180;

controls.minDistance = 5;
controls.maxDistance = 13;

// 5. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// 6. Loading Manager & GLTF Loader
const manager = new THREE.LoadingManager();

manager.onLoad = () => {
    console.log("All assets loaded!");
};

const loader = new GLTFLoader(manager);

// =======================
// CLICK PE CUBE + FLASH
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
    },
    undefined,
    (error) => {
        console.error("Error loading model:", error);
    }
);

// CLICK
window.addEventListener("click", (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clicked = intersects[0].object;

        if (clicked.name === "Cube" || clicked === fridgeModel) {

            // 💡 FLASH PE ECRAN
            const flash = document.getElementById("flash");

            flash.style.opacity = "1";

            setTimeout(() => {
                flash.style.opacity = "0";
            }, 200);

            // optional mic glow (safe)
            if (clicked.material && clicked.material.emissive) {
                clicked.material.emissive = new THREE.Color(0x00ffff);
                clicked.material.emissiveIntensity = 1.5;
            }

            // ⏱️ DELAY MODAL
            setTimeout(() => {
                window.openModal("fridge-modal");
            }, 400);
        }
    }
});

// 8. Resize
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 9. Animation Loop
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

// UI
window.openModal = function (id) {
    document.getElementById(id).classList.remove('hidden');
};

window.closeModal = function (id) {
    document.getElementById(id).classList.add('hidden');
};

window.toggleCard = function (card) {
    card.classList.toggle("active");
};

tick();