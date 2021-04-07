// Author: Zhi Wei Willy Su
// Date: 
// Filename:

let renderer, scene, camera;
let orbitControls, controls, shaderMaterial, gui, levels, jsonLoaded = false, objects = [];

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
const __shaderT1 = Shaders.TextureShader;

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFFFFF);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);
    scene.position.set(0, -10, 0);

}

function setupCameraAndLight() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(0, 5, 50);
    camera.lookAt(scene.position);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0x666666));

  	light = new THREE.DirectionalLight(0xeeeeee);
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

    let table = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 25, 0.5, 128, 128, 128), textureMaterial);
    table.receiveShadow = true;
    table.rotation.x = -Math.PI * 0.5;
    scene.add(table);
}

function setupDatGui() {
    controls = new function() {
        this.url = 'localhost';
        this.port = '5500';
        this.filename = 'levels.json';
        this.loadLevels = function(){
            loadLevels(this.filename);
        };
        this.levels = [];
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
        switch(e){
            case '0':
                for(let i = 0; i < levels.boxPos.length; i++){
                    let mesh = parseJson(levels.obj);
                    mesh.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
                    objects.push(mesh);
                    scene.add(mesh);
                }
                
                objects.forEach(o=>{
                    console.log(o);
                })
            break;
            case '1':

            break;
            case '2':

            break;
            case '3':

            break;
            case '4':

            break;
        }
    });
    jsonLoaded = true;
}

function parseJson(obj){
    let mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 4, 4), 
        new THREE.MeshLambertMaterial({color: obj.color, transparent: obj.transparent, opacity: obj.opacity}));
    return mesh;
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();

}
