// Author: Zhi Wei Willy Su
// Date: 20/01/2021
// Filename: 01-ZhiWeiWillySu-Lab
// Lab 1

// Global Variables
let scene, renderer, camera, orbitControl, axesHelper;
let materialCube, materialCylinder, materialBasic, materialPlane;
let geoBox, geoSphere, geoCylinder, geoPlane, cube, sphere, cylinder, plane;

// Function definitions
function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x00DDFF);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);    
    camera.position.set(-10, 15, 10);
    camera.lookAt(scene.position);
    scene.add(camera);

    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    let pointLight = new THREE.PointLight(0xEEEEEE, 10, 50);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);
}

function createGeometry() {
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.set(-15, -2, 0);
    scene.add(axesHelper);
    // create material, geometry, and mesh
    
    materialCube = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    geoBox = new THREE.BoxGeometry(1, 1, 1);
    cube = new THREE.Mesh(geoBox, materialCube);
    cube.position.set(5, -2, 0);

    materialCylinder = new THREE.MeshBasicMaterial({ color: 0x001FFF });
    geoClyinder = new THREE.CylinderGeometry(1, 1, 5, 8, 2, false);
    cylinder = new THREE.Mesh(geoClyinder, materialCylinder);
    cylinder.position.set(-5, -2, 0);

    materialBasic = new THREE.MeshBasicMaterial({ color: 0xF0FF00 });
    geoSphere = new THREE.SphereGeometry(1, 8, 8);
    sphere = new THREE.Mesh(geoSphere, materialBasic);
    sphere.position.set(0, -2, 0);

    materialPlane = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    geoPlane = new THREE.PlaneBufferGeometry(60, 20);
    plane = new THREE.Mesh(geoPlane, materialPlane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -5, 0);

    scene.add(cube);
    scene.add(cylinder);
    scene.add(sphere);
    scene.add(plane);
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
    render();
};