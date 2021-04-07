// Author: Zhi Wei Willy Su
// Date: 
// Filename: 09-Zhi-WeiSu.js

let renderer, scene, camera;
let orbitControls, controls, shaderMaterial;

let Shaders = {}
    Shaders.BasicShader1 = {
	name: 'BasicShader1', //for debugging
	uniforms: {
		'time': { type: 'f', value: 0.0 }
	},
	
	vertexShader: 
	`
    uniform float time;
	varying vec2  vUv;

	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
	}`,

	fragmentShader:
	`
    varying vec2 vUv;
	vec3 color = vec3(1.0, 0.0, 0.0); 
	    void main() {
		    gl_FragColor = vec4( color,  0.75);
	    }`
    };
    Shaders.BasicShader2 = {
        name: 'BasicShader2',
        uniforms: {
            'time': { type: 'f', value: 0.0 }
        },
        
        vertexShader: 
        `uniform float time;
        varying vec2  vUv;
        void main() {
            vec3 pos = position;
            // pos.z += step(0.0, sin( pos.y));
            // pos.z += 0.4 * sin( time * 2.0 + pos.x ) + 0.2 * sin( time * 2.0 + pos.y );
            pos.y += sin(pos.y*time);
            pos.y += cos(pos.y*time);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,
    
        fragmentShader:
        `varying vec2 vUv;
         vec3 color = vec3(1.0, 1.0, 0.0);         //local variable red
            void main() {
                gl_FragColor = vec4( vec3(vUv, 1.0),  1.0 );    //alpha is 0.75
            }`
    };
    Shaders.BasicShader3 = {
        name: 'BasicShader2',
        uniforms: {
            'time': { type: 'f', value: 0.0 }
        },
        
        vertexShader: 
        `uniform float time;
        varying vec2  vUv;
        void main() {
            vec3 pos = position;
            // pos.z += sin( pos.y );
            // pos.z = step(0.0, sin( pos.x));
            pos.z += step(0.0, sin( pos.y));
            // pos.z += sin( pos.y * 0.5 );
            // pos.z += sin( pos.y + time);
            pos.z += 0.4 * sin( time * 2.0 + pos.x ) + 0.2 * sin( time * 2.0 + pos.y );
            // pos.x += sin( position.z );
            // pos.y += sin( position.x );
            // pos.z += sin( position.y );
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,
    
        fragmentShader:
        `varying vec2 vUv;
         vec3 color = vec3(1.0, 1.0, 0.0);         //local variable red
            void main() {
                gl_FragColor = vec4( vec3(vUv, 1.0),  1.0 );    //alpha is 0.75
            }`
    };

const clock = new THREE.Clock();
const __shaderB1 = Shaders.BasicShader1;
const __shaderB2 = Shaders.BasicShader2;


function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x004400);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);
    scene.position.set(0, -10, 0);

}

function setupCameraAndLight() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(-30, 10, 30);
    camera.lookAt(scene.position);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0x666666));

  	light = new THREE.DirectionalLight(0xeeeeee);
    light.position.set(20, 60, 10);
    light.castShadow = true;
    light.target = scene;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 200;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    let hemiSphereLight = new THREE.HemisphereLight(0x7777cc, 0x00ff00, 0.6);//skycolor, groundcolor, intensity
    hemiSphereLight.position.set(0, 100, 0);
    scene.add(hemiSphereLight);
}

function createGeometry() {

    scene.add(new THREE.AxesHelper(100));

    basicShaderMaterial = new THREE.ShaderMaterial(
        {
            uniforms: __shaderB1.uniforms,
            vertexShader: __shaderB1.vertexShader,
            fragmentShader: __shaderB1.fragmentShader,
            transparent: true
        }
    );

    basicShaderMaterial2 = new THREE.ShaderMaterial(
        {
            uniforms: __shaderB2.uniforms,
            vertexShader: __shaderB2.vertexShader,
            fragmentShader: __shaderB2.fragmentShader,
            transparent: true
        }
    );

    // __shaderT1.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/Diamond_Block.png');
    // __shaderT2.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/Tennis_Ball.png');

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 256, 256), basicShaderMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);

    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10, 128, 128), textureShaderMaterial);
    box.position.set(15, 10, 15);
    box.rotation.set(Math.PI * 0.6, 0, Math.PI * 0.3);
    box.castShadow = true;
    scene.add(box);

    let torusKnot = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(3, 1, 100, 16), basicShaderMaterial2);
    torusKnot.position.set(15, 10, -15);
    torusKnot.castShadow = true;
    scene.add(torusKnot);
}

function setupDatGui() {

    controls = new function() {
        this.speed = 0.00;
    };

    let gui = new dat.GUI();
    gui.add(controls, 'speed', -0.05, 0.05, 0.01).onChange((e) => speed = e);
;
}

function render() {

    requestAnimationFrame(render);
    scene.rotation.y += controls.speed;                           //rotates the scene
    __shaderB1.uniforms.time.value = clock.getElapsedTime();
    __shaderB2.uniforms.time.value = clock.getElapsedTime();\
    renderer.render(scene, camera);

}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();

}
