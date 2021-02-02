// Author: Zhi Wei Willy Su
// Date: 27/01/2021
// Filename: 02-Zhi-WeiSu.js

//Global variables
let scene, renderer, camera, orbitControl, controls;
let plane;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x00DDFF);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);    
    camera.position.set(0, 25, 25);
    camera.lookAt(scene.position);
    scene.add(camera);

    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

    //add ambient lighting
    scene.add(new THREE.AmbientLight({color:0x353535}));

    //add spotlight
    let spotLight = new THREE.PointLight(0xFFFFFF);
    spotLight.position.set(-10, 20, -5);
    scene.add(spotLight);
}

function createGeometry() {
    let axes = new THREE.AxisHelper(20);
    scene.add(axes);

    //create plane material, geometry, and mesh
    let mat = new THREE.MeshLambertMaterial({ color: 0xFF3366 });
    let geo = new THREE.PlaneBufferGeometry(60, 20);
    plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    //create shape
    let geoCube = new THREE.BoxBufferGeometry(5, 5, 5);
    let matCube = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    cube = new THREE.Mesh(geoCube, matCube);
    scene.add(cube);
}

function setupDatGui(){
    // creating the object that will encapsulate of the variable that we are interested in
    controls = new function(){
        this.size = 2;
        this.shape = [];
        this.color = '#ffffff';
        this.addShape = function(){
            switch(this.shape){
                case 'sphere':
                    let s  = new THREE.Mesh(
                        new THREE.SphereBufferGeometry(this.size, this.size, this.size),
                        new THREE.MeshLambertMaterial({color: this.color}));

                        s.position.set(
                            plane.geometry.parameters.width * (0.5 - Math.random()), 
                            this.size/2, 
                            plane.geometry.parameters.height * (0.5 - Math.random()));

                    scene.add(s);
                break;
                case 'cube':
                    let c  = new THREE.Mesh(
                        new THREE.BoxBufferGeometry(this.size, this.size, this.size),
                        new THREE.MeshLambertMaterial({color: this.color}));

                        c.position.set(
                            plane.geometry.parameters.width * (0.5 - Math.random()), 
                            this.size/2, 
                            plane.geometry.parameters.height * (0.5 - Math.random()));
                    scene.add(c);
                break;
            }
        };

        this.showVariables = function(){
            console.log(`Size: ${this.size}`);
            console.log(`Shape: ${this.shape}`);
            console.log(`Color: ${this.color}`);
        }
    };

    let gui = new dat.GUI();
    guiGeo = gui.addFolder('Geometry');
    guiGeo.add(controls, 'size').min(2).max(6).step(1);
    guiGeo.add(controls, 'shape', ['sphere', 'cube']);
    guiGeo.addColor(controls, 'color');
    guiGeo.add(controls, 'addShape');
    guiGeo.add(controls, 'showVariables');

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