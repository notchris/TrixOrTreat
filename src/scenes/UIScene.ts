import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ToastQueue } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { MainScene } from './MainScene';

function formatTime(seconds: number) {
    // Minutes
    let minutes = Math.floor(seconds / 60);
    // Seconds
    let partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    let partInSecondsString = partInSeconds.toString().padStart(2, '0');
    // Returns formated time
    return `${minutes}:${partInSecondsString}`;
}

export class UIScene extends Phaser.Scene {
    rexUI!: UIPlugin;
    toastQueue!: ToastQueue;
    initialTime: number = 60
    timer!: Phaser.GameObjects.Text
    score: number = 0
    scoreText!: Phaser.GameObjects.Text
    timedEvent!: Phaser.Time.TimerEvent

    constructor() {
        super({
            key: "UIScene"
        })
    }

    init(): void {
        this.score = 0
        this.initialTime = 60
    }

    preload(): void {

    }

    create(): void {


        this.timer = this.add.text(32, 32, 'TIME: ' + formatTime(this.initialTime), {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: 'white',
            stroke: '#000',
            strokeThickness: 3
        });

        this.scoreText = this.add.text(32, 64, 'SCORE: ' + 0, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: 'white',
            stroke: '#000',
            strokeThickness: 3
        });



        this.toastQueue = new ToastQueue(this, {
            x: 60, y: this.game.canvas.height - 60,
            originY: 1,
            originX: 0,
            space: { item: 4 },


            createMessageLabelCallback(scene, message) {
                return (scene as UIScene).rexUI.add.label({
                    width: 240,
                    space: { left: 0, right: 10, top: 10, bottom: 10 },
                    text: scene.add.text(0, 0, message as string, {
                        fontSize: '14px',
                        fontFamily: 'Arial Black',
                        color: (message as string).includes('-') ? 'red' : 'white',
                        stroke: '#000',
                        strokeThickness: 3
                    }),
                    wrapText: true,

                });
            },

            duration: {
                hold: 2000
            }

        });
        this.add.existing(this.toastQueue);

    }

    getItem(name: string, val: number) {
        if (Math.sign(val) > 0) {
            this.toastQueue.showMessage(`${name.toUpperCase()} +${val}`);

        } else {
            this.toastQueue.showMessage(`${name.toUpperCase()} ${val}`);
        }
        this.score += val

        this.scoreText.setText(`SCORE: ${this.score}`)
    }

    startTimer() {

        // Each 1000 ms call onEvent
        this.timedEvent = this.time.addEvent({
            delay: 1000, callback: () => {
                if (this.initialTime <= 0) {
                    (this.scene.get('MainScene') as MainScene).stopGame(this.score)
                    this.timedEvent.destroy()
                    return
                }
                this.initialTime -= 1; // One second

                this.timer.setText('TIME: ' + formatTime(this.initialTime));

            }, callbackScope: this, loop: true
        });

    }
}