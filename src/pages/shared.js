import * as THREE from "three";

import { useEffect, useRef } from "react";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useRouter } from "next/router";

// Function to deserialize the model state from the URL
const deserializeModelState = (encodedState) => {
  const decodedState = decodeURIComponent(encodedState);
  console.log("Decoded State:", decodedState);
  return JSON.parse(decodedState);
};

// Function to apply the model state (position, rotation, scale, material) to the 3D model
const applyModelState = (model, state) => {
  model.position.fromArray(state.position);
  model.rotation.fromArray(state.rotation);
  model.scale.fromArray(state.scale);
  model.material.color.setHex(state.material.color);
  model.material.wireframe = state.material.wireframe;
  model.material.shininess = state.material.shininess;
  model.material.opacity = state.material.opacity;
  model.material.transparent = state.material.transparent;

  // Load the STL file from the filePath if provided
  if (state.filePath) {
    loadModelFromFile(state.filePath, model);
  }
};

// Function to load and render the STL model from the filePath
const loadModelFromFile = (filePath, model) => {
  const loader = new STLLoader();
  loader.load(filePath, (geometry) => {
    const material = new THREE.MeshPhongMaterial({ color: model.material.color });
    const mesh = new THREE.Mesh(geometry, material);

    // Add the loaded model to the scene
    model.add(mesh);
  });
};

// Three.js Scene Setup
const setupThreeJS = (container, serializedState) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);

  // Initialize the STL model and apply the state
  const model = new THREE.Group();
  scene.add(model);
  
  const state = deserializeModelState(serializedState);
  applyModelState(model, state);

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
    const { state } = router.query;

    if (state && containerRef.current) {
      setupThreeJS(containerRef.current, state);
    }
  }, [router.query]);

  return (
    <div>
      <h1>3D Model Viewer</h1>
      <p>You can view and move the 3D model around, but no other controls are available.</p>
      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
};

export default SharedPage;
