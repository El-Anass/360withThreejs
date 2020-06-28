const container = document.body;
const tooltip = document.querySelector(".tooltip");
let tooltipActive = false;
top.foundedElements = [];

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Scene and Controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.5;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
camera.position.set(-1, 0, 0);
controls.update();

// SphereGeometry
const geometry = new THREE.SphereGeometry(50, 32, 32);
const texture = new THREE.TextureLoader().load(top.imageLocation);
texture.wrapS = THREE.RepeatWrapping;
texture.repeat.x = -1;

// Tooltip
function addTooltipInfoOriginal(position, name) {
  let spriteMap = new THREE.TextureLoader().load("img/info.png");
  addTooltipInfo(position, name, spriteMap, 20);
}

function addTooltipInfoWithOpacity(position, name) {
  let spriteMap = new THREE.TextureLoader().load("img/info_opacity.png");
  addTooltipInfo(position, name, spriteMap, 10);
}

function addTooltipInfo(position, name, spriteMap, scale) {
  let spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
  });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.name = name;
  sprite.position.copy(position.clone().normalize().multiplyScalar(scale));
  scene.add(sprite);
}

function addTooltipBalise(position) {
  let spriteMap = new THREE.TextureLoader().load("img/Balise.png");
  let spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
  });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position.clone().normalize().multiplyScalar(5));
  scene.add(sprite);
}

const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

const rayCaster = new THREE.Raycaster();

function onClick(e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  rayCaster.setFromCamera(mouse, camera);
  let intersects = rayCaster.intersectObjects(scene.children);

  intersects.forEach(function (intersect) {
    if (
      intersect.object.type === "Sprite" &&
      intersect.object.name.length === 0
    ) {
      location.href = top.returnLink;
      // console.log(intersect.object.name);
    } else if (
      intersect.object.type === "Sprite" &&
      intersect.object.name.length > 0 &&
      !top.foundedElements.includes(intersect.object.name)
    ) {
      top.foundedElements.push(intersect.object.name);
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(intersect.object.name));
      document.querySelector(".info-360 > ol").appendChild(li);
    }
  });

  // let intersects2 = rayCaster.intersectObject(sphere);
  // if (intersects2.length > 0) {
  //   console.log(intersects2[0].point);
  //   addTooltip(intersects2[0].point);
  // }
}

function onMouseMove(e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  rayCaster.setFromCamera(mouse, camera);

  let foundSprite = false;
  let intersects = rayCaster.intersectObjects(scene.children);

  intersects.forEach(function (intersect) {
    if (intersect.object.type === "Sprite") {
      if (intersect.object.name.length > 0) {
        document.body.style.cursor = "pointer";
        // console.log(intersect.object.name);
        let p = intersect.object.position.clone().project(camera);
        tooltip.style.top = ((-1 * p.y + 0.95) * window.innerHeight) / 2 + "px";
        tooltip.style.left = ((p.x + 1) * window.innerWidth) / 2 + "px";
        tooltip.classList.add("isActive");
        tooltip.innerHTML = intersect.object.name;
        tooltipActive = true;
        foundSprite = true;
        // console.log(p);
      }
    }
  });
  if (foundSprite === false) {
    document.body.style.cursor = "default";
    tooltip.classList.remove("isActive");
  }
}

window.addEventListener("resize", onResize);
container.addEventListener("click", onClick);
container.addEventListener("mousemove", onMouseMove);
