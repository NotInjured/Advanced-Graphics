// Author: Zhi Wei Willy Su
// Date: 27/01/2021
// Filename: 02-demo-using-dat-gui.js

import { WebGLIndexedBufferRenderer } from "three";

//Global variables
let scene, renderer, camera, orbitControl, controls;
let plane, sphere, cube;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x00DDFF);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);    
    camera.position.set(-10, 15, 10);
    camera.lookAt(scene.position);
    scene.add(camera);

    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    let spotLight = new THREE.PointLight(0xEEEEEE, 10, 50);
    spotLight.position.set(-5, 5, -5);
    scene.add(spotLight);
}

function createGeometry() {
    let axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // create plane material, geometry, and mesh
    let mat = new THREE.MeshLambertMaterial({ color: 0xFF3366 });
    let geo = new THREE.PlaneBufferGeometry(60, 20);
    plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    //create a cube
    let geoCube = new THREE.BoxBufferGeometry(5, 5, 5);
    let matCube = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    cube = new THREE.Mesh(geoCube, matCube);
    scene.add(cube);
}

function setupDatGui(){
    // creating the object that will encapsulate of the variable that we are interested in
    let control = new function(){
        this.name = "Willy";
    };
    let gui = new dat.GUI();
    gui.add(control, 'Name');
    gui.add(control, 'height').min(-8).max(8).step(0.25);
}

function render() {
    requestAnimationFrame(render);
    orbitControl.update();
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    setupDatGui();
    render();
};