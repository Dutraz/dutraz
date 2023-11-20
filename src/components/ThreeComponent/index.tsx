import React from 'react';
import * as THREE from 'three';
import {Group} from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {Font, FontLoader} from 'three/examples/jsm/loaders/FontLoader';


interface IState {
    initialized: boolean;
}

class ThreeComponent extends React.Component<NonNullable<unknown>, IState> {
    private readonly threeCanvasEl: React.RefObject<HTMLCanvasElement>;
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    private renderer: THREE.WebGLRenderer;

    constructor(props: never) {
        super(props);

        this.state = {
            initialized: false,
        };

        this.threeCanvasEl = React.createRef();
    }


    componentDidMount() {
        if (!this.state.initialized) {
            this.init();
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    addMeshs = () => {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            'models/office-cubicle/source/office-cubicle.fbx',
            (object: Group) => {
                object.scale.set(0.012, 0.012, 0.012);
                object.position.set(10, -2, 0);
                object.rotation.set(0.2, 2.2, 0);
                this.scene.add(object);
            }
        );

        const fontLoader = new FontLoader();
        fontLoader.load(
            'fonts/kdam_thmor_pro_regular.json',
            (font: Font) => {

                const params = {
                    font: font,
                    size: 3,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: false,
                };

                const textGeometry = new TextGeometry('Pedro Dutra', params);
                const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(-40, 12, 0);
                textMesh.rotation.set(0, 0, 0);
                this.scene.add(textMesh);
            }
        );
    }

    addLights = () => {
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(pointLight, ambientLight);
    }

    init = () => {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.threeCanvasEl.current!,
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.setZ(30);

        this.addLights();
        this.addMeshs();
        this.animate();
    }

    render() {
        return (
            <canvas
                id={'bg'}
                ref={this.threeCanvasEl}
            />
        );
    }
}


export default ThreeComponent;
