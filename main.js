import './styles/style.css';
import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


/**
 * SCENE
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
let mixer = null;
let action = null;


/**
 * LIGHT
 */
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xFFFFFF, 0.5);
sun.position.set(0, 0, 20);
sun.radius = 10;
sun.castShadow = true;
sun.shadow.camera.top = 2500;
sun.shadow.camera.bottom = -2500;
sun.shadow.camera.left = -2500;
sun.shadow.camera.right = 2500;
sun.shadow.camera.near = 0.0001;
sun.shadow.camera.far = 100000000;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);


/**
 * MESH's
 */
const fbxLoader = new FBXLoader();
fbxLoader.load(
    '/models/office-cubicle/source/cenario.fbx',
    (obj, materials) => {
        obj.scale.setScalar(0.2);
        obj.position.set(250, -140, 0);
        obj.rotation.set(0.4, -0.75, 0);

        obj.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = false;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mixer = new THREE.AnimationMixer(obj);
        action = mixer.clipAction(obj.animations[2]);
        action.play();

        sun.target = obj;
        scene.add(obj);
    },
);


const fontLoader = new FontLoader();
fontLoader.load(
    'fonts/kdam_thmor_pro_regular.json',
    (font) => {
        const textGeometry = new TextGeometry('Pedro Dutra', {
            font: font,
            size: 75,
            height: 10,
            curveSegments: 20,
        });

        const textMesh = new THREE.Mesh(textGeometry);
        textMesh.position.set(-550, -30, -10);
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        scene.add(textMesh);
    }
);


/**
 * RESIZE
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


/**
 * CAMERA
 */
const camera = new THREE.OrthographicCamera(
    sizes.width / -2,
    sizes.width / 2,
    sizes.height / 2,
    sizes.height / -2,
    -1000,
    1000
);
camera.position.z = 1;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);


/**
 * CONTROL
 */
const control = new OrbitControls(camera, canvas);

/**
 * ANIMATOR
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if (mixer) {
        mixer.setTime(elapsedTime);
    }

    sun.position.x = Math.cos(elapsedTime * 0.2) * sizes.width / 1.2;
    sun.position.y = Math.sin(elapsedTime * 0.2) * sizes.height / 1.2;

    control.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
