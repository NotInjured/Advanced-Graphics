// Author: Zhi Wei Willy Su
// Date: 
// Filename: 
// Lab 

// Global Variables
let scene, renderer, camera, orbitControl;

// Function definitions
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
    let pointLight = new THREE.PointLight(0xEEEEEE, 10, 50);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);
}

function createGeometry() {
    // create plane material, geometry, and mesh
    let mat = new THREE.MeshLambertMaterial({ color: 0xFF3366 });
    let geo = new THREE.PlaneBufferGeometry(60, 20);
    let mesh = new THREE.Mesh(geo, mat);

    mesh.rotation.x = -0.5 * Math.PI;

    scene.add(mesh);
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