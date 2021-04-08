// Author: Zhi Wei Willy Su
// Date: 04/07/2021
// Filename: assignment-02.js

let renderer, scene, camera;
let orbitControls, controls, gui, levels, info;
let jsonLoaded = false, raycasting = false, resetAdded = false;
const objects = [], removed = [], min = [6, 10, 14, 18, 22];

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
Shaders.BoxShader1 = {
	name: 'BoxShader1', //for debugging
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
Shaders.BoxShader2 = {
	name: 'BoxShader2', //for debugging
	uniforms: {
        'textureB':{value: null}
	},
	
	vertexShader: 
	`
    uniform sampler2D textureB;
	varying vec2  vUv;

	void main() {
		vec3 pos = position;
        vec4 color = texture2D(textureB, uv);
        vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
	}`,

	fragmentShader:
	`
    uniform sampler2D textureB;
    varying vec2 vUv;
    vec3 color = vec3(0.0, 0.0, 1.0);         //local variable red

    void main() {
        gl_FragColor = texture2D(textureB, vUv);
    }`
};
Shaders.BoxShader3 = {
	name: 'BoxShader3', //for debugging
	uniforms: {
        'textureC':{value: null}
	},
	
	vertexShader: 
	`
    uniform sampler2D textureC;
	varying vec2  vUv;

	void main() {
		vec3 pos = position;
        vec4 color = texture2D(textureC, uv);
        vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
	}`,

	fragmentShader:
	`
    uniform sampler2D textureC;
    varying vec2 vUv;
    vec3 color = vec3(0.0, 0.0, 1.0);         //local variable red

    void main() {
        gl_FragColor = texture2D(textureC, vUv);
    }`
};
const __shaderT1 = Shaders.TextureShader;
const __shaderT2 = Shaders.BoxShader1;
const __shaderT3 = Shaders.BoxShader2;
const __shaderT4 = Shaders.BoxShader3;

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
    info = document.getElementById("extra");
    info.innerText = "";
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
    __shaderT2.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/Iron_Block.png');
    __shaderT3.uniforms.textureB.value = new THREE.TextureLoader().load('assets/textures/Gold_Block.png');
    __shaderT4.uniforms.textureC.value = new THREE.TextureLoader().load('assets/textures/Diamond_Block.png');

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
            clearScene();
            switch(this.levels){
                case '0':
                    generateBlocks();
                    info.innerText = objects.length.toString() + "/" + min[0];
                break;
                case '1':
                    generateBlocks();
                    info.innerText = objects.length.toString() + "/" + min[1]; 
                break;
                case '2':
                    generateBlocks();
                    info.innerText = objects.length.toString() + "/" + min[2]; 
                break;
                case '3':
                    generateBlocks();
                    info.innerText = objects.length.toString() + "/" + min[3]; 
                break;
                case '4':
                    generateBlocks();
                    info.innerText = objects.length.toString() + "/" + min[4]; 
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
                clearScene();
                generateBlocks();
                info.style.color = "red";
                info.innerText = objects.length.toString() + "/" + min[0]; 
            break;
            case '1':
                clearScene();
                generateBlocks();
                info.style.color = "red";
                info.innerText = objects.length.toString() + "/" + min[1]; 
            break;
            case '2':
                clearScene();
                generateBlocks();
                info.style.color = "red";
                info.innerText = objects.length.toString() + "/" + min[2]; 
            break;
            case '3':
                clearScene();
                generateBlocks();
                info.style.color = "red";
                info.innerText = objects.length.toString() + "/" + min[3]; 
            break;
            case '4':
                clearScene();
                generateBlocks();
                info.style.color = "red";
                info.innerText = objects.length.toString() + "/" + min[4]; 
            break;
        }
    });
    jsonLoaded = true;
}

function parseJson(){
    let box = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 4, 4));
    box.castShadow = true;
    box.name = "iBlock";

    return box;
}

function generateBlocks(){
    for(let i = 0; i < 10; i++){
        let block = parseJson();
        block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
        if(levels.boxPos[i][3] == "I"){
            block.material = new THREE.ShaderMaterial(
                {
                    uniforms: __shaderT2.uniforms,
                    vertexShader: __shaderT2.vertexShader,
                    fragmentShader: __shaderT2.fragmentShader
                }
            );
        }else if(levels.boxPos[i][3] == "G"){
            block.material = new THREE.ShaderMaterial(
                {
                    uniforms: __shaderT3.uniforms,
                    vertexShader: __shaderT3.vertexShader,
                    fragmentShader: __shaderT3.fragmentShader
                }
            );
        }
        else if(levels.boxPos[i][3] == "D"){
            block.material = new THREE.ShaderMaterial(
                {
                    uniforms: __shaderT4.uniforms,
                    vertexShader: __shaderT4.vertexShader,
                    fragmentShader: __shaderT4.fragmentShader
                }
            );
        }
        objects.push(block);
        scene.add(block);
    }
}

function clearScene(){
    if(objects.length > 0){ 
        objects.forEach(o=>{
            scene.remove(o);
        })
        objects.length = 0;
    }
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

    switch(controls.levels){
        case '0':
            if(objects.length > min[0])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '1':
            if(objects.length > min[1])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '2':
            if(objects.length > min[2])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '3':
            if(objects.length > min[3])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '4':
            if(objects.length > min[4])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
    }
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
            intersect.object.enabled = false;
            scene.remove(intersect.object);
            objects.splice( objects.indexOf( intersect.object ), 1 );
            removed.push(intersect.object);
            info.innerText = objects.length.toString() + "/" + min[0]; 
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
