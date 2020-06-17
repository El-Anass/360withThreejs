const container = document.body;
const tooltip = document.querySelector(".tooltip");
let tooltipActive = false;

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Scene and Controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.2;
controls.enableZoom = false;
camera.position.set(-1, 0, 0);
controls.update();

// SphereGeometry
const geometry = new THREE.SphereGeometry(50, 32, 32);
const texture = new THREE.TextureLoader().load("img/molay-driss 1.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.repeat.x = -1;

// Tooltip
function addTooltip(position, name) {
  let spriteMap = new THREE.TextureLoader().load("img/info.png");
  let spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
  });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.name = name;
  sprite.position.copy(position.clone().normalize().multiplyScalar(20));
  scene.add(sprite);
}

function addTooltip2(position, name) {
  let spriteMap = new THREE.TextureLoader().load("img/Balise.png");
  let spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
  });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.name = name;
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
    if (intersect.object.type === "Sprite") {
      location.href = "http://all.labxdev.com/essec/mod/lesson/view.php?id=129";
      // console.log(intersect.object.name);
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
  });
  if (foundSprite === false) {
    tooltip.classList.remove("isActive");
  }
}

addTooltip(new THREE.Vector3(28.6, 1.9, 40.7), "656-661");
// addTooltip(new THREE.Vector3(-48.8, -1.7, 10.2), "Infor 2");
addTooltip2(new THREE.Vector3(93, 40.8, 55), "632");

window.addEventListener("resize", onResize);
container.addEventListener("click", onClick);
container.addEventListener("mousemove", onMouseMove);
