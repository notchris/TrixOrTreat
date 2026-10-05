import { ACESFilmicToneMapping, PCFSoftShadowMap, WebGLRenderer } from "three";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";

export function createRenderer(canvas: HTMLCanvasElement, context: WebGLRenderingContext): WebGLRenderer {
    const renderer = new WebGLRenderer({
        canvas,
        context,
        antialias: true
    })
    renderer.setSize(GAME_WIDTH, GAME_HEIGHT)
    renderer.setPixelRatio(1)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap
    renderer.toneMapping = ACESFilmicToneMapping

    renderer.toneMappingExposure = 0.5

    return renderer
}