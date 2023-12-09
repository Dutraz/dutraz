import './styles/style.css';
import * as THREE from 'three';


/**
 * SCENE
 */
const canvas = document.querySelector('canvas.webgl2');
const scene = new THREE.Scene();


/**
 * MESH
 */
const geometry = new THREE.SphereGeometry(0.8, 20, 10);
const material = new THREE.MeshPhongMaterial({
    color: '#4AF626',
    wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0;
mesh.position.x = 1.2;
scene.add(mesh);


/**
 * LIGHT
 */
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0x7444ff, 0xff00bb, 0.5);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0x7444ff, 1, 100);
pointLight.position.set(0, 3, 4);
scene.add(pointLight);


/**
 * HELPERS
 */
const sizes = {
    width: 850,
    height: 700
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/**
 * CAMERAS
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);


/**
 * ANIMATION
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    mesh.rotation.x += deltaTime * 0.5;
    mesh.rotation.y += deltaTime * 0.5;
    mesh.rotation.z += deltaTime * 0.5;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();