// Author: Zhi Wei Willy Su
// Date: 20/01/2021
// Filename: 01-ZhiWeiWillySu-Lab
// Lab 

// Global Variables
let scene, renderer, camera;
let gui, trackballControls, clock, controls;
let plane;

// Function definitions
function init() {
    scene = new THREE.Scene();
    //stats = initStats();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = 500;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;

    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);    
    camera.position.set( 0, 25, 50);
    camera.lookAt(scene.position);
    clock = new THREE.Clock();//needed for the trackballControl
    trackballControl = new THREE.TrackballControls(camera, renderer.domElement);

    // add hemisphere lighting
    let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
    hemisphereLight.castShadow = true;
    hemisphereLight.position.set(0, 500, 0);
    scene.add(hemisphereLight);

    // add directional lighting
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.castShadow = true;
    directionalLight.position.set(40, 60, -10);
    let dirHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
    directionalLight.add(dirHelper);

    scene.add(directionalLight);

    // add subtle ambient lighting
    scene.add(new THREE.AmbientLight(0x595959, 0.5));
}

function createGeometry() {
    let axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // create shape

    // create plane material, geometry, and mesh
    let mat = new THREE.MeshStandardMaterial({ color: 0x00FFD4 });
    let geo = new THREE.PlaneGeometry(50, 50);
    plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;

    // add plane to scene
    scene.add(plane);
}

function render() {

    requestAnimationFrame(render);
    trackballControl.update(clock.getDelta());
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    render();
};