// Author: Zhi Wei Willy Su
// Date: 
// Filename:

let renderer, scene, camera;
let orbitControls, controls, gui, levels, jsonLoaded = false, raycasting = false, resetAdded = false;
const objects = [], removed = [];

let Shaders = {}
Shaders.TextureShader = {
	name: 'TextureShader', //for debugging
	uniforms: {
        'textureA':{value: null}
	},
	
	vertexShader: 
	`
    uniform sampler2D textureA;
	varying vec2  vUv;

	void main() {
		vec3 pos = position;
        vec4 color = texture2D(textureA, uv);
        vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
	}`,

	fragmentShader:
	`
    uniform sampler2D textureA;
    varying vec2 vUv;
    vec3 color = vec3(0.0, 0.0, 1.0);         //local variable red

    void main() {
        gl_FragColor = texture2D(textureA, vUv);
    }`
};
Shaders.BoxShader = {
	name: 'BoxShader', //for debugging
	uniforms: {
        'textureA':{value: null}
	},
	
	vertexShader: 
	`
    uniform sampler2D textureA;
	varying vec2  vUv;

	void main() {
		vec3 pos = position;
        vec4 color = texture2D(textureA, uv);
        vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
	}`,

	fragmentShader:
	`
    uniform sampler2D textureA;
    varying vec2 vUv;
    vec3 color = vec3(0.0, 0.0, 1.0);         //local variable red

    void main() {
        gl_FragColor = texture2D(textureA, vUv);
    }`
};
const __shaderT1 = Shaders.TextureShader;
const __shaderT2 = Shaders.BoxShader;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFFFFF);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);
    scene.position.set(0, -10, 0);

    // document.addEventListener('mousemove', onMouseMove);
}

function setupCameraAndLight() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(0, 5, 50);
    camera.lookAt(scene.position);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0x666666));

  	light = new THREE.DirectionalLight(0x999999);
    light.position.set(10, 10, 5);
    light.castShadow = true;
    scene.add(light);
}

function createGeometry() {
    scene.add(new THREE.AxesHelper(10));

    textureMaterial = new THREE.ShaderMaterial(
        {
            uniforms: __shaderT1.uniforms,
            vertexShader: __shaderT1.vertexShader,
            fragmentShader: __shaderT1.fragmentShader
        }
    );

    __shaderT1.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/Wood_Texture.png');

    table = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 25, 0.5, 128, 128, 128), textureMaterial);
    table.castShadow = true;
    table.rotation.x = -Math.PI * 0.5;
    table.name = "Table";
    scene.add(table);
}

function setupDatGui() {
    controls = new function() {
        this.lockCamera = false;
        this.url = 'localhost';
        this.port = '5500';
        this.filename = 'levels.json';
        this.loadLevels = function(){
            loadLevels(this.filename);
        };
        this.levels = [];
        this.reset = function(){
            if(objects.length > 0){
                objects.length = 0;
                scene.traverse(function(o){
                    if(o.name == "iBlock")
                        scene.remove(o);
                })
            }

            switch(this.levels){
                case '0':
                for(let i = 0; i < 10; i++){
                    let block = parseJson(levels.obj);
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                }
                
                objects.forEach(o=>{
                    scene.add(o);
                })
            break;
            case '1':
                for(let i = 0; i < 10; i++){
                    let block = parseJson(levels.obj);
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                }
                
                objects.forEach(o=>{
                    scene.add(o);
                })

            break;
            case '2':
                for(let i = 0; i < 10; i++){
                    let block = parseJson(levels.obj);
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                }
                
                objects.forEach(o=>{
                    scene.add(o);
                })
            break;
            case '3':
                for(let i = 0; i < 10; i++){
                    let block = parseJson(levels.obj);
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                }
                
                objects.forEach(o=>{
                    scene.add(o);
                })
            break;
            case '4':
                for(let i = 0; i < 10; i++){
                    let block = parseJson(levels.obj);
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                }
                
                objects.forEach(o=>{
                    scene.add(o);
                })
            break;
            }
        };
    };

    gui = new dat.GUI();
    gui.add(controls, 'url');
    gui.add(controls, 'port');
    gui.add(controls, 'filename');
    gui.add(controls, 'loadLevels');
}

function loadLevels(url){
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = 'json';
    req.send();
    req.onload = function(){
        levels = req.response;
    };
    if(jsonLoaded) return;
    gui.add(controls, 'levels', {Easy: 0, Normal: 1, Hard: 2, Insane: 3, Extra: 4}).onFinishChange((e) =>{
        if(!resetAdded){
            gui.add(controls, 'lockCamera').name('Lock Camera');
            gui.add(controls, 'reset');
            resetAdded = true;
        };
        switch(e){
            case '0':
                if(objects.length > 0){ 
                    objects.forEach(o=>{
                        scene.remove(o);
                    })
                    objects.length = 0;
                }

                for(let i = 0; i < 10; i++){
                    let block = parseJson();
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                }
                objects.forEach(o=>{
                    scene.add(o);
                    console.log(o);
                })
            break;
            case '1':
                if(objects.length > 0){ 
                    objects.forEach(o=>{
                        scene.remove(o);
                    })
                    objects.length = 0;
                }

                for(let i = 0; i < 10; i++){
                    let block = parseJson();
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                    scene.add(block);
                }
            break;
            case '2':
                if(objects.length > 0){ 
                    objects.forEach(o=>{
                        scene.remove(o);
                    })
                    objects.length = 0;
                }

                for(let i = 0; i < 10; i++){
                    let block = parseJson();
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                    scene.add(block);
                }
            break;
            case '3':
                if(objects.length > 0){ 
                    objects.forEach(o=>{
                        scene.remove(o);
                    })
                    objects.length = 0;
                }

                for(let i = 0; i < 10; i++){
                    let block = parseJson();
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                    scene.add(block);
                }
            break;
            case '4':
                if(objects.length > 0){ 
                    objects.forEach(o=>{
                        scene.remove(o);
                    })
                    objects.length = 0;
                }

                for(let i = 0; i < 10; i++){
                    let block = parseJson();
                    block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(block);
                    scene.add(block);
                }
            break;
        }
    });
    jsonLoaded = true;
}

function parseJson(){
    boxMaterial = new THREE.ShaderMaterial(
        {
            uniforms: __shaderT2.uniforms,
            vertexShader: __shaderT2.vertexShader,
            fragmentShader: __shaderT2.fragmentShader
        }
    );

    __shaderT2.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/Iron_Block.png');

    let box = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 4, 4), 
        boxMaterial);
        box.castShadow = true;
        box.name = "iBlock";
    return box;
}

function render() {
    if(controls.lockCamera){
        orbitControls.enabled = false;
        raycasting = true;
    }
    else{
        orbitControls.enabled = true;
        raycasting = false;
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if(raycasting)
        document.addEventListener('mousedown', onMouseDown, false);
    else
        document.removeEventListener('mousedown', onMouseDown, false);
}

function onMouseDown(event){
    event.preventDefault();
    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(objects, true);
    console.log(intersects);
    if(intersects.length > 0){
        const intersect = intersects[0];
        if(intersect.object.name === "iBlock"){
            //console.log(intersect);
            intersect.object.enabled = false;
            scene.remove(intersect.object);
            objects.splice( objects.indexOf( intersect.object ), 1 );
            // objects.pop();
            removed.push(intersect.object);
            // console.log(objects);
            // console.log(intersects.length);
        }
        render();
    }
}

function onMouseMove(event){
    event.preventDefault();
    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(objects);
    if(intersects.length > 0){
        const intersect = intersects[0];
        console.log(intersect.object);
    }
    render();
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
}
