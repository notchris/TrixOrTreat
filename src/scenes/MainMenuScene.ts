
export class MainMenuScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainMenuScene"
        })
    }

    init(): void { }

    create(): void {


        const { width, height } = this.sys.game.canvas

        const logo = this.add.image(width / 2, (height / 2) - 200, 'logo')
        logo.setScale(0.5)

        const items = [{
            id: 'new',
            label: 'NEW GAME',
            action: () => {
                this.scene.start('MainScene')
            }
        }, {
            id: 'credits',
            label: 'CREDITS',
            action: () => {
                this.scene.start('CreditsScene')
            }
        }]

        const offset = 110

        items.forEach((item, index) => {
            const itemGroup = this.add.group()

            const itemBg = this.add.image(width / 2, (height / 2) + (index * offset), 'menuItemBg')
            itemBg.setScale(0.5)

            const { x, y } = itemBg.getCenter()
            const itemText = this.add.text(x, y, item.label, { color: 'black', align: 'center', fontFamily: 'Arial Black', fontSize: '30px' })
            itemText.setOrigin(0.5)

            itemGroup.add(itemBg)
            itemGroup.add(itemText)

            itemBg.setInteractive()

            itemBg.on('pointerover', () => {
                itemBg.setTint(0xFF4B1D)
                itemText.setColor('#FFFFFF')
            }, this);
            itemBg.on('pointerout', () => {
                itemBg.setTint(0xFFFFFF)
                itemText.setColor('#000000')
            }, this);

            itemBg.on('pointerdown', () => {
                item.action()
            }, this);
        })

    }
}