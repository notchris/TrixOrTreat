import * as CANNON from 'cannon-es'
import { Body } from 'cannon-es';
import { Group, Object3D, Vector3 } from "three";
import { PLAYER_DEPTH, PLAYER_HEIGHT, PLAYER_WIDTH } from '../config';

export async function createPlayer(start: Vector3, group: Object3D) {
    const { x, y, z } = start

    const playerSideWidth = 0.1
    const playerSideHeight = 2

    const playerSensor = new CANNON.Body({ collisionFilterGroup: 1, type: Body.KINEMATIC, mass: 0, position: new CANNON.Vec3(x, y, z - 10), shape: new CANNON.Box(new CANNON.Vec3(PLAYER_WIDTH / 2, PLAYER_HEIGHT / 2, PLAYER_DEPTH / 2)) })

    const player = new CANNON.Body({ collisionFilterGroup: 1, type: Body.KINEMATIC, mass: 0, position: new CANNON.Vec3(x, y, z - 10) })


    const playerSideLeft = new CANNON.Box(new CANNON.Vec3(playerSideWidth, playerSideHeight, PLAYER_DEPTH / 2))
    const playerSideRight = new CANNON.Box(new CANNON.Vec3(playerSideWidth, playerSideHeight, PLAYER_DEPTH / 2))


    player.addShape(playerSideLeft, new CANNON.Vec3((-PLAYER_WIDTH / 2) + playerSideWidth - 0.75, playerSideHeight - 1, 0), new CANNON.Quaternion(0, 0, 0.15))
    player.addShape(playerSideRight, new CANNON.Vec3((PLAYER_WIDTH / 2) + playerSideWidth + 0.75, playerSideHeight - 1, 0), new CANNON.Quaternion(0, 0, -0.15))


    const playerGroup = new Group()
    playerGroup.add(group)

    return {
        player,
        playerGroup,
        playerSensor
    }

}