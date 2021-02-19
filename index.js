import * as THREE from "https://unpkg.com/three@0.125.2/build/three.module.js?module";
import { OBJLoader } from "https://unpkg.com/three@0.125.2/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://unpkg.com/three@0.125.2/examples/jsm/loaders/MTLLoader.js";

const Title = document.querySelector("#title");
const Loading = document.querySelector("#loading");
const Info = document.querySelector("#info");
const Credit = document.querySelector("#credit");
const Button = document.querySelector(".button");
const Video = document.querySelector("video");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#D2D4C8");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

const sceneAnimate = [
  () => {
    car.rotation.y += 0.01;
    cam.rotation.y -= 0.01;
    projector.rotation.y += 0.01;
  },
  () => {
    if (cam.position.y <= 1.05) {
      // cam.position.y = 3;
    } else {
      cam.position.y -= 0.02;
    }

    if (projector.position.x <= -0.3) {
      // projector.position.x = 1;
    } else {
      projector.position.x -= 0.02;
    }
  },
  () => {},
  () => {},
];

let sceneIndex = 0;
let resetTimer;

function sceneSwitcher(index) {
  switch (index) {
    case 0:
      car.visible = false;
      projector.position.set(2, 0.85, 0);
      cam.position.set(-0.3, 3, 0);
      projector.scale.set(0.01, 0.01, 0.01);
      cam.scale.set(0.001, 0.001, 0.001);
      projector.rotation.y = 4.8;
      cam.rotation.y = 4.8;
      projector.rotation.x = 0;
      light.position.set(0, 5, 5);
      camera.position.set(0, 0, 5);
      resetTimer = setInterval(() => {
        projector.position.set(2, 0.85, 0);
        cam.position.set(-0.3, 3, 0);
      }, 5000);
      car_invis.visible = true;
      Info.innerHTML =
        "อุปกรณ์หลัก ๆ มี 3 ชิ้นคือ ตัวรถยนต์, กล้องติดรถ และเครื่องฉายภาพ (Projector) ติดตั้งที่บริเวณตัวรถ";
      Button.innerHTML = "ลองประสบการณ์เสมือน !";
      document.documentElement.requestFullscreen();
      break;
    case 1:
      Video.play();
      // scene.background = vidTexture;
      scene.add(vid);
      cam.visible = false;
      projector.visible = false;
      car_invis.visible = false;
      car.visible = true;
      car.position.set(0, -0.2, 4.8);
      car.rotation.set(0, 0, 0);
      Info.style.display = "none";
      Title.style.display = "none";
      Button.innerHTML = "จบการทดลอง";
      break;
    case 2:
      Video.pause();
      vid.visible = false;
      car.visible = false;
      car_invis.visible = false;
      cam.visible = false;
      projector.visible = false;
      Title.style.display = "block";
      Credit.style.display = "flex";
      Button.style.display = "none";
  }

  if (index < 3) sceneIndex++;
}

const renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(40, 15);
const vidTexture = new THREE.VideoTexture(Video);
// vidTexture.offset = new THREE.Vector2(0, 0.3);
const material = new THREE.MeshBasicMaterial({
  map: vidTexture,
});

const vid = new THREE.Mesh(geometry, material);
vid.position.z = -3;
vid.position.y = 3;

const light = new THREE.DirectionalLight("#fff", 1);
light.position.set(0, 0, 5);
scene.add(light);

camera.position.z = 5;

const camLoader = new OBJLoader();
const carLoader = new OBJLoader();
const projectorLoader = new OBJLoader();

let car;
let car_invis;
let projector;
let cam;

const mtlloader = new MTLLoader();

mtlloader.load("car/Porsche_911_GT2_Drive.mtl", (object) => {
  object.preload();
  carLoader.setMaterials(object);
  carLoader.load(
    "car/Porsche_911_GT2_Drive.obj",
    (obj) => {
      car = obj;
      car.traverse((object) => {
        object.frustumCulled = false;
      });
      car.position.x -= 3;
      car.scale.set(0.7, 0.7, 0.7);
      scene.add(obj);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error(error);
    }
  );
});

mtlloader.load("cam/Sport Camera2 obj.mtl", (object) => {
  object.preload();
  camLoader.setMaterials(object);
  camLoader.load(
    "cam/Sport Camera2 obj.obj",
    (obj) => {
      cam = obj;
      cam.scale.set(0.005, 0.005, 0.005);
      cam.position.y -= 0.3;
      scene.add(obj);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error(error);
    }
  );
});

mtlloader.load("projector/Optoma/OptomaProjector2.mtl", (object) => {
  object.preload();
  projectorLoader.setMaterials(object);
  projectorLoader.load(
    "projector/Optoma/OptomaProjector2.obj",
    (obj) => {
      projector = obj;
      projector.position.set(3, -0.3);
      projector.scale.set(0.06, 0.06, 0.06);
      scene.add(obj);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error(error);
    }
  );
});

const newLoader = new OBJLoader();

mtlloader.load("car/Porsche_911_GT2_Half2.mtl", (object) => {
  object.preload();
  newLoader.setMaterials(object);
  newLoader.load(
    "car/Porsche_911_GT2_Half2.obj",
    (obj) => {
      car_invis = obj;
      car_invis.visible = false;
      car_invis.opaicty = 0.5;
      car_invis.rotation.y = -1.6;
      car_invis.position.z += 2.5;
      car_invis.scale.set(0.7, 0.7, 0.7);
      scene.add(obj);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error(error);
    }
  );
});

const loading = true;

const animate = function () {
  requestAnimationFrame(animate);

  if (cam && projector && car && car_invis) {
    if (loading) Loading.style.display = "none";
    sceneAnimate[sceneIndex]();
  }

  renderer.render(scene, camera);
};

window.addEventListener("DOMContentLoaded", () => {
  animate();
});

Button.addEventListener("click", () => {
  if (cam && projector && car && car_invis) sceneSwitcher(sceneIndex);
});

window.addEventListener("resize", (event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.fov = 75;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const cameraMoveScale = 0.4;

window.addEventListener("mousemove", (event) => {
  const percentX = (event.clientX / window.innerWidth) * 100;
  const percentY = (event.clientY / window.innerHeight) * 100;
  const x = (cameraMoveScale / 100) * percentX - cameraMoveScale / 2;
  const y = (cameraMoveScale / 100) * percentY - cameraMoveScale / 2;

  if (sceneIndex === 0) {
    camera.position.x = -x;
    camera.position.y = y;
  }

  if (sceneIndex === 2) {
    camera.lookAt(x * 10, -y * 8, -20);
  }
});
