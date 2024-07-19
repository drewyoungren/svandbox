<script>
  // @ts-nocheck
  import M from "$lib/M.svelte";
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  let stopGo = false;
  let blockI = 2;
  let blockJ = 2;
  let blockWarn = "";
  //scene stuff

  /**
   * @type Element
   */
  let canvas;

  /**
   * @type THREE.WebGLRenderer
   */
  let renderer;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#FFFFFF");

  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 0);

  let w = 800;
  let h = 600;

  // @ts-ignore
  camera.position.set(4, 3, 14);

  // const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x7744cc,
    // shininess: 80,
  });
  const materialBlack = new THREE.MeshBasicMaterial({
    color: 0x252525,
    // shininess: 80,
  });
  const materialBlue = new THREE.MeshBasicMaterial({
    color: 0x3333aa,
    // shininess: 80,
  });
  const materialRed = new THREE.MeshBasicMaterial({
    color: 0xaa3333,
    // shininess: 80,
  });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // const light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);
  const light2 = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(light2);

  // Controls
  let controls;

  /**
   * Check if we need to resize the canvas
   * @param renderer {THREE.WebGLRenderer}
   * @returns boolean
   */
  function resizeRendererToDisplaySize(renderer) {
    const needResize = canvas.width !== w || canvas.height !== h;
    if (needResize) {
      renderer.setSize(w, h, false);
    }
    return needResize;
  }

  /**
   * Animate loop
   * @param time {number}
   */
  function render(time, loop = true) {
    time *= 0.001;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // cube.rotation.x = 2 * time;
    // cube.rotation.y = 3 * time;

    evolve();
    drawStatus();

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    controls?.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  onMount(() => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.render(scene, camera);

    controls = new OrbitControls(camera, canvas);

    // Enable camera keyboard controls
    controls.listenToKeyEvents(canvas);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.maxPolarAngle = Math.PI;

    // controls.addEventListener('change', requestFrameIfNotRequested);
    // // controls2.addEventListener('change', requestFrameIfNotRequested);

    // // resize();
    // requestFrameIfNotRequested();

    resetStatus();

    requestAnimationFrame(render);
  });

  // grid stuff

  const STEP = 1;

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
  });

  const lineMesh = new THREE.LineSegments(undefined, lineMaterial);
  scene.add(lineMesh);

  /**
   *
   * @param totalSteps {number}
   */
  function drawGrid(totalSteps) {
    const points = [];
    for (let i = 0; i <= totalSteps + 1; i++) {
      points.push(new THREE.Vector3(i * STEP, 0, 0));
      points.push(new THREE.Vector3(i * STEP, 0, STEP * (totalSteps + 1)));
      points.push(new THREE.Vector3(0, 0, i * STEP));
      points.push(new THREE.Vector3(STEP * (totalSteps + 1), 0, i * STEP));
    }

    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, 2, 0));

    const gridGeometry = new THREE.BufferGeometry().setFromPoints(points);
    lineMesh.geometry.dispose();
    lineMesh.geometry = gridGeometry;
  }

  $: drawGrid(totalSteps + 1);

  let totalSteps = 4;
  let timeStep = 20; // how oftern to update, in milliseconds
  let probUp = 0.5;

  /**
   * @typedef {Object} GridEntry
   * @property {number} i
   * @property {number} j
   * @property {number} count
   * @property {THREE.Mesh} box
   * @property {boolean} blocked
   */

  /**
   * @type Array<GridEntry>
   */
  let status = [];

  function resetStatus() {
    status.forEach((e) => {
      e.box.geometry.dispose();
      scene.remove(e.box);
    });
    status = [];
    blockI = 1;
    blockJ = 1;
    for (let i = 0; i <= totalSteps + 1; i++) {
      for (let j = 0; j + i <= totalSteps + 1; j++) {
        const count = 0;
        const blocked = false;
        const box = new THREE.Mesh(
          count == 0
            ? undefined
            : new THREE.BoxGeometry(0.8 * STEP, count, 0.8 * STEP),
          i + j == totalSteps + 1 ? materialBlue : materialBlack
        );

        status.push({
          i,
          j,
          count,
          box,
          blocked,
        });
        box.position.x = i * STEP + STEP / 2;
        box.position.z = j * STEP + STEP / 2;
        box.position.y = count / 2;
        box.count = count;
        scene.add(box);
      }
    }
    controls?.target.set(
      STEP * (totalSteps / 2 + 1),
      2,
      STEP * (totalSteps / 2 + 1)
    );
    camera?.lookAt(
      new THREE.Vector3(
        STEP * (totalSteps / 2 + 1),
        0,
        STEP * (totalSteps / 2 + 1)
      )
    );
  }

  function drawStatus() {
    const total = status
      .filter((e) => e.i + e.j == totalSteps + 1)
      .map((e) => e.count)
      .reduce((p, n) => p + n);
    status.forEach((e) => {
      let { count, box, blocked } = e;
      if (count != box.count) {
        box.geometry?.dispose();
        if (count > 0) {
          box.geometry = new THREE.BoxGeometry(
            0.8 * STEP,
            count / 10,
            0.8 * STEP
          );
          box.position.y = count / 20;
          box.visible = true;
        } else {
          box.visible = blocked;
        }
        box.count = count;
      }
      if (blocked && box.children.length < 1) {
        box.visible = true;
        const barrier = new THREE.Mesh(
          new THREE.BoxGeometry(0.8 * STEP, 2, 0.8 * STEP),
          materialRed
        );
        box.add(barrier);
        barrier.position.y = 1;
      } else if (!blocked && box.children.length > 0) {
        box.children.forEach(cleanItem);
        box.remove(box.children[0]);
        console.log(box.children, "gone");
      }
    });
  }

  function cleanItem(mesh) {
    mesh?.geometry.dispose();
  }

  function evolve() {
    for (let k = totalSteps; k >= 0; k--) {
      status
        .filter((e) => e.i + e.j == k)
        .forEach((entry) => {
          let { i, j, count, box } = entry;
          for (let g = 0; g < count; g++) {
            if (Math.random() < timeStep / 200) {
              const rightNeighbor = status.find(
                (e) => e.i == i + 1 && e.j == j
              );
              const upNeighbor = status.find((e) => e.i == i && e.j == j + 1);
              const updateAmount =
                stopGo && i + j == 0
                  ? Math.max(entry.count - 1, 1)
                  : entry.count - 1;
              if (
                rightNeighbor &&
                !rightNeighbor.blocked &&
                Math.random() > probUp
              ) {
                // go up
                rightNeighbor.count++;
                entry.count = updateAmount;
              } else if (upNeighbor && !upNeighbor.blocked) {
                upNeighbor.count++;
                entry.count = updateAmount;
              }
            }
          }
        });
    }
  }
</script>

<h1>Ants Marching</h1>

<p>
  Ants move along a rectangular lattice by choosing only 'up' or 'right' with
  probability <M>p</M> or <M>1 - p</M> at each step. Where do they end up after
  <M>n</M> steps?
</p>

<div class="container">
  <canvas bind:this={canvas} bind:clientWidth={w} bind:clientHeight={h}
  ></canvas>
  <div id="controls">
    <label for="totalSteps"
      >Steps:
      <input
        type="range"
        name="totalSteps"
        id="totalSteps"
        bind:value={totalSteps}
        on:input={resetStatus}
        min="2"
        step="1"
        max="25"
      />
      {totalSteps + 1}
    </label>
    <label for="probUp" style=""
      ><M>p</M>:
      <input
        type="range"
        name="probUp"
        id="probUp"
        bind:value={probUp}
        min="0"
        step="0.01"
        max="1"
      />
      {probUp}
    </label>
    <label for="timeStep">
      Antsiness:
      <input
        type="range"
        name="timeStep"
        id="timeStep"
        bind:value={timeStep}
        min="5"
        max="100"
        step="5"
      />{timeStep}</label
    >
    <!-- <button
      on:click={() => {
        stopGo = !stopGo;
        if (stopGo) requestAnimationFrame(render);
      }}>{stopGo ? 'Stop' : 'Go'}</button
    > -->
    <div>
      <button
        on:click|preventDefault={() => {
          status.find((e) => e.i == 0 && e.j == 0).count += 1;
        }}
      >
        ANT!
      </button>
      <button
        class:down={stopGo}
        on:click|preventDefault={() => (stopGo = !stopGo)}
        >AntLock&trade;</button
      >
    </div>
  </div>

  <div class="blockBox">
    <button on:click={resetStatus}>Reset</button>
    <input
      type="number"
      min="0"
      step="1"
      max={totalSteps}
      bind:value={blockI}
    />
    <input
      type="number"
      min="0"
      step="1"
      max={totalSteps}
      bind:value={blockJ}
    />
    <button
      id="blockbutton"
      on:click|preventDefault={() => {
        const elem = status.find((e) => e.i == blockJ && e.j == blockI);
        if (elem) {
          elem.blocked = !elem.blocked;
        } else {
          blockWarn = "Not in range";
          setTimeout(() => (blockWarn = ""), 1000);
        }
      }}>&PlusMinus;Block</button
    > <span class="warn">{blockWarn}</span>
  </div>
</div>

<style>
  .container {
    position: relative;
    height: 75vh;
    bottom: 5%;
  }
  canvas {
    width: 100%;
    max-width: 1000px;
    height: 100%;
  }
  div#controls {
    width: 70%;
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: baseline;
    flex-direction: column;
  }

  button {
    color: aliceblue;
    background-color: navy;
    border-radius: 15%;
    padding: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  button:active,
  .down {
    background-color: blueviolet;
  }

  .blockBox {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    width: 400px;
    justify-content: flex-start;
    gap: 10px;
  }
  .warn {
    font-size: large;
    color: red;
  }

  #blockbutton {
    background-color: maroon;
  }
  #blockbutton:active {
    background-color: red;
  }
  label {
    display: inline-flex;
    align-items: center;
  }
</style>
