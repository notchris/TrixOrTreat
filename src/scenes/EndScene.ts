
export class EndScene extends Phaser.Scene {
    score: number = 0
    constructor() {
        super({
            key: "EndScene"
        })
    }

    init(data: { score: number }): void {
        this.score = data.score
    }

    preload(): void {

    }

    create(): void {

        const msg = this.add.text(this.game.canvas.width / 2, 100, `YOU GOT ${this.score} CANDY. HOLY COW!`, {
            color: 'white',
            fontFamily: 'Arial Black',
            fontSize: '30px',
            align: 'center'
        })
        msg.setOrigin(0.5)


        const btn = this.add.image(this.game.canvas.width / 2, 300, 'menuItemBg')
        btn.setScale(0.5)
        btn.setInteractive()

        const { x, y } = btn.getCenter()

        const btnText = this.add.text(x, y, 'BACK TO MENU', {
            color: 'black',
            fontFamily: 'Arial Black',
            fontSize: '30px',
            align: 'center'
        })
        btnText.setOrigin(0.5)

        btn.on('pointerover', () => {
            btn.setTint(0xFF4B1D)
            btnText.setColor('white')
        }, this);
        btn.on('pointerout', () => {
            btn.setTint(0xffffff)
            btnText.setColor('#000000')
        }, this);

        btn.on('pointerdown', () => {
            this.scene.start('MainMenuScene')
        }, this);
    }
}