import * as THREE from "three";

import React, { useEffect } from "react";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { SphereGeometry } from "three/src/geometries/SphereGeometry";
import { toast } from "react-toastify";

// import { DragControls } from "three/addons/controls/DragControls.js";











let gui;
// let stlModel;
// Store text labels for measurements
// let textLabels = []; 
// Store references to the spheres
// let spheres = [];
// Define geometry outside the load function
// let geometry; 
// let togglematerial;
let measurementObjects = [];
// Initialize the renderer
// Define material outside the load function
// let material;
let rendered = false;
// Array to hold draggable spheres
// let draggableSpheres = []; 
// To handle drag controls
// let dragControls;
// To store the line object
// let line; 


export default function Three() {
  useEffect(() => {
    const initDat = async () => {
      const {GUI}= await import("dat.gui");
      // Prevent multiple instances of dat.GUI
      if (gui) {
        gui.destroy();
      }
      gui = new GUI();

      // Create function throttle to limit the number of calls dat.GUI makes

      // Add Dat.GUI controls
      const controlFolder = gui.addFolder("Controls");
      controlFolder.open();
      console.log("stlModel", stlModel);
      // Change rotation of the model
      controlFolder
        .add(stlModel.rotation, "x", -Math.PI, Math.PI)
        .name("Rotation X");
      controlFolder
        .add(stlModel.rotation, "y", -Math.PI, Math.PI)
        .name("Rotation Y");
      controlFolder
        .add(stlModel.rotation, "z", -Math.PI, Math.PI)
        .name("Rotation Z");
      // Change color of the model
      const color = { color: "#fca522" };
      controlFolder.addColor(color, "color").onChange((value) => {
        stlModel.material.color.set(value);
      });

      // Change wireframe of the model
      controlFolder.add(stlModel.material, "wireframe").name("Wireframe");

      // Enable X-Ray effect
      const isXrayEnabled = { mode: false };
      controlFolder
        .add(isXrayEnabled, "mode")
        .name("X-Ray Effect")
        .onChange((value) => {
          if (value) {
            stlModel.material = xrayMaterial;
          } else {
            stlModel.material = solidMaterial;
          }
        });
      //   Change shininess of the model
      controlFolder
        .add(stlModel.material, "shininess", 0, 100)
        .name("Shininess");

      // Toggle createLine mode
      const measurement = { mode: false };
      controlFolder
        .add(measurement, "mode")
        .name("Measurement Tool")
        .onChange((value) => {
          if (value) {
            document.addEventListener("click", measureInitiate, false);
            controls.enabled = false; // Disable OrbitControls while measuring
          } else {
            document.removeEventListener("click", measureInitiate, false);
            controls.enabled = true; // Enable OrbitControls after measuring
          }
        });
      const obj = {
        add: function () {
          console.log("add");
        },
      };
      // Clear all measurements using a button
      controlFolder
        .add(obj, "add")
        .name("Clear Measurements")
        .onChange(clearMeasurements);

      // Reset the camera position using a button
      controlFolder
        .add(obj, "add")
        .name("Reset Camera")
        .onChange(resetCamera);

    };
    

    if (rendered) return;
    rendered = true;
    // Initialize the renderer
    const canvas = document.querySelector("canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initialize the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50); // Set the camera position
    camera.lookAt(0, 0, 0); // Set the camera to look at the origin

    // Initialize the scene
    const scene = new THREE.Scene();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Stronger ambient light for base lighting
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(1, 1, 1).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, 1).normalize();
    scene.add(directionalLight2);


    // Initialize OrbitControls for moving the model
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
    controls.target.set(0, 0, 0); // Set the camera target
  
    // Function to reset the camera position
    function resetCamera() {
      controls.reset();
    }

    // Load STL model
    const stlLoader = new STLLoader();

    let stlModel;
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0xfca522,
      specular: 0x888888,
      shininess: 50,
      side: THREE.DoubleSide, // Render both sides of the faces
      emissive: 0x000000, // Default black
      emissiveIntensity: 1,
      wireframe: false,
      transparent: false,
      opacity: 1, // Full opacity
      depthWrite: true,
      depthTest: true
    });

    const xrayMaterial = new THREE.MeshPhongMaterial({
      color: 0xfca522,
      specular: 0x888888,
      emissive: 0x000000,
      emissiveIntensity: 1,
      wireframe: false,
      transparent: true, // Enable transparency
      opacity: 0.5, // Adjust opacity for x-ray effect
    });


    const loadSTLFile = (arrayBuffer, filePath ) => {
      
        const geometry = stlLoader.parse(arrayBuffer);
        if (stlModel) {
          scene.remove(stlModel);
          initializeSceneFromUrl(stlModel);
        }
        stlModel = new THREE.Mesh(geometry, solidMaterial);
        console.log(stlModel);
        console.log(filePath);
            initDat();
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        geometry.center();
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 50 / maxDimension;
        stlModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        stlModel.rotation.set(0, 0, 0);
        scene.add(stlModel);
      };

      document.addEventListener('loadSTL', (event) => {
        const {arrayBuffer, filePath} = event.detail;
        loadSTLFile(arrayBuffer, filePath);
        // console the file path  
        console.log("The file path", filePath);
      });
      
      


    // Limit the canvas size to fit within the window
    window.addEventListener("resize", function () {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    // stlModel = new THREE.Mesh(geometry, solidMaterial);
      });
    // Raycaster for picking points
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let points = [];

    function measureInitiate(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(stlModel);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        points.push(point);
        //  Add a sphere at the clicked point
        if (points.length === 1) {
          createSphere(point, 0xff0000);
        } else if (points.length === 2) {
          const distance = points[0].distanceTo(points[1]);
          console.log("Distance:", distance);
          createLine(points[0], points[1]);
          const midpoint = points[0].clone().add(points[1]).divideScalar(2);
          create2TextLabel(distance.toFixed(2) + " mm", midpoint);
          points = [];
        }
      }
    }

    // Function to create a line
    function createLine(point1, point2) {
      const material = new LineMaterial({
        color: 0xfffff,
        linewidth: 3, // Line width in world units (adjust as needed)
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight), // resolution of the viewport
        depthTest: false,
      });
      const positions = [
        point1.x,
        point1.y,
        point1.z,
        point2.x,
        point2.y,
        point2.z,
      ];
      const geometry = new LineGeometry();
      geometry.setPositions(positions);

      let line = new Line2(geometry, material);
      line.computeLineDistances();
      line.scale.set(1, 1, 1);
      line.renderOrder = 999; // Ensure the line is rendered on top of the model
      scene.add(line);
      // Create spheres at the points
      const sphereGeometry = new SphereGeometry(0.2, 32, 32); // Adjust size as needed
      // Point 2
      const sphereMaterial2 = new MeshBasicMaterial({ color: 0x00ff00 }); // Color for point 2
      const sphere2 = new Mesh(sphereGeometry, sphereMaterial2);
      sphere2.position.copy(point2);
      sphere2.renderOrder = 1000; // Ensure the sphere is rendered after the line
      scene.add(sphere2);

      // Add sphere to draggableSpheres array
      // draggableSpheres.push(sphere2);

      // // Add sphere to the measurement group
      // measurementGroup.add(sphere2);

      // // Add Line to the measurement group
      // measurementGroup.add(line);
      
      // Store the line in the measurementObjects array
      measurementObjects.push(line);
      measurementObjects.push(sphere2);
    }

    // // Group to store all measurement objects
    // const measurementGroup = new THREE.Group();
    // scene.add(measurementGroup);

    // Function to create a sphere 1
    function createSphere(position, color) {
      const sphereGeometry2 = new SphereGeometry(0.2, 32, 32); // Adjust size as needed
      const material = new MeshBasicMaterial({ color: color });
      const sphere1 = new Mesh(sphereGeometry2, material);
      sphere1.position.copy(position);
      sphere1.renderOrder = 1000; // Ensure the sphere is rendered after the line
      scene.add(sphere1);
 
      // draggableSpheres.push(sphere1); // Add sphere to draggableSpheres array
      // measurementGroup.add(sphere1); // Add sphere to the measurement group
      // Store the sphere in the measurementObjects array
      measurementObjects.push(sphere1);
    }


    // function updateMeasurement() {
    //   if (draggableSpheres.length < 2) return; // Ensure there are at least two spheres
    
    //   const point1 = draggableSpheres[0].position;
    //   const point2 = draggableSpheres[1].position;
    //   const distance = point1.distanceTo(point2);
    //   console.log("Updated Distance:", distance);
    
    // // Update line geometry
    // if (line) {
    //   const positions = line.geometry.attributes.position.array;
    //   positions[0] = point1.x;
    //   positions[1] = point1.y;
    //   positions[2] = point1.z;
    //   positions[3] = point2.x;
    //   positions[4] = point2.y;
    //   positions[5] = point2.z;
    //   line.geometry.attributes.position.needsUpdate = true;
    //   line.geometry.computeBoundingSphere();
    //   console.log("line", line);
    // }

    //   // Update text label
    //   const midpoint = point1.clone().add(point2).divideScalar(2);
    //   if (textLabels.length > 0) {
    //     textLabels[0].div.innerText = distance.toFixed(2) + " mm";
    //     textLabels[0].position.copy(midpoint);
    //   }
    // }

// Add Event Listener to Generate Shareable Link Button
const generateLinkButton = document.getElementById("generateLinkButton");
const generatedLinkDiv = document.getElementById("generatedLink");
const copyLinkButton = document.getElementById("copyLinkButton");

generateLinkButton.addEventListener("click", () => {
  if (!stlModel) {
    toast.error("No model loaded", {
      position: "top-left",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
      icon: false
    });
    return;
  }
  const sharableLink = generateSharableLink(stlModel);
  generatedLinkDiv.innerHTML = `<a href="${sharableLink}" target="_blank">${sharableLink}</a>`;
});

// Add Event Listener to Copy Link Button
copyLinkButton.addEventListener("click", () => {
  if (!generatedLinkDiv.querySelector("a")) {
    toast.error("No link generated", {
      position: "top-left",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
      icon: false
    });
    return;
  }
  copySharableLink(generatedLinkDiv.querySelector("a").href);
});
    // Load the font for text labels
    const fontLoader = new FontLoader();
    let font;

    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      function (loadedFont) {
        font = loadedFont;
      }
    );

    // Function to create 2d text
    function create2TextLabel(text, position) {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.color = "#000000";
      div.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
      div.style.padding = "2px";
      div.style.borderRadius = "5px";
      div.style.fontSize = "14px";
      div.style.fontFamily = font;
      div.style.zIndex = "1"; // Ensure the text is rendered on top
      div.style.pointerEvents = "none"; // Prevent mouse events

      div.innerText = text;
      document.body.appendChild(div);

      updateTextPosition(div, position);

      // Store the div and position for later updates
      textLabels.push({ div, position });
    }

    // Function to update the position of the text label
    function updateTextPosition(div, position) {
      const vector = position.clone().project(camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
    }

    // Array to store text labels for updating positions
    let textLabels = [];

    // Call update function on each frame
    function updateTextLabels() {
      textLabels.forEach(({ div, position }) => {
        updateTextPosition(div, position);
      });
    }

     // Initialize DragControls for draggable spheres
//  dragControls = new DragControls(draggableSpheres, camera, renderer.domElement);

//  dragControls.addEventListener('dragstart', function (event) {
//    controls.enabled = false; // Disable OrbitControls while dragging
//     // disable creating new measurements while dragging 
   

//  });

//  dragControls.addEventListener('dragend', function (event) {
//    controls.enabled = false; // Enable OrbitControls after dragging
//    updateMeasurement(); // Recalculate measurement after dragging
//    // disable creating new measurements while dragging
    
//  });

    // Function to clear all measurements
    function clearMeasurements() {
      // Remove all measurement objects from the scene
      measurementObjects.forEach((object) => {
        scene.remove(object);
      });
      measurementObjects = []; // Clear the array

      // Remove all text labels from the DOM
      textLabels.forEach(({ div }) => {
        document.body.removeChild(div);
      });
      textLabels = []; // Clear the array
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // Update the controls
      renderer.render(scene, camera);
      updateTextLabels(); // Update the positions of text labels
    }

    

    animate();

  }, []);
}

// Serialization, Deserialization and Application of State
export const serializeModelState = (model) => {
  const state = {
    position: model.position.toArray(),
    rotation: model.rotation.toArray(),
    scale: model.scale.toArray(),
    material: {
      color: model.material.color.getHex(),
      wireframe: model.material.wireframe,
      shininess: model.material.shininess,
      opacity: model.material.opacity,
      transparent: model.material.transparent,
    },
    imagePath: model.imagePath,
    
  };
  return JSON.stringify(state);
};

// Function to generate a sharable link
export const generateSharableLink = (model) => {
  const serializedState = serializeModelState(model);
  const encodedState = encodeURIComponent(serializedState);
  // const baseUrl = window.location.origin + window.location.pathname;
  // const sharableUrl = `${baseUrl}?state=${encodedState}`;
  const baseUrl = "http://localhost:3001/dental/";
  const sharableUrl = `${baseUrl}`+ encodedState;
  toast.success("Link generated successfully", {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "colored",
    icon: false
  });
  console.log("Sharable URL:", sharableUrl);                                       
  return sharableUrl;
};

// Funtion to copy the sharable link to the clipboard
export const copySharableLink = (sharableLink) => {
  navigator.clipboard.writeText(sharableLink);
  toast.success("Link copied to clipboard", {
    position: "top-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "colored",
    icon: false
  });
};

export const deserializeModelState = (encodedState) => {
  const decodedState = decodeURIComponent(encodedState);
  return JSON.parse(decodedState);
};

export const applyModelState = (model, state) => {
  model.position.fromArray(state.position);
  model.rotation.fromArray(state.rotation);
  model.scale.fromArray(state.scale);
  model.material.color.setHex(state.material.color);
  model.material.wireframe = state.material.wireframe;
  model.material.shininess = state.material.shininess;
  model.material.opacity = state.material.opacity;
  model.material.transparent = state.material.transparent;
};

export const initializeSceneFromUrl = (stlModel) => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('state')) {
    const serializedState = urlParams.get('state');
    const state = deserializeModelState(serializedState);
    applyModelState(stlModel, state);
  }
};