// Author: Zhi Wei Willy Su
// Date: 02-13-2020
// Filename: assignment01
// Assignment 1 - Solar Systems

// Global Variables
let scene, renderer, camera;
let gui, trackballControls, clock, controls;
let plane;
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto, moonEarth, moonJupiter1,moonJupiter2,moonJupiter3,moonJupiter4,moonJupiter5, moonSaturn1, moonSaturn2, moonSaturn3;
let sunMat, mercuryMat, venusMat, earthMat, marsMat, jupiterMat, saturnMat, uranusMat, neptuneMat, plutoMat, moonMat;
let sunGeo, mercuryGeo, venusGeo, earthGeo, marsGeo, jupiterGeo, saturnGeo, uranusGeo, neptuneGeo, plutoGeo, moonGeo;
let t = 0.01, mE = 0, mJ1 = 0, mJ2 = 0, mJ3 = 0, mJ4 = 0, mJ5 = 0, mS1= 0, mS2 = 0, mS3 = 0;
let solarSystem, earthGroup, jupiterGroup, saturnGroup;
let planets, moons;

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
    renderer.shadowCameraFar = 1000;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 2048;
    renderer.shadowMapHeight = 2048;

    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);    
    camera.position.set( 0, 300, 50);
    camera.lookAt(scene.position);
    clock = new THREE.Clock();//needed for the trackballControl
    trackballControl = new THREE.TrackballControls(camera, renderer.domElement);

    // add hemisphere lighting
    let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
    hemisphereLight.castShadow = true;
    hemisphereLight.position.set(0, 500, 0);
    //scene.add(hemisphereLight);

    // add directional lighting
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.castShadow = true;
    directionalLight.position.set(40, 60, -10);
    let dirHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
    //directionalLight.add(dirHelper);

    //scene.add(directionalLight);

    let pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.castShadow = true;
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // add subtle ambient lighting
    scene.add(new THREE.AmbientLight(0x595959, 1));

    controls = new function(){
        this.planetRotationSpeed = t;
    }

    gui = new dat.GUI();
    gui.add(controls, 'planetRotationSpeed', 0.01, 1, 0.01);
}

function createGeometry() {
    let axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // create planets
    sunGeo = new THREE.SphereBufferGeometry(12, 32, 32);
    sunMat = new THREE.MeshLambertMaterial({color:0xDF9200})
    sun = new THREE.Mesh(sunGeo, sunMat);

    // mercury
    mercuryGeo = new THREE.SphereBufferGeometry(1, 32, 32);
    mercuryMat = new THREE.MeshPhongMaterial({color:0x322000})
    mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
    mercury.position.x = 29;

    // venus
    venusGeo = new THREE.SphereBufferGeometry(3, 32, 32);
    venusMat = new THREE.MeshPhongMaterial({color:0x8E566E})
    venus = new THREE.Mesh(venusGeo, venusMat);
    venus.position.x = 54;

    // create earth and moon in a group
    earthGroup = new THREE.Group();
    earthGeo = new THREE.SphereBufferGeometry(3, 32, 32);
    earthMat = new THREE.MeshPhongMaterial({color:0x70AAF9})
    earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.x = 75;
    

    moonGeo = new THREE.SphereBufferGeometry(0.75, 32, 32);
    moonMat = new THREE.MeshPhongMaterial({color: 0xA9CEFF});
    moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.x = 80;
    earthGroup.position.set(75,0,0);

    earthGroup.add(earth);
    earthGroup.add(moon);

    // mars
    marsGeo = new THREE.SphereBufferGeometry(1.5, 32, 32);
    marsMat = new THREE.MeshPhongMaterial({color:0xFF8327});
    mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.x = 103;
    // jupiter group
    jupiterGroup = new THREE.Group();
    jupiterGeo = new THREE.SphereBufferGeometry(10, 32, 32);
    jupiterMat = new THREE.MeshPhongMaterial({color:0xFF9803});
    jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
    jupiter.position.x = 177;

    moonJupiter1 = new THREE.Mesh(moonGeo, moonMat);
    moonJupiter2 = new THREE.Mesh(moonGeo, moonMat);
    moonJupiter3 = new THREE.Mesh(moonGeo, moonMat);
    moonJupiter4 = new THREE.Mesh(moonGeo, moonMat);
    moonJupiter5 = new THREE.Mesh(moonGeo, moonMat);

    moonJupiter1.position.x = jupiter.position.x + 28;
    moonJupiter1.position.y = -5;

    moonJupiter2.position.x = jupiter.position.x + 30;
    moonJupiter2.position.y = -2;

    moonJupiter3.position.x = jupiter.position.x + 15;

    moonJupiter4.position.x = jupiter.position.x + 35;
    moonJupiter4.position.y = 4;

    moonJupiter5.position.x = jupiter.position.x + 38;
    moonJupiter5.position.y = 6;

    jupiterGroup.add(jupiter);
    jupiterGroup.add(moonJupiter1);
    jupiterGroup.add(moonJupiter2);
    jupiterGroup.add(moonJupiter3);
    jupiterGroup.add(moonJupiter4);
    jupiterGroup.add(moonJupiter5);

    saturnGeo = new THREE.SphereBufferGeometry(9, 32, 32);
    saturnMat = new THREE.MeshPhongMaterial({color:0x5F273C});
    saturn = new THREE.Mesh(saturnGeo, saturnMat);
    saturn.position.x = 243;

    moonSaturn1 = new THREE.Mesh(moonGeo, moonMat);
    moonSaturn2 = new THREE.Mesh(moonGeo, moonMat);
    moonSaturn3 = new THREE.Mesh(moonGeo, moonMat);

    moonSaturn1.position.x = saturn.position.x + 20;
    moonSaturn1.position.y = -3

    moonSaturn2.position.x = saturn.position.x + 23;

    moonSaturn3.position.x = saturn.position.x + 30;
    moonSaturn2.position.y = 2

    saturnGroup = new THREE.Group();
    saturnGroup.add(saturn);
    saturnGroup.add(moonSaturn1);
    saturnGroup.add(moonSaturn2);
    saturnGroup.add(moonSaturn3);

    uranusGeo = new THREE.SphereBufferGeometry(4, 32, 32);
    uranusMat = new THREE.MeshPhongMaterial({color:0x66E8FF});
    uranus = new THREE.Mesh(uranusGeo, uranusMat);
    uranus.position.x = 287;

    neptuneGeo = new THREE.SphereBufferGeometry(4, 32, 32);
    neptuneMat = new THREE.MeshPhongMaterial({color:0x00118E});
    neptune = new THREE.Mesh(neptuneGeo, neptuneMat);
    neptune.position.x = 449;

    plutoGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
    plutoMat = new THREE.MeshPhongMaterial({color: 0x66A7FF});
    pluto = new THREE.Mesh(plutoGeo, plutoMat);
    pluto.position.x = 590;

    // add planets to an array of planets
    planets = new Array();
    planets[0] = mercury;
    planets[1] = venus;
    planets[2] = earth;
    planets[3] = mars;
    planets[4] = jupiter;
    planets[5] = saturn;
    planets[6] = uranus;
    planets[7] = neptune;
    planets[8] = pluto;

    // add moons to an array of moons
    moons = new Array();
    moons[0] = moon;
    moons[1] = moonJupiter1;
    moons[2] = moonJupiter2;
    moons[3] = moonJupiter3;
    moons[4] = moonJupiter4;
    moons[5] = moonJupiter5;
    moons[6] = moonSaturn1;
    moons[7] = moonSaturn2;
    moons[8] = moonSaturn3;

    // add all planets into a solar system group
    solarSystem = new THREE.Group();
    solarSystem.add(sun);
    solarSystem.add(mercury);
    solarSystem.add(venus);
    solarSystem.add(earthGroup);
    solarSystem.add(mars);
    solarSystem.add(jupiterGroup);
    solarSystem.add(saturnGroup);
    solarSystem.add(uranus);
    solarSystem.add(neptune);
    solarSystem.add(pluto);
    solarSystem.position.set(0,0,0);

    scene.add(solarSystem);
    
}

function render() {
    requestAnimationFrame(render);
    t += controls.planetRotationSpeed;

    sun.rotation.y += 0.005;
    mercury.rotation.y += 0.0014076;
    venus.rotation.y -= 0.0058325;
    earth.rotation.y += 0.0000239;
    moon.rotation.y += 0.0006557;
    mars.rotation.y += 0.0000246;
    jupiter.rotation.y += 0.0000099;
    saturn.rotation.y += 0.0000107;
    uranus.rotation.y -= 0.0000172;
    neptune.rotation.y += 0.0000161;
    pluto.rotation.y -= 0.0001533;

    mercury.position.x = 29*Math.cos(t) + 0;
    mercury.position.z = 29*Math.sin(t) + 0;

    venus.position.x = 54*Math.cos(t*0.74) + 0;
    venus.position.z = 54*Math.sin(t*0.74) + 0;

    earth.position.x = 75*Math.cos(t*0.63) - 75;
    earth.position.z = 75*Math.sin(t*0.63) + 0;
    moon.position.x = 80*Math.cos(t*0.63) - 75;
    moon.position.z = 80*Math.sin(t*0.63) + 0;

    mars.position.x = 103*Math.cos(t*0.51) + 0;
    mars.position.z = 103*Math.sin(t*0.51) + 0;

    jupiter.position.x = 177*Math.cos(t*0.27) + 0;
    jupiter.position.z = 177*Math.sin(t*0.27) + 0;
    moonJupiter1.position.x = 205*Math.cos(t*0.27) + 0;
    moonJupiter1.position.z = 205*Math.sin(t*0.27) + 0;
    moonJupiter2.position.x = 207*Math.cos(t*0.27) + 0;
    moonJupiter2.position.z = 207*Math.sin(t*0.27) + 0;
    moonJupiter3.position.x = 190*Math.cos(t*0.27) + 0;
    moonJupiter3.position.z = 190*Math.sin(t*0.27) + 0;
    moonJupiter4.position.x = 210*Math.cos(t*0.27) + 0;
    moonJupiter4.position.z = 218*Math.sin(t*0.27) + 0;
    moonJupiter5.position.x = 213*Math.cos(t*0.27) + 0;
    moonJupiter5.position.z = 223*Math.sin(t*0.27) + 0;

    saturn.position.x = 243*Math.cos(t*0.2) + 0;
    saturn.position.z = 243*Math.sin(t*0.2) + 0;
    moonSaturn1.position.x = 263*Math.cos(t*0.2) + 0;
    moonSaturn1.position.z = 263*Math.sin(t*0.2) + 0;
    moonSaturn2.position.x = 266*Math.cos(t*0.2) + 0;
    moonSaturn2.position.z = 266*Math.sin(t*0.2) + 0;
    moonSaturn3.position.x = 273*Math.cos(t*0.2) + 0;
    moonSaturn3.position.z = 273*Math.sin(t*0.2) + 0;

    uranus.position.x = 287*Math.cos(t*0.14) + 0;
    uranus.position.z = 287*Math.sin(t*0.14) + 0;

    neptune.position.x = 449*Math.cos(t*0.11) + 0;
    neptune.position.z = 449*Math.sin(t*0.11) + 0;

    pluto.position.x = 590*Math.cos(t*0.10) + 0;
    pluto.position.z = 590*Math.sin(t*0.10) + 0;

    trackballControl.update(clock.getDelta());
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    render();
};