// Author: Zhi Wei Willy Su
// Date: 08/02/2021
// Filename: 03-Zhi-WeiSu.js

//Global variables
let renderer, scene, camera;
let orbitControl, controls;
let ambientLight, spotLight, pointLight, directionalLight, rectLight, hemisphereLight;

function init(){
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true; //shadows
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function setupCameraAndLight(){
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( -40, 30, 40 );
    camera.lookAt( scene.position );

    orbitControl = new THREE.OrbitControls( camera, renderer.domElement );

    ambientLight = new THREE.AmbientLight( 0x404040);
    scene.add(ambientLight);

    spotLight = new THREE.SpotLight( 0xFF0000);
    spotLight.castShadow = true;
    scene.add(spotLight);

    pointLight = new THREE.PointLight(0x00FF00);
    pointLight.castShadow =  true;
    scene.add(pointLight);

    directionalLight = new THREE.DirectionalLight(0x0000FF);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    rectLight = new THREE.RectAreaLight(0x808080);
    rectLight.position.set(5, 5, 0);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    hemisphereLight = new THREE.HemisphereLight(0x3300AA, 0x00FF00);
    scene.add(hemisphereLight);

}

function createGeometry(){
    scene.add( new THREE.AxesHelper(20) );

    // create the ground plane
    let geo = new THREE.PlaneBufferGeometry(200, 200);
    let mat = new THREE.MeshStandardMaterial({color: 0x808080});
    let plane = new THREE.Mesh( geo, mat );
    plane.receiveShadow=true; //enables an object to receive shadow
        
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    scene.add( plane );

    geo = new THREE.BoxGeometry( 8, 1, 8 );
    mat = new THREE.MeshPhysicalMaterial( { color: 0xaabbaa } );
    mesh = new THREE.Mesh( geo, mat );
    mesh.position.set(0, 5, 0);
    mesh.castShadow=true; //allow object to cast shadow
    scene.add( mesh );
}

function setupDatGui(){
    controls = new function(){
        this.ambientIntensity = ambientLight.intensity;//this is a comment
        this.ambientVisible = ambientLight.visible;
        this.ambientColor = ambientLight.color.getStyle();

        this.spotIntensity = spotLight.intensity;
        this.spotVisible = spotLight.visible;
        this.spotColor = spotLight.color.getStyle();

        this.pointIntensity = pointLight.intensity;
        this.pointVisible = pointLight.visible;
        this.pointColor = pointLight.color.getStyle();

        this.dirIntensity = directionalLight.intensity;
        this.dirVisible = directionalLight.visible;
        this.dirColor = directionalLight.color.getStyle();

        this.rectIntensity = rectLight.intensity;
        this.rectVisible = rectLight.visible;
        this.rectColor = rectLight.color.getStyle();

        this.hemiIntensity = hemisphereLight.intensity;
        this.hemiVisible = hemisphereLight.visible;
        this.hemiSkyColor = hemisphereLight.color.getStyle()
        this.hemiGroundColor = hemisphereLight.groundColor.getStyle();

    };

    let gui = new dat.GUI();

    // AmbientLight controls
    let ambi = gui.addFolder('Ambient Light');
    ambi.add(controls, 'ambientIntensity', 0, 3, 0.1).onChange((e) => {
        ambientLight.intensity = e;
    });
    ambi.addColor(controls, 'ambientColor').onChange(function(e){
        ambientLight.color = new THREE.Color(e);
    });
    ambi.add(controls, 'ambientVisible').name('Disable');

    // SpotLight controls
    let spot = gui.addFolder('Spotlight');
    spot.add(controls, 'spotIntensity', 0, 3, 0.1).onChange((e) =>{
        spotLight.intensity = e;
    })
    spot.addColor(controls, 'spotColor').onChange(function(e){
        spotLight.color = new THREE.Color(e);
    })
    spot.add(controls, 'spotVisible').name('Dsiable');

    // PointLight controls
    let point = gui.addFolder('PointLight');
    point.add(controls, 'pointIntensity', 0, 3, 0.1).onChange((e)=>{
        pointLight.intensity = e;
    })
    point.addColor(controls, 'pointColor').onChange(function(e){
        pointLight.color = new THREE.Color(e);
    })
    point.add(controls, 'pointVisible').name('Disable');

    // DirectionalLight controls
    let dir = gui.addFolder('DirectionalLight');
    dir.add(controls, 'dirIntensity', 0, 3, 0.1).onChange((e)=>{
        directionalLight.intensity = e;
    })
    dir.addColor(controls, 'dirColor').onChange(function(e){
        directionalLight.color = new THREE.Color(e);
    })
    dir.add(controls, 'dirVisible').name('Disable');

    // RectAreaLight controls
    let rect = gui.addFolder('RectAreaLight');
    rect.add(controls, 'rectIntensity', 0, 3, 0.1).onChange((e)=>{
        rectLight.intensity = e;
    })
    rect.addColor(controls, 'rectColor').onChange(function(e){
        rectLight.color = new THREE.Color(e);
    })
    rect.add(controls, 'rectVisible').name('Disable');

    // HemiSphereLight controls
    let hemi = gui.addFolder('HemiSphereLight');
    hemi.add(controls, 'hemiIntensity', 0, 3, 0.1).onChange((e)=>{
        hemisphereLight.intensity = e;
    })
    hemi.addColor(controls, 'hemiSkyColor').onChange(function(e){
        hemisphereLight.color = new THREE.Color(e);
    })
    hemi.addColor(controls, 'hemiGroundColor').onChange(function(e){
        hemisphereLight.groundColor = new THREE.Color(e);
    })
    hemi.add(controls, 'hemiVisible').name('Disable');

}

function render(){
    ambientLight.visible = controls.ambientVisible;
    spotLight.visible = controls.spotVisible;
    pointLight.visible = controls.pointVisible;
    directionalLight.visible = controls.dirVisible;
    rectLight.visible = controls.rectVisible;
    hemisphereLight.visible = controls.hemiVisible;


    requestAnimationFrame( render );
    orbitControl.update();
    renderer.render( scene, camera );
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
}