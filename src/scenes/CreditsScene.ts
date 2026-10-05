
export class CreditsScene extends Phaser.Scene {
    score: number = 0
    constructor() {
        super({
            key: "CreditsScene"
        })
    }


    preload(): void {

    }

    create(): void {

        const msg = this.add.text(this.game.canvas.width / 2, 100, `CREATED BY NOTCHRIS`, {
            color: 'white',
            fontFamily: 'Arial Black',
            fontSize: '30px',
            align: 'center'
        })
        msg.setOrigin(0.5)

        const msg3 = this.add.text(this.game.canvas.width / 2, 160, `WITH HELP FROM MY WIFE TRIXI <3`, {
            color: 'white',
            fontFamily: 'Arial Black',
            fontSize: '20px',
            align: 'center'
        })
        msg3.setOrigin(0.5)

        const msg2 = this.add.text(this.game.canvas.width / 2, 240, `CHECK OUT SOME COOL TWITCH STREAMERS:`, {
            color: 'white',
            fontFamily: 'Arial Black',
            fontSize: '20px',
            align: 'center'
        })
        msg2.setOrigin(0.5)

        const streamers = ['uandmeems', 'palmtoptigre', 'otakotan', 'erincaseygamers', 'rosethornttv', 'apothicdecay', 'ambailie', 'necrovarius',]

        streamers.forEach((s, i) => {
            const t = this.add.text(this.game.canvas.width / 2, 280 + (i * 40), s, {
                color: 'white',
                fontFamily: 'Arial Black',
                fontSize: '20px',
                align: 'center'
            })
            t.setOrigin(0.5)
        })


        const btn = this.add.image(this.game.canvas.width / 2, 620, 'menuItemBg')
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