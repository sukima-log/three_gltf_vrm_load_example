import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene: THREE.Scene;               // シーン定義
let camera: THREE.PerspectiveCamera;  // カメラ定義
let renderer: THREE.WebGLRenderer;    // レンダラー定義
let controls: OrbitControls;          // OrbitControls追加

function init() {
  /* シーン作成 */
  scene = new THREE.Scene();
  /* カメラ作成 */
  camera = new THREE.PerspectiveCamera(
    45,                                     // 視野
    window.innerWidth / window.innerHeight, // アスペクト比
    0.1,                                    // どの程度のカメラ距離から描画を始めるか
    1000                                    // どのくらい遠くまで見えるか
  );
  scene.add(camera);
  // カメラのポジションと向き
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  // シーンの中心にカメラを向ける
  camera.lookAt(scene.position);

  /* レンダラー作成 */
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ライト作成 */
  // 均等光源(影ができない)
  var ambientLight = new THREE.AmbientLight(0x0c0c0c, 1);
  scene.add(ambientLight);
  // 点座標への光源(影ができる)
  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(-20, 30, -5);
  spotLight.castShadow = true; // 影を落とす
  scene.add(spotLight);
  // 無限遠からの平行光源
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(20, -30, 5).normalize(); // 光源方向設定
  scene.add(directionalLight);

  /* glbファイルの読み込み */
  const loader = new GLTFLoader();
  loader.load ('assets/models/gltf/book_1204.glb', function(gltf){
    gltf.scene.scale.set(6, 6, 6);                      // モデルスケール変更
    gltf.scene.position.set(0, 0, 0);                   // モデル位置変更
    gltf.scene.rotation.set(0, (0 * Math.PI /180), 0);  // モデル向き変更
    scene.add(gltf.scene);                              // モデルをシーンに追加
  }, undefined, function (error) {
    console.error(error);
  }); 

  // レンダラーの出力をhtmlに追加
  const container = document.getElementById("WebGL-output");
  if (container) {
    container.appendChild(renderer.domElement);
  }
  // OrbitControlsを初期化し、カメラとレンダラーを渡す
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true; // カメラの回転を有効化

  /* シーンを描画 */
  render();
}

// シーン描画関数
function render() {
  requestAnimationFrame(render);  // レンダリング(再帰)
  renderer.render(scene, camera); // 表示
}

// 表示領域をウィンドウサイズに合わせる
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 表示が終わってからThree.js関連処理(関数init)実行
window.addEventListener("load", init);

// リサイズイベント
window.addEventListener("resize", onResize, false);
