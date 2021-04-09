// Author: Zhi Wei Willy Su
// Date: 04/07/2021
// Filename: assignment-02.js
/*
* List of Innovations 
*   More levels
*   More Block types
*   
*
*
*
*
*
*
*
*
*
*
*/

let renderer, scene, camera;
let orbitControls, controls, gui, levels, info, time;
let obj1, obj2, obj3;
let jsonLoaded = false, raycasting = false, resetAdded = false, started = false;
let delta = 0, frame = 30, score = 0, timer = 60;
const objects = [], removed = [], 
min = [6, 10, 14, 35, 80], 
start =[0, 10, 29, 57, 109], 
end =[10, 29, 57, 109, 232], 
scoreMult = [1, 2, 3, 4, 5], 
blockScore = [1000, 5000, 10000],
dblocks = [1, 2, 3, 4, 5];
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

function init() {
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -50, 0));
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFFFFF);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);
    scene.position.set(0, -10, 0);

    info = document.getElementById("extra");
    info.innerText = "";

    scene.addEventListener('update',function() {
        if(started){
            if(objects.length > 0){
                for(let i = 0; i < objects.length; i++){
                    objects[i].__dirtyPosition = true;
                    objects[i].__dirtyRotation = true;
                }
            }
        }
        scene.simulate();
    });
}

function setupCameraAndLight() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(0, 5, 50);
    camera.lookAt(scene.position);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0x666666));

  	light = new THREE.SpotLight(0x999999);
    light.position.set(0, 50, 50);
    light.castShadow = true;
    scene.add(light);
}

function createGeometry() {
    // scene.add(new THREE.AxesHelper(10));
    table = new Physijs.BoxMesh(
        new THREE.BoxBufferGeometry(50, 25, 0.5),
        Physijs.createMaterial(new THREE.MeshStandardMaterial(
            {color: 0xeeeeee, map: new THREE.TextureLoader().load('assets/textures/Wood_Texture.png')},
        0.3, 0.9)), 0)
    table.castShadow = true;
    table.receiveShadow = true;
    table.rotation.x = -Math.PI * 0.5;
    table.name = "Table";
    scene.add(table);

    table.addEventListener('collision', function(other_obj, rel_vel, rel_rot){
        if(other_obj.name == "dBlock"){
            console.log(`${this.id} ::: ${other_obj.name} ::: ${rel_vel.y, rel_rot.x}`);
            obj1 = other_obj; obj2 = rel_vel; obj3 = rel_rot;
        }
    })
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
            switch(this.levels){
                case '0':
                    clearScene();
                    generateBlocks();
                break;
                case '1':
                    clearScene();
                    generateBlocks();
                break;
                case '2':
                    clearScene();
                    generateBlocks();
                break;
                case '3':
                    clearScene();
                    generateBlocks();
                break;
                case '4':
                    clearScene();
                    generateBlocks();
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
            break;
            case '1':
                clearScene();
                generateBlocks();
            break;
            case '2':
                clearScene();
                generateBlocks();
            break;
            case '3':
                clearScene();
                generateBlocks();
            break;
            case '4':
                clearScene();
                generateBlocks();
                
            break;
        }
    });
    jsonLoaded = true;
}

function parseJson(){
    let box = new Physijs.BoxMesh(
        new THREE.BoxBufferGeometry(4, 4, 4),
        Physijs.createMaterial(new THREE.MeshLambertMaterial({transparent: true, opacity: 0.7, color: 0xffffff}),1, 1), 50);
    box.castShadow = true;
    box.receiveShadow = true;
    return box;
}

function generateBlocks(){
    for(let i = start[controls.levels]; i < end[controls.levels]; i++){
        let block = parseJson();
        block.position.set(levels.boxPos[i][0], levels.boxPos[i][1], levels.boxPos[i][2]);
        if(levels.boxPos[i][3] == "I"){
            block.material = Physijs.createMaterial(new THREE.MeshStandardMaterial(
                {color: 0xeeeeee, map: new THREE.TextureLoader().load('assets/textures/Iron_Block.png')},
                0.5, 0.9), 1);
            block.name = "iBlock";
        }else if(levels.boxPos[i][3] == "G"){
            block.material = Physijs.createMaterial(new THREE.MeshStandardMaterial(
                {color: 0xeeeeee, map: new THREE.TextureLoader().load('assets/textures/Gold_Block.png')},
                0.5, 0.9), 1);
            block.name = "gBlock";
        }else if(levels.boxPos[i][3] == "D"){
            block.material = Physijs.createMaterial(new THREE.MeshStandardMaterial(
                {color: 0xeeeeee, map: new THREE.TextureLoader().load('assets/textures/Diamond_Block.png')},
                0.5, 0.9), 1);
            block.name = "dBlock";
        }
        block.__dirtyPosition = true;
        block.__dirtyRotation = true;
        objects.push(block);
        scene.add(block);
        info.style.color = "red";
        info.innerText = objects.length.toString() + "/" + min[controls.levels] + " " + "60";
        hScore.innerText = "0";
    }
}

function clearScene(){
    if(objects.length > 0){ 
        objects.forEach(o=>{
            scene.remove(o);
        })
        objects.length = 0;
    }
    if(controls.levels == 4){
        scene.remove(table)
        table = new Physijs.BoxMesh(
            new THREE.BoxBufferGeometry(50, 50, 0.5),
            Physijs.createMaterial(new THREE.MeshStandardMaterial(
                {color: 0xeeeeee, map: new THREE.TextureLoader().load('assets/textures/Wood_Texture.png')},
            0.3, 0.9)), 0)
        table.castShadow = true;
        table.receiveShadow = true;
        table.rotation.x = -Math.PI * 0.5;
        table.name = "Table";
        scene.add(table);
    }
    else{
        scene.remove(table);
        table = new Physijs.BoxMesh(
            new THREE.BoxBufferGeometry(50, 25, 0.5),
            Physijs.createMaterial(new THREE.MeshStandardMaterial(
                {color: 0xeeeeee, map: new THREE.TextureLoader().load('assets/textures/Wood_Texture.png')},
            0.3, 0.9)), 0)
        table.castShadow = true;
        table.receiveShadow = true;
        table.rotation.x = -Math.PI * 0.5;
        table.name = "Table";
        scene.add(table);
    }
    clock.stop();
    started = false;
    score = 0;
    info.innerText = objects.length.toString() + "/" + min[controls.levels] + " " + "60";
}

function checkConditions(){
    // locks camera
    if(controls.lockCamera){
        orbitControls.enabled = false;
        raycasting = true;
    }
    else{
        orbitControls.enabled = true;
        raycasting = false;
    }

    // enables/disables raycasting
    if(raycasting)
        document.addEventListener('mousedown', onMouseDown, false);
    else
        document.removeEventListener('mousedown', onMouseDown, false);

    // checks winning condition
    switch(controls.levels){
        case '0':
            if(objects.length > min[controls.levels])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '1':
            if(objects.length > min[controls.levels])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '2':
            if(objects.length > min[controls.levels])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '3':
            if(objects.length > min[controls.levels])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
        case '4':
            if(objects.length > min[controls.levels])
                info.style.color = "red";
            else
                info.style.color = "green";
        break;
    }

    // checks if game started
    if(started){
        delta = Math.round(clock.getElapsedTime());
        time = "60" - delta.toString();
        info.innerText = objects.length.toString() + "/" + min[controls.levels] + " " + time;
    }

    if(time == "0")
        clock.stop();
}

function onMouseDown(event){
    event.preventDefault();
    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(objects, true);
    if(intersects.length > 0){
        const intersect = intersects[0];
        if(!started){
            clock.start();
            started = true;
        }
        if((intersect.object.name === "iBlock" || intersect.object.name === "gBlock") && objects.length > min[controls.levels]){
            if(intersect.object.name === "iBlock"){
                score += blockScore[0] - (Math.round(blockScore[0] * (scoreMult[controls.levels]/60))*delta);
                hScore.innerText = score.toString(); 
            }
            else if(intersect.object.name === "gBlock"){
                score += blockScore[1] - (Math.round(blockScore[1] * (scoreMult[controls.levels]/60))*delta);
                hScore.innerText = score.toString(); 
            }
            scene.remove(intersect.object);
            objects.splice( objects.indexOf( intersect.object ), 1 );
            removed.push(intersect.object);
        }
        render();
    }
}

function render() {
    requestAnimationFrame(render);
    checkConditions();
    orbitControls.update();
    renderer.render(scene, camera);
    scene.simulate();
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
}
