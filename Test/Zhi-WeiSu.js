// Author: Zhi Wei Willy Su
// Date: 03/05/2021
// Filename: Zhi-WeiSu.js  
// Test 1

// Global Variables
let scene, renderer, camera, orbitControl, gui, controls, spin = true;;
let tower, matTower, fans, matFan, plane, fanGroup, pointLight1, pointLight2;

// Function definitions
function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);    
    camera.position.set(10, 50, -50);
    camera.lookAt(scene.position);
    scene.add(camera);

    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    pointLight1 = new THREE.PointLight(0x99bbff);
    pointLight1.position.set(20, 40, 20);
    pointLight1.castShadow = true;
    scene.add(pointLight1);
    pointLight2 = new THREE.PointLight(0x99bbff);
    pointLight2.position.set(-20, 0, -20);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    let box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color:0xFFFFFF}));
    let box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color:0xFFFFFF}));
    box1.position.set(20, 40, 20);
    box2.position.set(-20, 0, -20);
    scene.add(box1, box2);
    scene.add(new THREE.AmbientLight(0xe6eeff));
}

function createGeometry() {
    let axes = new THREE.AxesHelper(20);
    axes.position.set(0, 27, -2);
    scene.add(axes);

    plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0xFF3366 }))
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    matTower = new THREE.MeshStandardMaterial({color:0xFF0000});
    tower = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 6, 30, 32, 32), matTower);
    tower.position.set(0, 15, 4);
    scene.add(tower);
    
    let axel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5, 32, 32), new THREE.MeshStandardMaterial({color:0xFF0000}));
    axel.rotation.x = 11;
    axel.position.set(0, 27,0);
    scene.add(axel);

    fanGroup = new THREE.Group();
    fanGroup.position.set(0,27,-1);
    matFan = new THREE.MeshLambertMaterial({color:0x0000ff});
    matFan.transparent = true;
    matFan.opacity = 0.5;
    let fan1 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.25, 4), matFan);
    let fan2 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.25, 4), matFan);
    let fan3 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.25, 4), matFan);
    fan1.rotation.y = 2;
    fan1.position.set(5,10,1);
    fan2.position.set(-10,0,0);
    fan3.rotation.y = 1;
    fan3.position.set(5,-7,-2);
    fanGroup.add(fan1, fan2, fan3);
    fanGroup.children.forEach(function(f){
        f.rotation.x = -1.5;
        f.rotation.z = 0.1;
    })
    fanGroup.rotation.x = 0.2;
    scene.add(fanGroup);
}

function setupGUI(){
    controls = new function(){
        this.toggleArm = function(){
            if(spin){
                spin = false;
            }
            else
                spin = true;
        };
        this.armColor = matFan.color.getStyle();
        this.armVisible = true;
        this.towerColor = matTower.color.getStyle();
        this.towerVisible = true;
        this.rotationSpeed = 0.01;
        this.spin;
    }

    gui = new dat.GUI();
    gui.add(controls, 'toggleArm').name('Toggle Arm');
    gui.addColor(controls, 'armColor').onChange(function (e){
       matFan.color = new THREE.Color(e);
    })
    gui.add(controls, 'armVisible').name('Arm Visible');
    gui.addColor(controls, 'towerColor').onChange(function (e){
        matTower.color = new THREE.Color(e);
    })
    gui.add(controls, 'towerVisible').name('Tower Visible');
    gui.add(controls, 'rotationSpeed').min(0.01).max(0.3).step(0.01);
}

function render() {
    if(spin){
        fanGroup.rotation.z += controls.rotationSpeed;
    }
    else
        fanGroup.rotation.z += 0;
    
    fanGroup.children.forEach(function(f){
        f.visible = controls.armVisible;
    })
    tower.visible = controls.towerVisible;
    pointLight1.lookAt(tower.position);
    pointLight2.lookAt(tower.position);

    requestAnimationFrame(render);
    orbitControl.autoRotate = true;
    orbitControl.update();
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    setupGUI();
    render();
};