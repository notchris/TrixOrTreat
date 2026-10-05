import { Object3D, Scene } from "three";
import { createItem } from "./createItem";
import { World } from "cannon-es";

const parseItems = (scene: Scene, world: World, objects: Object3D[]) => {
    objects.forEach((o) => {
        const props = o.userData

        const itemType = props.itemType as number

        if (!itemType) {
            throw new Error('Invalid item type')
        }

        if (itemType === 1) {
            console.log('item found')
            createItem(scene, world, o.position)
        }


    })
}

export { parseItems }