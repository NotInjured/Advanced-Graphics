// Author: Zhi Wei Willy Su
// Date: 03/07/2021
// Filename: 07-Zhi-WeiSu.js
// Lab 7 - Voxel Painter

// Global Variables
let scene, renderer, camera, orbitControl, controls;
let plane, miniPlanes, miniPlane, cubeHelper, cubeMat, cubeGeo, cube;
let objects = [], shift = false;;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function definitions
function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x404040);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);    
    camera.position.set(-25, 25, 25);
    camera.lookAt(scene.position);
    scene.add(camera);

    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    let dirLight = new THREE.DirectionalLight(0x262626);
    scene.add(dirLight);
    scene.add(new THREE.HemisphereLight(0x262626));
}

function createGeometry() {
    plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(40, 40), new THREE.MeshLambertMaterial({ color: 0xFFFFFF, visible: false }));
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);
    objects.push(plane);
    scene.add(new THREE.AxesHelper(20));
    scene.add(new THREE.GridHelper(40, 10, 10, 0x990000));

    const cubeGeo = new THREE.BoxGeometry(4, 4, 4);
    cubeMat = new THREE.MeshBasicMaterial({color:0xFFFFFF, opacity: 0.5, transparent:true});
    cubeHelper = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(cubeHelper);
}

function createMiniPlanes(){
    miniPlanes = [];
    let step = 4;

    for(let i = 0; i < 10; i++){
        miniPlanes[i] = [];
        for(let j = 0; j < 10; j++){
            miniPlanes[i][j] = new THREE.Mesh(new THREE.PlaneBufferGeometry(4, 4), new THREE.MeshLambertMaterial({ color: 0x000000, visible: false }));
            miniPlanes[i][j].rotation.x = -0.5 * Math.PI;
        }
    }
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            miniPlanes[i][j].position.set(-18+(j*step), 1, -18+(i*step));
            scene.add(miniPlanes[i][j]);
        }
    }
    miniPlanes.forEach(p =>{
        p.forEach(o =>{
            objects.push(o);
        })
    })
    console.log(objects);
}

function setupDatGui(){
    controls = new function(){
        this.lockCamera = false;
    }

    let gui = new dat.GUI();
    gui.add(controls, 'lockCamera').name('Lock Camera');
}

function render() {
    if(controls.lockCamera)
        orbitControl.enabled = false;
    else
        orbitControl.enabled = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function onMouseMove(event){
    event.preventDefault();
    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(objects);
    if(intersects.length > 0){
        const intersect = intersects[0];
        cubeHelper.position.copy(intersect.point).add(intersect.face.normal);
        cubeHelper.position.divideScalar(4).floor().multiplyScalar(4).addScalar(2);
    }
    render();
}

function onMouseDown(event){
    event.preventDefault();
    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(objects);
    if(intersects.length > 0){
        const intersect = intersects[0];

        if(shift){
            if(intersect.object !== plane || intersect.object !== miniPlanes){
                scene.remove(intersect.object);
                object.splice(objects.indexOf(intersect.object), 1);
            }
        }
        else{
            const voxel = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), cubeMat);
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(4).floor().multiplyScalar(4).addScalar(2);
            scene.add(voxel);
            objects.push(voxel);
            console.log(objects);
        }
        render();
    }
}

function onKeyDown(event){
    switch(event.keyCode){
        case 16: shift = true; break;
    }
}

function onKeyUp(event){
    switch(event.keyCode){
        case 16: shift = false; break;
    }
}

window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    createMiniPlanes();
    setupDatGui();
    render();
};