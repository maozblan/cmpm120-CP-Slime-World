class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    init() {
        this.VEL = 100  // slime velocity constant
    }

    preload() {
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.image('tilesetImage', 'tileset.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'overworld.json') // export from tiled and rename to .JSON
    }

    create() {
        // space for tilemap
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tileset', 'tilesetImage')
        const bgLayer =  map.createLayer('background', tileset, 0, 0) // same layer naming as tiled!
        const terrainLayer =  map.createLayer('terrain', tileset, 0, 0)
        const treeLayer =  map.createLayer('trees', tileset, 0, 0)
        const extrasLayer =  map.createLayer('extras', tileset, 0, 0)

        // add slime
        this.slime = this.physics.add.sprite(32, 32, 'slime', 0)
        this.slime.body.setCollideWorldBounds(true)

        // slime animation
        this.anims.create({
            key: 'jiggle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {
                start: 0,
                end: 1,
            }),
        })
        this.slime.play('jiggle') // there's no other animations to play

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }

        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }

        this.direction.normalize()
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}