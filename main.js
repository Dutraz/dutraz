import './styles/style.css';
import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';


/**
 * SCENE
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();


/**
 * MESH's
 */
const fbxLoader = new FBXLoader();
fbxLoader.load(
    '/models/office-cubicle/source/office-cubicle.fbx',
    (obg) => {
        obg.scale.set(0.0012, 0.0012, 0.0012);
        obg.position.set(1.0, -0.5, 0);
        obg.rotation.set(0.2, 2.0, 0);
        scene.add(obg);
    }
);

const fontLoader = new FontLoader();
fontLoader.load(
    'fonts/kdam_thmor_pro_regular.json',
    (font) => {
        const textGeometry = new TextGeometry('Pedro Dutra', {
            font: font,
            size: 0.9,
            height: 0.000001,
            curveSegments: 20,
        });
        const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-7, 0.5, -3);
        scene.add(textMesh);
    }
);


/**
 * LIGHT
 */
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);


/**
 * RESIZE
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
 * CAMERA
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
 * ANIMATOR
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;


    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
