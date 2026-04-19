import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x555555); // FIXED

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

// Coordinates 
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

// controls.minAzimuthAngle = -Math.PI / -3;
// controls.minAzimuthAngle = -Math.PI / 3;
// controls.maxAzimuthAngle = Math.PI / 3;
// controls.minPolarAngle = Math.PI / 4;
// controls.maxPolarAngle = 3 * Math.PI / 4;

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

// 7. Loading Manager & GLTF Loader
const manager = new THREE.LoadingManager();
let canRender = false;

manager.onLoad = () => {
    console.log("All assets loaded!");
    canRender = true;
};



const loader = new GLTFLoader(manager);

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        const pos = camera.position;
        const tar = controls.target;

        console.log('--- CAMERA SETTINGS ---');
        console.log(`Position: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
        console.log(`Target: ${tar.x.toFixed(2)}, ${tar.y.toFixed(2)}, ${tar.z.toFixed(2)}`);
        console.log('-----------------------');
    }
});


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

// 8. Handle Window Resize
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

// UI FUNCTIONS
window.openModal = function (id) {
    document.getElementById(id).classList.remove('hidden');
};

window.closeModal = function (id) {
    document.getElementById(id).classList.add('hidden');
};

window.toggleCard = function (card) {
    card.classList.toggle("active");
};

// =======================
// CLICK PE FRIGIDER (Cube) -> MODAL
// =======================

let fridgeModel = null;

// raycaster pentru click 3D
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// CLICK handler
window.addEventListener("click", (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clicked = intersects[0].object;

        if (clicked.name === "Cube" || clicked === fridgeModel) {

            // glow simplu
            if (clicked.material) {
                clicked.material.emissive = new THREE.Color(0x333333);
                clicked.material.emissiveIntensity = 1;
            }

            // deschide modal
            window.openModal("fridge-modal");
        }
    }
});