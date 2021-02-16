// Author: Zhi Wei Willy Su
// Date: 02-14-2021
// Filename: 04-Zhi-WeiSu.js
// Lab 4 - Using Material

// Global Variables
let scene, renderer, camera;
let gui, trackballControls, clock, controls;
let spotLight, pointLight, directionalLight;
let spotColor, pointColor, dirColor, matColor;
let torusGeo, torusMat;
let torus ,plane;
let speed = 0.01;

// Function definitions
function init() {
    scene = new THREE.Scene();
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
    camera.position.set( -40, 100, 30 );
    camera.lookAt(scene.position);
    clock = new THREE.Clock();
    trackballControl = new THREE.TrackballControls(camera, renderer.domElement);

    // AmbientLight
    scene.add(new THREE.AmbientLight(0x595959, 1.5));

    // PointLight
    pointLight = new THREE.PointLight(0xff0000, 1);
    pointLight.castShadow = true;
    pointLight.position.set(-10, 20, -20);

    let pLightHelper = new THREE.PointLightHelper(pointLight);
    pointLight.add(pLightHelper);
    scene.add(pointLight);

    // DirectionalLight
    directionalLight = new THREE.DirectionalLight(0x00ff00, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(100, 30, -10);
    directionalLight.shadow.camera.near = 10;
    directionalLight.shadow.camera.far = 500;

    let dirHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
    directionalLight.add(dirHelper);
    scene.add(directionalLight);

    // SpotLight
    spotLight = new THREE.SpotLight( 0x0000ff, 0.6, 0 , Math.PI * 0.2 );
    spotLight.position.set(-5, 32, 5);
    spotLight.castShadow = true;
    spotLight.angle = 5.9;

    let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLight.add(spotLightHelper);

    scene.add(spotLight);
}

function createGeometry() {
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Torus material, geometry, and mesh
    torusMat = new THREE.MeshStandardMaterial({color: 0xFF1106 });
    torusGeo = new THREE.TorusKnotBufferGeometry(10, 3, 100, 16 );
    torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.y =10;
    torus.scale.x = 0.5;
    torus.scale.y = 0.5;
    torus.scale.z = 0.5;
    torus.castShadow = true;
    scene.add(torus);

    // Plane material, geometry, and mesh
    let mat = new THREE.MeshStandardMaterial({ color: 0x00FFFF });
    let geo = new THREE.PlaneGeometry(100, 100);
    plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0)
    plane.receiveShadow = true;
    scene.add(plane);
}

function setupDatGui(){
    controls = new function () {
        this.visible = true;
        this.torusColor = torusMat.color.getStyle();
        this.wireframe = false;
        this.wireframeWidth = 1;
        this.emissive = "#000000";
        this.emissiveIntensity = 1;
        this.bumpScale = 1;
        this.specular = "#111111";
        this.shininess = 30;
        this.transparent = false;
        this.opacity = 1;
        this.spinningTorus = true;

        this.spotVisible = spotLight.visible;
        this.spotLightColor = spotLight.color.getStyle();

        this.pointVisible = pointLight.visible;
        this.pointColor = pointLight.color.getStyle();

        this.dirVisible = directionalLight.visible;
        this.directionalLightColor = directionalLight.color.getStyle(); 
    };

    gui = new dat.GUI();
    
    // SpotLight controls
    let spot = gui.addFolder('SpotLight');
    spot.addColor(controls, 'spotLightColor').onChange(function (e) {
        spotLight.color = new THREE.Color(e);
    });
    spot.add(controls, 'spotVisible').name('Disable');

    // PointLight controls
    let point = gui.addFolder('PointLight');
    point.addColor(controls, 'pointColor').onChange(function (e) {
        pointColor.color = new THREE.Color(e);
    });
    point.add(controls, 'pointVisible').name('Disable');

    // DirectionalLight controls
    let dir = gui.addFolder('DirectionalLight')
    dir.addColor(controls, 'directionalLightColor').onChange(function (e) {
        directionalLight.color = new THREE.Color(e);
    });
    dir.add(controls, 'dirVisible').name('Disable');

    // Material properties
    let material = gui.addFolder('Material Properties');
    material.add(controls, 'visible');
    material.addColor(controls, 'torusColor').onChange(function (e){
        torusMat.color = new THREE.color(e);
    })
    material.add(controls, 'wireframe');
    material.add(controls, 'wireframeWidth', 0, 1);
    material.addColor(controls, 'emissive').onChange(function (e){
        torusMat.emissive = new THREE.Color(e);
    });
    material.add(controls, 'emissiveIntensity', 0, 10);
    material.add(controls, 'bumpScale', 0, 5);
    material.addColor(controls, 'specular').onChange(function (e){
        torusMat.specular = new THREE.Color(e);
    });
    material.add(controls, 'shininess', 0, 100);
    material.add(controls, 'transparent');
    material.add(controls, 'opacity', 0, 1);

    gui.add(controls, 'spinningTorus').name('Spin');
}

function render() {
    if(controls.spinningTorus){
        torus.rotation.x += speed;
        torus.rotation.y += speed;
        torus.rotation.z += speed;
    }

    torusMat.visible = controls.visible;
    torusMat.wireframe = controls.wireframe;
    torusMat.wireframeLinewidth  = controls.wireframeWidth;
    torusMat.shininess = controls.shininess;
    torusMat.bumpScale = controls.bumpScale;
    torusMat.transparent = controls.transparent;
    torusMat.opacity = controls.opacity;

    spotLight.visible = controls.spotVisible;
    pointLight.visible = controls.pointVisible;
    directionalLight.visible = controls.dirVisible;

    requestAnimationFrame(render);
    trackballControl.update(clock.getDelta());
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    setupDatGui();
    render();
};