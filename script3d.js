import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5555555); // Light grey so white models stand out

const canvas = document.querySelector("#experience-canvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 1000);
// Coordinates from your portfolio setup
camera.position.set(10.45, 2.24, -0.09);

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true 
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Orbit Controls (Allows you to move around to find the model)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(-0.61, 2.04, -0.01); 

controls.minPolarAngle = 0;           // High point
controls.maxPolarAngle = Math.PI / 2

//controls.minAzimuthAngle = -Math.PI / -3; // -45 degrees
//controls.minAzimuthAngle = -Math.PI / 3; // -45 degrees
//controls.maxAzimuthAngle = Math.PI / 3;  // 45 degrees
//controls.minPolarAngle = Math.PI / 4;  // 45°
//controls.maxPolarAngle = 3 * Math.PI / 4; // 135°
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle =  Math.PI / 4;

controls.minDistance = 5;  // Minimum zoom in
controls.maxDistance = 13; // Maximum zoom out

// 5. Lighting (CRITICAL: Without this, your model will be pitch black)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);




// 7. Loading Manager & GLTF Loader
const manager = new THREE.LoadingManager();
let canRender = false;

manager.onLoad = () => {
    console.log("All assets loaded! Removing test cube...");
    scene.remove(box); // Remove red cube once model arrives
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

// IMPORTANT: Put your file in the 'public' folder. 
// Vite will then find it at exactly '/fundal.glb'
loader.load('/fundal1.glb', (glb) => {
    console.log("Model loaded successfully!");
    const model = glb.scene;
    scene.add(model);
}, undefined, (error) => {
    console.error("Error loading model:", error);
});

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

    // Always render so we can at least see the background and test cube
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();