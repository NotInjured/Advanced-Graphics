//author:Narendra Pershad
//filename: 07-demo-voxel-painter.js
//date: February 26, 2021


let renderer, scene;
let pointLight, spotLight;
let windowWidth, windowHeight;


function init(){
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( 0x227700 );
    renderer.shadowMap.enabled = true;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize( windowWidth, windowHeight );
    document.body.appendChild( renderer.domElement );
}

function setupCameraAndLight(){
    scene.add(new THREE.AmbientLight( 0x222222 , 0.3));

    pointLight = new THREE.PointLight( 0x77ffff, 2, 50 );
    pointLight.position.set( -5, 5, -5 );
    pointLight.castShadow = true;
    scene.add( pointLight );

    spotLight = new THREE.SpotLight( 0xffaaff );
    spotLight.position.set( 5, 10, -5 );
    spotLight.castShadow=true;
    scene.add( spotLight );

    let directionalLight = new THREE.DirectionalLight( 0xffaa77, 0.5 );
    directionalLight.position.set( 0, 10, 3 );
    directionalLight.castShadow=true;
    scene.add( directionalLight );
}

function createGeometry(){
    scene.add( new THREE.AxesHelper( 20) );
    // create the ground plane
    let geo = new THREE.PlaneBufferGeometry(20, 20);
    let mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let plane = new THREE.Mesh( geo, mat );
        

}

function render(){
    requestAnimationFrame( render );

}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    render();
}