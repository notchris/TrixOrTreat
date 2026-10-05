
export class LoadingScene extends Phaser.Scene {

    constructor() {
        super({
            key: "LoadingScene"
        })
    }

    init(): void { }

    preload(): void {
        this.load.image('logo', 'logo_old.png')
        this.load.image('menuItemBg', 'menuItem.png')
    }

    create(): void {
        console.log('Loading...')
        this.scene.start('MainMenuScene')
    }
}