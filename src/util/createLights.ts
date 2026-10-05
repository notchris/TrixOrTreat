import { AmbientLight, DirectionalLight, Light } from "three";

export function createLights(): Light[] {

    const dirLight = new DirectionalLight(0xffffff, 0.8);

    dirLight.position.set(0, 20, 10);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    const d = 20;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 20;
    dirLight.shadow.normalBias = 0.03;

    return [dirLight, new AmbientLight(0xdddddd, 3)]
}