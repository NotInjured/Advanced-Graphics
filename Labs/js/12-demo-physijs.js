//author:Narendra Pershad
//filename: 04-using-materials.js
//date" January 21, 2020

let renderer, scene, camera;
let orbitControl, light1, teapot;

let ambientLight, pointLight, spotLight, directionalLight, rectangleLight, hemisphereLight ;

Physijs.scripts.worker = '../node_modules/physijs_worker.js';
Physijs.scripts.ammo = '../node_modules/ammo.js';

function init(){
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -50, 0));
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setClearColor( 0x0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function setupCameraAndLight(){
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( -10, 15, 10 );
    camera.lookAt( scene.position );

    orbitControl = new THREE.OrbitControls( camera, renderer.domElement );

    ambientLight = new THREE.AmbientLight( 0x404040, 1);
    scene.add(ambientLight);

    let sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );

    pointLight = new THREE.PointLight( 0x77ffff, 2, 100 );
    pointLight.position.set( -7, 10, -7 );
    pointLight.castShadow=true
    scene.add( pointLight );

    spotLight = new THREE.SpotLight( 0xffaaff, 2, 0, Math.PI * 0.2 );
    spotLight.position.set( 5, 20, -5 );
    spotLight.castShadow=true;
    scene.add( spotLight );
 
    directionalLight = new THREE.DirectionalLight( 0xffaa77, 0.5 );
    directionalLight.position.set( 0, 10, 3 );
    directionalLight.castShadow=true;
    scene.add( directionalLight );
}

function createGeometry(){
    scene.add( new THREE.AxesHelper(20) );

    // create the ground plane
    let geo = new THREE.BoxBufferGeometry(60, 1, 40);
    let mat = new THREE.MeshPhysicalMaterial({ color: 0xdd9999 });
    let p_mat = Physijs.createMaterial(
        mat,                //threejs material
        0.9,                //friction
        0.3                 //restitution
    )
    mesh = new Physijs.BoxMesh(
        geo,                //threejs geometry
        p_mat,              //physijs material
        0);                 //don't want to move so mass = 0   
    mesh.receiveShadow=true;
    scene.add( mesh );
    createStones(100);
    let last = scene.children[scene.children.length - 1];
    last.rotation.z = 0.4;
    last.__dirtyRotation = true;
}

function createStones(qty = 10){
    let angle = 1.5 * Math.PI, step = 0.12;
    const origin = new THREE.Vector3(0, 1.5, 0);
    for(let i = 0; i< qty;i++){
        let col = Math.random() * 0xff  + 0x666600; // 0xff6666;
        let m = new THREE.MeshLambertMaterial({color: col, transparent:true, opacity:0.8});
        let p_m = Physijs.createMaterial(m);

        let geo = new THREE.BoxBufferGeometry( 0.2, 3, 1);
        let stone = new Physijs.BoxMesh(geo, p_m);

        let x = angle * Math.cos(angle);
        let y = 3.2;
        let z = angle * Math.sin(angle);
        stone.position.set(x,y,z);
        stone.lookAt(origin);
        scene.add(stone);
        angle += step;        
    }
}

function setupDatGui(){
    let controls = new function(){
        this.ambientIntensity = ambientLight.intensity;
        this.ambientVisible = ambientLight.visible;
        this.ambientColor = ambientLight.color.getStyle();

        this.pointIntensity = pointLight.intensity;
        this.pointVisible = pointLight.visible;
        this.pointColor = pointLight.color.getStyle();

        this.spotIntensity = spotLight.intensity;
        this.spotVisible = spotLight.visible;
        this.spotColor = spotLight.color.getStyle();

        this.directionalIntensity = directionalLight.intensity;
        this.directionalVisible = directionalLight.visible;
        this.directionalColor = directionalLight.color.getStyle();


    };
    let gui = new dat.GUI();
    let ambi = gui.addFolder('Ambient Light');
    ambi.add(controls, 'ambientIntensity', 0, 3, 0.1).onChange((e) => { ambientLight.intensity = e; });
    ambi.addColor(controls, 'ambientColor').onChange((e) => { ambientLight.color = new THREE.Color(e); });
    ambi.add(controls, 'ambientVisible').onChange((e) => { ambientLight.visible = e;  });

    let point = gui.addFolder('Point Light');
    point.add(controls, 'pointIntensity', 0, 3, 0.1).onChange((e) => { pointLight.intensity = e; });
    point.addColor(controls, 'pointColor').onChange((e) => { pointLight.color = new THREE.Color(e);  });
    point.add(controls, 'pointVisible').onChange((e) => { pointLight.visible = e;  });

    let spot = gui.addFolder('Spot Light');
    spot.add(controls, 'spotIntensity', 0, 3, 0.1).onChange((e) => { spotLight.intensity = e; });
    spot.addColor(controls, 'spotColor').onChange((e) => {  spotLight.color = new THREE.Color(e);  });
    spot.add(controls, 'spotVisible').onChange((e) => { spotLight.visible = e;  });

    let direction = gui.addFolder('Directional Light');
    direction.add(controls, 'directionalIntensity', 0, 3, 0.1).onChange((e) => {  directionalLight.intensity = e;  });
    direction.addColor(controls, 'directionalColor').onChange((e) => { directionalLight.color = new THREE.Color(e);  });
    direction.add(controls, 'directionalVisible').onChange((e) => {  directionalLight.visible = e;  });



}

function render(){
    requestAnimationFrame( render );
    orbitControl.update();
    renderer.render( scene, camera );
    scene.simulate(undefined, 1);
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
}