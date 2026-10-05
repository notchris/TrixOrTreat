import { Body, Sphere, World } from "cannon-es";
import { Mesh } from "three";
import { ShapeType, threeToCannon } from "three-to-cannon";
import { materials } from './contactMaterials'

import { Tween } from '@tweenjs/tween.js'


interface MeshData {
    hull?: boolean;
    moving?: boolean;
    yoyo?: boolean;
    time?: number;
    to?: [number, number, number],
    // Other
    [key: string]: any;
}

export const parseMesh = (world: World, mesh: Mesh) => {

    console.log(world)

    const props = mesh.userData as MeshData

    // mesh.material = threeMaterials.base
    // mesh.material.needsUpdate = true
    mesh.castShadow = true
    mesh.receiveShadow = false

    let shapeType = props.type === 2 ? ShapeType.SPHERE : ShapeType.BOX

    let bodyType = Body.DYNAMIC

    const result = threeToCannon(mesh, { type: shapeType });

    if (!result) throw new Error('Invalid shape for body')

    let body;

    // Fix Lolipops
    if (mesh.name.includes('pop')) {
        body = new Body({ mass: 1, type: bodyType, material: materials.ground })
        const shape = new Sphere(0.5)
        body.addShape(shape)
    } else {
        body = new Body({ mass: 1, type: bodyType, material: materials.ground })
        const { shape, offset, orientation } = result;
        body.addShape(shape, offset, orientation);
    }

    // Set Point values

    const small = ['Candy_Corn', 'Green_Zkitlle', 'Purple_Zkittle', 'Red_Zkittle', 'Yellow_Zkittle', 'Blue_Zkittle', 'Orange_Zkittle', 'Small_Chocolate', 'Candy_Pumpkin',]

    const medium = ['Medium_Chocolate', 'Blue_Lolipop', 'Purple_Lolipop', 'Green_Lolipop', 'Pink_Lolipop', 'Orange_Lolipop', 'Chocolate_Lolipop']

    const large = ["Rezy's_Bar", 'Hurshees_Bar', 'Cronch_Bar', 'CatCat_Bar', 'Big_Chocolate', 'Sneakers_Bar']

    const bad = ['Apple', 'Floss', 'Book']

    let val = 0

    if (small.includes(mesh.name)) {
        val = 10
    } else if (medium.includes(mesh.name)) {
        val = 50
    } else if (large.includes(mesh.name)) {
        val = 100
    } else if (bad.includes(mesh.name)) {
        val = -100
    }

    mesh.userData.itemName = mesh.name.replace('_', ' ')
    mesh.userData.itemValue = val

    let tween: Tween | undefined


    return {
        mesh,
        body,
        tween
    }


}