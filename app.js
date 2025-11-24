import * as THREE from "three";

console.log(THREE);

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { Pane } from "three/addons//tweakpane/dist/tweakpane.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const devMode = false;

const scene = new THREE.Scene();

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const geometry = new THREE.SphereGeometry(1, 64, 32);
const torusKnot = new THREE.TorusKnotGeometry(
  0.5,
  0.2,
  100,
  32
);

const cubeMaterial = new THREE.MeshStandardMaterial({
  color: "#BDC2F7",
});

const cubeMaterial2 = new THREE.MeshStandardMaterial({
  color: "green",
  wireframe: false,
});

const material = new THREE.MeshPhongMaterial({
  color: "limeGreen",
});
material.shininess = 1000;

const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.color = new THREE.Color("limeGreen");
standardMaterial.roughness = 0;
standardMaterial.metalness = 0.65;

// Работа с текстурами
const textureLoader = new THREE.TextureLoader();
const textureGrass = textureLoader.load(
  "../textures/grass/wispy-grass-meadow_albedo.png"
);
const textureGrassAO = textureLoader.load(
  "../textures/grass/wispy-grass-meadow_ao.png"
);
const textureGrassHeight = textureLoader.load(
  "../textures/grass/wispy-grass-meadow_height.png"
);
const textureGrassMetallic = textureLoader.load(
  "../textures/grass/wispy-grass-meadow_metallic.png"
);
const textureGrassNormal = textureLoader.load(
  "../textures/grass/wispy-grass-meadow_normal-ogl.png"
);
const textureGrassRoughness = textureLoader.load(
  "../textures/grass/wispy-grass-meadow_roughness.png"
);


const materialGrass = new THREE.MeshStandardMaterial();
materialGrass.map = textureGrass;
materialGrass.aoMap = textureGrassAO;
materialGrass.roughnessMap = textureGrassRoughness;
materialGrass.metalnessMap = textureGrassMetallic;
materialGrass.displacementMap = textureGrassHeight;
materialGrass.normalMap = textureGrassNormal;

materialGrass.displacementScale = 0.1;
materialGrass.roughness = 0.35;

const cubeMesh = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial2
);
const tempVector = new THREE.Vector3(0, 1.5, 0);
cubeMesh.position.copy(tempVector);
cubeMesh.scale.set(1, 3, 1);
cubeMesh.updateMatrix();

const cubeMesh2 = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial
);
const tempVector2 = new THREE.Vector3(0, 1.5, 1);
cubeMesh2.position.copy(tempVector2);
cubeMesh2.rotation.y = THREE.MathUtils.degToRad(0);

const cubeMesh3 = new THREE.Mesh(cubeGeometry, material);
const tempVector3 = new THREE.Vector3(0, 1.5, -1);
cubeMesh3.position.copy(tempVector3);
cubeMesh3.rotation.y = 0;

const geometryMesh = new THREE.Mesh(
  geometry,
  materialGrass
);
geometryMesh.position.x = 2;

const torusMesh = new THREE.Mesh(
  torusKnot,
  standardMaterial
);
torusMesh.position.x = 2;
torusMesh.position.z = 2;

torusMesh.castShadow = true;
torusMesh.receiveShadow = true;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  128
);

const cubeCamera = new THREE.CubeCamera(
  0.1,
  100,
  cubeRenderTarget
);

cubeCamera.position.copy(torusMesh.position);

scene.add(cubeCamera);
standardMaterial.envMap = cubeRenderTarget.texture;
standardMaterial.envMapIntensity = 1.5;

// Добавляем glb файл

// const textures = {
//   boulderAlbedo: textureLoader.load(
//     "../textures/boulder/sharp-boulder2-albedo.png"
//   ),
//   boulderNormal: textureLoader.load(
//     "../textures/boulder/sharp-boulder2-normal_ogl.png"
//   ),
//   boulderAo: textureLoader.load(
//     "../textures/boulder/sharp-boulder2-ao.png"
//   ),
//   boulderMetallic: textureLoader.load(
//     "../textures/boulder/sharp-boulder2-metallic.png"
//   ),
//   boulderRoughness: textureLoader.load(
//     "../textures/boulder/sharp-boulder2-roughness.png"
//   ),
// };

// Object.values(textures).forEach((texture) => {
//   texture.flipY = false;
// });

// textures.boulderAlbedo.flipY = false;
// textures.boulderAo.flipY = false;
// textures.boulderNormal.flipY = false;
// textures.boulderRoughness.flipY = false;
// textures.boulderMetallic.flipY = false;

// const boulderMaterial = new THREE.MeshStandardMaterial({
//   map: textures.boulderAlbedo,
//   aoMap: textures.boulderAo,
//   roughnessMap: textures.boulderRoughness,
//   metalnessMap: textures.boulderMetallic,
//   normalMap: textures.boulderNormal,
//   roughness: 0.1,
// });

const loader = new GLTFLoader();

let loaderBoulder = null;

loader.load(
  "../textures/boulder/echo4_export.glb",
  (gltf) => {
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        // node.material = boulderMaterial;
        node.castShadow = false;
        node.receiveShadow = true;
        node.material.roughness = 0.25;
        node.material.metalness = 0.05;
      }
    });

    loaderBoulder = gltf.scene;

    scene.add(loaderBoulder);
  }
);

// const sceneGroup = new THREE.Group();
// sceneGroup.add(
//   // cubeMesh,
//   // cubeMesh2,
//   // cubeMesh3,
//   // geometryMesh,
//   torusMesh
// );

const axesHepler = new THREE.AxesHelper(2);
const gridHelper = new THREE.GridHelper(10, 10);

const light = new THREE.AmbientLight("#fff", 0.5);
scene.add(light);

const pointlight = new THREE.PointLight("#fff", 60);
pointlight.position.set(3, 3, 1);

pointlight.castShadow = true;
pointlight.shadow.mapSize.width = 2048;
pointlight.shadow.mapSize.height = 2048;
pointlight.shadow.camera.far = 500;
pointlight.shadow.radius = 30;

scene.add(pointlight);

const pointLightHelper = new THREE.PointLightHelper(
  pointlight,
  0.1
);
scene.add(pointLightHelper);

// scene.add(sceneGroup, axesHepler, gridHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  30
);
camera.position.x = 5;
camera.position.y = 2;
camera.position.z = 0;
scene.add(camera);

const canvas = document.querySelector(".threejs");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

// Raycaster

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDraggingKnot = false;
let targetRotation = { x: 0, y: 0 };
let displayRotation = { x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  isDraggingKnot =
    raycaster.intersectObject(loaderBoulder).length > 0;
});

canvas.addEventListener("mouseup", () => {
  isDraggingKnot = false;
});

canvas.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  controls.enabled = !isDraggingKnot;

  if (isDraggingKnot && e.buttons === 1) {
    targetRotation.x += e.movementX * 0.01; // Движение мыши влево-вправо → вращение вокруг Y
    targetRotation.y += e.movementY * 0.01; // Движение мыши вверх-вниз → вращение вокруг X
  }
});

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  //Raycaster Smooth

  displayRotation.x = THREE.MathUtils.lerp(
    displayRotation.x,
    targetRotation.x,
    0.1
  );
  displayRotation.y = THREE.MathUtils.lerp(
    displayRotation.y,
    targetRotation.y,
    0.1
  );
  if (loaderBoulder) {
    loaderBoulder.rotation.set(
      displayRotation.x,
      displayRotation.y,
      0
    );
  }

  torusMesh.visible = false;
  cubeCamera.update(renderer, scene);
  torusMesh.visible = true;

  // geometryMesh.rotation.y -= THREE.MathUtils.degToRad(0.25);
  // geometryMesh.rotation.x -= THREE.MathUtils.degToRad(0.1);
};

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// if (devMode) {
//   const pane = new Pane();
//   pane.addBinding(standardMaterial, "metalness", {
//     min: 0,
//     max: 1,
//     label: "metalness",
//   });
//   pane.addBinding(standardMaterial, "roughness", {
//     min: 0,
//     max: 1,
//     label: "roughness",
//   });

//   pane.addBinding(standardMaterial, "envMapIntensity", {
//     min: 0,
//     max: 2,
//   });
// } else {
//   scene.remove(axesHepler, gridHelper, pointLightHelper);
// }
