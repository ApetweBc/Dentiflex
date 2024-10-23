import * as THREE from "three";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useRef } from "react";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import processOldFiles from "@/Threejs/processOldFiles";
import { useRouter } from "next/router";

// Function to deserialize the model state from the URL
const deserializeModelState = (encodedState) => {
  const decodedState = decodeURIComponent(encodedState);
  return JSON.parse(decodedState);
};


// Function to apply the model state (position, rotation, scale, material) to the 3D model
const applyModelState = (model, state) => {
  // model.position.fromArray(state.position);
  // model.rotation.fromArray(state.rotation);
  // model.scale.fromArray(state.scale);
  // Create a material

  if (!state.imagePath) {
    router.push("/"); // Redirect to homepage
    return;
  }

  const color = `#${state.material.color}`;
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    wireframe: state.material.wireframe,
    shininess: state.material.shininess,
    opacity: state.material.opacity,
    transparent: state.material.transparent,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    depthWrite: true,
    depthTest: true,
    emissiveIntensity: 1,
  });

  console.log("Material Properties:", {
    color: material.color,
    wireframe: material.wireframe,
    shininess: material.shininess,
    opacity: material.opacity,
    transparent: material.transparent,
  });
  const modelWithMaterial = { model, material };

  // Load the STL file from the filePath if provided
  if (state.imagePath) {
    // let replaceString = state.imagePath.replace("/uploads/", "");
    loadModelFromFile(state.imagePath, modelWithMaterial);
    

    
  }
};

// Function to load and render the STL model from the filePath
const loadModelFromFile = (filePath, {model, material}) => {
  const loader = new STLLoader();
  loader.load(filePath, (geometry) => {
    const stlModel = new THREE.Mesh(geometry, material);
    console.log("Mesh:", material);

    // Add the loaded model to the scene
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    geometry.center();
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = 50 / maxDimension;
    stlModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    
    // center the model
    stlModel.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);
    model.add(stlModel);

  });
 
};



// Three.js Scene Setup
const setupThreeJS = (container, serializedState, router) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Optional, for smoother motion
  controls.dampingFactor = 0.25; // Optional, for smoother motion
  controls.screenSpacePanning = false; // Optional, for panning in screen space
  controls.minDistance = 40; // Set minDistance to the desired distance
  controls.maxDistance= 300; // Set maxDistance to the same value to lock zoom level
  controls.enableZoom = true; // Enable zooming
  controls.enablePan = true; // Enable panning
 
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  controls.zoomSpeed = 1.0; // Set zoom speed
  controls.panSpeed = 1.0; // Set pan speed
  controls.target.set(0, 0, 0); // 
 // Add lighting
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Stronger ambient light for base lighting
 scene.add(ambientLight);

 const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
 directionalLight1.position.set(1, 1, 1).normalize();
 scene.add(directionalLight1);

 const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
 directionalLight2.position.set(-1, -1, 1).normalize();
 scene.add(directionalLight2);
   
 

  // Initialize the STL model and apply the state
  const model = new THREE.Group();
  scene.add(model);
  
  
  const state = deserializeModelState(serializedState);
  applyModelState(model, state);


 // Resize the renderer when the window is resized
 window.addEventListener("resize", function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
// stlModel = new THREE.Mesh(geometry, solidMaterial);
  });

  // Render loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
};



// Main component for the Shared page
const SharedPage = () => {
  const router = useRouter();
  const containerRef = useRef(null);
    
 

  
  useEffect(() => {
    if (!router.isReady) {
      return; // Wait until the router is ready and the query parameters are populated
    }
    
    const { state } = router.query;
    // const fileName = state;
    
  
    let parsedState;
    if (typeof state === "string") {
      try {
        parsedState = JSON.parse(state);
      } catch (e) {
        console.error("Failed to parse state:", e);
      }
    } else {
      parsedState = state;
    }
    const filePath = parsedState?.imagePath;
    const fileName =  filePath.replace("/uploads/","");

    // Check if the file has expired
    const isExpired = processOldFiles(fileName); 
    
    if (state && Object.keys(state).length > 0 && containerRef.current && !isExpired) {
      setupThreeJS(containerRef.current, state); // Parse state if it's a stringified object
    } else {
      // Notify the User that the file has expired
      // Toast notification
      router.push("/", 
      ); // Redirect to homepage
    }
  }, [router, router.isReady, router.query]);

  return (
     <main>
    <div>
      <ToastContainer className={"z-50"} />
      <canvas ref={containerRef} />
    </div>
     </main>
  );
};





export default SharedPage;
