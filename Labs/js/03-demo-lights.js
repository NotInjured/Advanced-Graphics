// Author: Zhi Wei Willy Su
// Date: 03/02/2021
// Filename: 03-demo-lights.js

//Global variables
let renderer, scene, camera;
let orbitControl;
let ambientLight;
let angle=0;
let radius = 10, speed = 0.001, height = 30;
const spot1 = createSpotLight( 0xff7700 );
const spot2 = createSpotLight( 0x00ff77 );
const spot3 = createSpotLight( 0x7700ff );

function init(){
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true; //shadows
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setClearColor( 0x0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function setupCameraAndLight(){
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( -40, 30, 40 );
    camera.lookAt( scene.position );

    orbitControl = new THREE.OrbitControls( camera, renderer.domElement );

    ambientLight = new THREE.AmbientLight( 0x333333, 1);
    scene.add(ambientLight);

    scene.add( spot1 );
    scene.add(new THREE.SpotLightHelper(spot1));
    scene.add( spot2 );
    scene.add(new THREE.SpotLightHelper(spot2));
    scene.add( spot3 );
    scene.add(new THREE.SpotLightHelper(spot3));
}

function createSpotLight(color){
    const light = new THREE.SpotLight( color, 10 );

    light.castShadow = true;
    light.angle = 0.2;
    light.penumbra = 0.35;
    light.decay = 2;
    light.distance = 50;
    return light;
}

function createGeometry(){
    scene.add( new THREE.AxesHelper(20) );

    // create the ground plane
    let geo = new THREE.PlaneBufferGeometry(200, 200);
    let mat = new THREE.MeshStandardMaterial({color: 0x808080});
    let mesh = new THREE.Mesh( geo, mat );
    mesh.receiveShadow=true; //enables an object to receive shadow
        
    // rotate and position the plane
    mesh.rotation.x = -0.5 * Math.PI;
    scene.add( mesh );

    geo = new THREE.BoxGeometry( 8, 1, 8 );
    mat = new THREE.MeshPhysicalMaterial( { color: 0xaabbaa } );
    mesh = new THREE.Mesh( geo, mat );
    mesh.position.set(0, 5, 0);
    mesh.castShadow=true; //allow object to cast shadow
    scene.add( mesh );
}

function setupDatGui(){
    let controls = new function(){
        this.ambientIntensity = ambientLight.intensity;//this is a comment
        this.ambientVisible = ambientLight.visible;
        this.ambientColor = ambientLight.color.getStyle();

        this.height = height;
        this.radius = radius;
        this.speed = speed;

    };
    let gui = new dat.GUI();
    let ambi = gui.addFolder('Ambient Light');
    ambi.add(controls, 'ambientIntensity', 0, 3, 0.1).onChange((e) => {
        ambientLight.intensity = e;
    });
    gui.add(controls, 'height').min(10).max(50).onChange((e) => {height = e;});
    gui.add(controls, 'radius').min(8).max(20).onChange((e) => {radius = e;});
    gui.add(controls, 'speed').min(0).max(0.01).onChange((e) => {speed = e;});
}

function moveLights(){
    angle += speed;
    let x = radius * Math.sin(angle);
    let z = radius * Math.cos(angle);
    spot1.position.set(x, height, z);

    x = radius * Math.sin(angle * 2 + 2);
    z = radius * Math.cos(angle + 2);
    spot2.position.set(x, height, z);

    x = radius * Math.sin(angle + 4);
    z = radius * Math.cos(angle * 2 + 4);
    spot3.position.set(x, height, z);
}

function render(){
    requestAnimationFrame( render );
    orbitControl.update();
    moveLights();
    renderer.render( scene, camera );
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
}