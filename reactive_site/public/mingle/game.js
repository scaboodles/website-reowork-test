var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 750,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 100 },
        },
    },
    pixelArt: true,
    antialias: false,
    autoRound: true,
    roundPixels: true,
    backgroundColor: "#FFFF00",
    inputKeyboard: true,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

//global variables dont @me
var space;
var left;
var right;
var down;
var j;
var k;
var l;
var follow_bool = true;

function toggle_follow() {
    follow_bool = !follow_bool;
}

var game = new Phaser.Game(config), Main = function () {};
const SCENE_WIDTH = 3200;
const SCENE_HEIGHT = 2000;

var pigeon;
var pigeonSound;
var back;
var mid;
var fore;
var splashScreen;
var squawkImg;

var lastSampleTime = 0;
var onGround = true;
var pigeonAgents = []; //list of computer pigeons
var observedRadius = 550; //distance computer pigeons can see
var perches = [];
var businessMen = [];

const MAX_VELOCITY = { x: 300, y: 300 };
const DRAG_X = 0.85;
const LIFT_DRAG = 0.5;
const BODY_OFFSET = { x: 3, y: 1 };
const MAX_FLOCK = 2;
const PIGEON_DIMENSIONS = { width: 7, height: 11 };
const FLOCK_NOISE = 100;
const LEADING_WEIGHT = 2;
const FLAP_CONST = 100;

//preload fetches assets and stuff
function preload() {
    this.load.aseprite(
        "pigeon",
        "/art_assets/pigeon16by.png",
        "/art_assets/pigeon16by.json"
    );
    this.load.image("ground", "/art_assets/placeholder_ground.png");
    this.load.audio("pigeonNoise", ["/pigeon_sound.mp3"]);

    this.load.image("sky", "/art_assets/bg_skyline.png");
    this.load.image("back", "/art_assets/bg_back.png");
    this.load.image("mid", "/art_assets/bg_mid.png");
    this.load.image("fore", "/art_assets/bg_fore.png");

    this.load.image("park", "/art_assets/park.png");

    this.load.image("squawkImg", "/art_assets/squawk.png");

    this.load.image("splashScreen", "/art_assets/pigeonSplashScreen.png");
    this.load.image("bench", "/art_assets/bench.png");
    this.load.image("gizmo", "/art_assets/gizmo.png");
    this.load.image("lamp", "/art_assets/lamp.png");
    
    this.load.image("redBrickBuilding", "/art_assets/red_brick_building.png");
    this.load.image("empty", "/art_assets/empty.png");

    this.load.aseprite("businessMan","/art_assets/bizniz_man.png","/art_assets/bizniz_man.json");
}

//create loads assets into scene
function create() {
    const player_layer = this.add.layer().setDepth(5);
    const pigeon_layer = this.add.layer().setDepth(4);
    const man_layer = this.add.layer().setDepth(3);
    const prop_layer = this.add.layer().setDepth(2);
    const building_layer = this.add.layer().setDepth(1);
    const bg_layer = this.add.layer().setDepth(0);

    //prep scene
    this.physics.world.setBounds(
        0,
        0,
        SCENE_WIDTH,
        SCENE_HEIGHT,
        true,
        true,
        true,
        true
    );
    this.cameras.main.setSize(800, 750);

    //add art and sound
    bg_layer.add(this.add.image(800, 400, "sky").setScrollFactor(0.15).setScale(10, 10));

    bg_layer.add(this.add.image(1600, 1300, "park").setScale(10, 10));

    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    l = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

    var tags = this.anims.createFromAseprite("pigeon");
    var manTages = this.anims.createFromAseprite("businessMan");

    //player is created
    pigeon = this.physics.add
        .sprite(100, 100,"pigeon")
        .play({ key: "idle", frameRate: 2, repeat: -1 })
        .setScale(3);
    pigeon.setCollideWorldBounds(true);
    pigeon.body.setSize(
        PIGEON_DIMENSIONS.width,
        PIGEON_DIMENSIONS.height,
        true
    );
    pigeon.body.setOffset(BODY_OFFSET.x, BODY_OFFSET.y);
    pigeon.body.setMaxVelocity(MAX_VELOCITY.x, MAX_VELOCITY.y);
    pigeon.body.allowDrag = true;
    pigeon.setDamping(true);
    pigeon.body.setDragX(DRAG_X);
    pigeon.body.checkCollision.up = false;
    pigeon.body.checkCollision.left = false;
    pigeon.body.checkCollision.right = false;
    pigeon.onPerch = false;
    pigeon.currPerch = 0;
    player_layer.add(pigeon);

    this.cameras.main
        .setBounds(0, 0, SCENE_WIDTH, SCENE_HEIGHT, true)
        .startFollow(pigeon)
        .setDeadzone(0, 0);

    const game = this;

    //make pigeon function creates computer controlled pigeons
    window.makePigeon = function () {
        let robo_pigeon = game.physics.add
            .sprite(pigeon.body.position.x, pigeon.body.position.y,"pigeon")
            .play({ key: "idle", frameRate: 2, repeat: -1 })
            .setScale(3);
        robo_pigeon.setCollideWorldBounds(true);
        robo_pigeon.body.setSize(
            PIGEON_DIMENSIONS.width,
            PIGEON_DIMENSIONS.height,
            true
        );
        robo_pigeon.setOffset(BODY_OFFSET.x, BODY_OFFSET.y);
        robo_pigeon.body.setMaxVelocity(MAX_VELOCITY.x, MAX_VELOCITY.y);
        robo_pigeon.body.allowDrag = true;
        robo_pigeon.setDamping(true);
        robo_pigeon.body.checkCollision.up = false;
        robo_pigeon.body.checkCollision.left = false;
        robo_pigeon.body.checkCollision.right = false;
        robo_pigeon.body.setDragX(DRAG_X);
        robo_pigeon.onPerch = false;
        robo_pigeon.currPerch = 0;
        pigeon_layer.add(robo_pigeon);

        for (let prop of perches) {
            game.physics.add.collider(robo_pigeon, prop, function () {
                robo_pigeon.onPerch = true;
                robo_pigeon.currPerch = prop;
            });
        }
        pigeonAgents.push({
            object: robo_pigeon,
            flapCompleted: true,
            mode: "stand",
            freezeFrame: 0,
            noise: {
                x: generateNoisy(FLOCK_NOISE),
                y: generateNoisy(FLOCK_NOISE),
            },
            target: 0,
            justLanded: true,
            slice: 0,
            independent: false,
            following: -1,
        });
    };

    window.makeIndependentPigeon = function () {
        let robo_pigeon = game.physics.add
            .sprite(100, 100,"pigeon")
            .play({ key: "idle", frameRate: 2, repeat: -1 })
            .setScale(3);
        robo_pigeon.setCollideWorldBounds(true);
        robo_pigeon.body.setSize(
            PIGEON_DIMENSIONS.width,
            PIGEON_DIMENSIONS.height,
            true
        );
        robo_pigeon.setOffset(BODY_OFFSET.x, BODY_OFFSET.y);
        robo_pigeon.body.setMaxVelocity(MAX_VELOCITY.x, MAX_VELOCITY.y);
        robo_pigeon.body.allowDrag = true;
        robo_pigeon.setDamping(true);
        robo_pigeon.body.checkCollision.up = false;
        robo_pigeon.body.checkCollision.left = false;
        robo_pigeon.body.checkCollision.right = false;
        robo_pigeon.body.setDrag(DRAG_X);
        robo_pigeon.onPerch = false;
        robo_pigeon.currPerch = 0;
        pigeon_layer.add(robo_pigeon);

        for (let prop of perches) {
            game.physics.add.collider(robo_pigeon, prop, function () {
                robo_pigeon.onPerch = true;
                robo_pigeon.currPerch = prop;
            });
        }
        let noises = {
            x: generateNoisy(FLOCK_NOISE),
            y: generateNoisy(FLOCK_NOISE),
        };
        let newTarget = generateRoamTarget(noises.x);
        noises.x = newTarget[1];
        pigeonAgents.push({
            object: robo_pigeon,
            flapCompleted: true,
            mode: "stand",
            freezeFrame: 0,
            noise: noises,
            target: newTarget[0],
            justLanded: false,
            slice: 0,
            independent: true,
            following: -1,
        });
    };
    window.makeBench = function () {
        let bench = game.physics.add.staticSprite(
            pigeon.body.position.x,
            pigeon.body.position.y,
            "bench"
        );
        bench.offsetX = 9;
        bench.body.setSize(174, 5, true).setOffset(bench.offsetX, 0);
        perches.push(bench);
        prop_layer.add(bench);
        game.physics.add.collider(pigeon, bench, function () {
            pigeon.onPerch = true;
            pigeon.currPerch = bench;
        });
        for (agent of pigeonAgents) {
            let currAgent = agent;
            game.physics.add.collider(agent.object, bench, function () {
                currAgent.object.onPerch = true;
                currAgent.object.currPerch = bench;
            });
        }
    };

    window.makeLamp = function () {
        let lamp = game.physics.add.staticSprite(
            pigeon.body.position.x,
            pigeon.body.position.y,
            "lamp"
        );
        lamp.offsetX = 10;
        lamp.body.setSize(30, 5, true).setOffset(lamp.offsetX, 10);
        perches.push(lamp);
        prop_layer.add(lamp);
        game.physics.add.collider(pigeon, lamp, function () {
            pigeon.onPerch = true;
            pigeon.currPerch = lamp;
        });
        for (agent of pigeonAgents) {
            let currAgent = agent;
            game.physics.add.collider(agent.object, lamp, function () {
                currAgent.object.onPerch = true;
                currAgent.object.currPerch = lamp;
            });
        }
    };

    window.makeBusinessMan = function () {
        let man = game.physics.add.sprite(pigeon.body.position.x, SCENE_HEIGHT - 96,"businessMan")
            .play({ key: "man_walk", frameRate: 2, repeat: -1 })
            .setScale(3);
        man.facing = randomDirection();
        man.body.setAllowGravity(false);
        businessMen.push(man);
        man_layer.add(man);
    }

    window.togglePerch = function (entity, bool) {
        entity.onPerch = bool;
    };

    window.drawGizmo = function({x,y}){
        let gizmo = game.add.sprite(x,y,"gizmo");
        player_layer.add(gizmo);
        return({x,y});
    }

    //--------------------
    drawMap(this, building_layer, prop_layer);
}

function drawMap(game, buildingLayer, propLayer){
    makeBuilding(game,buildingLayer,500);
}

function makeBuilding(game, buildingLayer, x){
    let yOffset = 750
    let topPerch = game.physics.add.staticSprite(x, SCENE_HEIGHT - yOffset, "redBrickBuilding");
    topPerch.body.setSize(topPerch.body.width, 5).setOffset(0,0);
    buildingLayer.add(topPerch);
    perches.push(topPerch);
    game.physics.add.collider(pigeon, topPerch, function () {
        pigeon.onPerch = true;
        pigeon.currPerch = topPerch;
    });
    for (agent of pigeonAgents) {
        let currAgent = agent;
        game.physics.add.collider(agent.object, topPerch, function () {
            currAgent.object.onPerch = true;
            currAgent.object.currPerch = topPerch;
        });
    }
    addSills(game, x, yOffset);
    addRailings(game, x, yOffset);
}
function addRailings(game, x, yOffset){
    let xOffset = x + 11;
    yOffset = SCENE_HEIGHT - yOffset + 310;
    for(let i = 0; i<3; i++){
        addRailing(game, xOffset, yOffset - (i*320));
    }
}

function addRailing(game, x, yOffset){
    let railing = game.physics.add.staticSprite(x, yOffset,"empty");
    railing.body.setSize(435,5);
    perches.push(railing);
    game.physics.add.collider(pigeon, railing, function () {
        pigeon.onPerch = true;
        pigeon.currPerch = railing;
    });
    for (agent of pigeonAgents) {
        let currAgent = agent;
        game.physics.add.collider(agent.object, railing, function () {
            currAgent.object.onPerch = true;
            currAgent.object.currPerch = railing;
        });
    }
}

function addSills(game, x, yOffset){
    yOffset += 497;
    for(let i = 0; i<3; i++){
        addTopSillRow(game,x,yOffset - (i * 322), i != 0);
        addBottomSillRow(game,x,yOffset - (i * 322), i != 0);
    }
}
function addBottomSillRow(game, x, yOffset, obscured){
    let sills = [];
    let xOffset = x - 340;
    yOffset = SCENE_HEIGHT - yOffset+215;
    let secondSill = game.physics.add.staticSprite(xOffset, yOffset,"empty");
    sills[0] = secondSill;
    xOffset = x + 340;
    let fourthSill = game.physics.add.staticSprite(xOffset, yOffset,"empty");
    sills[1] = fourthSill;
    for(sill of sills){
        let currSill = sill;
        currSill.body.setSize(125,5);
        perches.push(sill);
        game.physics.add.collider(pigeon, currSill, function () {
            pigeon.onPerch = true;
            pigeon.currPerch = currSill;
        });
        for (agent of pigeonAgents) {
            let currAgent = agent;
            game.physics.add.collider(agent.object, currSill, function () {
                currAgent.object.onPerch = true;
                currAgent.object.currPerch = currSill;
            });
        }
    }
}

function addTopSillRow(game,x,yOffset,obscured){
    let sills = [];
    let xOffset = x - 117;
    yOffset = SCENE_HEIGHT - yOffset ;
    if(!obscured){
        let firstSill = game.physics.add.staticSprite(xOffset, yOffset,"empty");
        sills[3] = firstSill;
   }
    xOffset -= 223;
    let secondSill = game.physics.add.staticSprite(xOffset, yOffset,"empty");
    sills[0] = secondSill;
    
    xOffset = x + 117;
    let thirdSill = game.physics.add.staticSprite(xOffset, yOffset,"empty");
    sills[1] = thirdSill;
    xOffset += 223;
    let fourthSill = game.physics.add.staticSprite(xOffset, yOffset,"empty");
    sills[2] = fourthSill;
    for(sill of sills){
        let currSill = sill;
        currSill.body.setSize(175,5);
        perches.push(currSill);
        game.physics.add.collider(pigeon, currSill, function () {
            pigeon.onPerch = true;
            pigeon.currPerch = currSill;
        });
        for (agent of pigeonAgents) {
            let currAgent = agent;
            game.physics.add.collider(agent.object, currSill, function () {
                currAgent.object.onPerch = true;
                currAgent.object.currPerch = currSill;
            });
        }
    }
}

// lastState is immutable!!
let lastState = {
    direction: 1,
    mode: "walk",
};

//update runs every tick
function update(time, delta) {
    let direction = Phaser.Input.Keyboard.JustDown(left)
        ? -1
        : Phaser.Input.Keyboard.JustDown(right)
        ? 1
        : lastState.direction; //direction for player

    const isGrounded = pigeon.body.onFloor();

    pigeon.body.setDragY(pigeon.body.velocity.y > 0 ? 0 : LIFT_DRAG);
    if (!isGrounded) {
        pigeon.onPerch = false;
    }

    let mode = getNewMode(lastState.mode, isGrounded, { space, left, right });

    if (direction != lastState.direction) {
        pigeon.flipX = direction == -1 ? true : false;
        pigeon.body.setVelocityX(0);
    }

    if (mode != lastState.mode) {
        pigeon.play(PIGEON_STATE_ANIMATIONS.get(mode));
    }

    // just flapped
    if (Phaser.Input.Keyboard.JustDown(space)) {
        for (agent of pigeonAgents) {
            agent.sawFlap = true;
        }
        if (left.isDown || right.isDown) {
            flapMove(pigeon);
        } else {
            flapNoMove(pigeon);
        }
    } else if (mode != lastState.mode) {
        switch (mode) {
            case "stand":
                stand(pigeon);
                break;
        }
    } else {
        switch (mode) {
            case "walk":
                walk(pigeon);
                break;
            case "drift":
                drift(pigeon);
                break;
            case "dive":
                dive(pigeon);
                break;
            case "glide":
                glide(pigeon);
                break;
            case "swoop":
                swoop(pigeon);
                break;
        }
    }

    if (direction != lastState.direction || mode != lastState.mode) {
        lastState = { mode, direction };
    }
    if (mode == "dive" || pigeon.body.velocity.y > 150) {
        pigeon.body.checkCollision.down = false;
    } else {
        pigeon.body.checkCollision.down = true;
    }

    //    if(Phaser.Input.Keyboard.JustDown(j)){
    //        pigeonSound.play();
    //        //console.log("playing sound");
    //    }

    for (agent of pigeonAgents) {
        pigeonThink(agent, delta);
    }
    for(man of businessMen){
        businessManLogic(man);
    }
}

function businessManLogic(man){
    man.flipX = man.facing == 1 ? false:true;
    man.x += 1.5 * man.facing;
} 

//functionally decomposed mmovement bby yeah
function flapMove(pigeon) {
    pigeon.setVelocity(
        pigeon.body.velocity.x + 20 * (pigeon.flipX ? -1 : 1),
        pigeon.body.velocity.y - 30
    );
}

function flapNoMove(pigeon) {
    pigeon.setVelocity(
        pigeon.body.velocity.x + 10 * (pigeon.flipX ? -1 : 1),
        pigeon.body.velocity.y - 40 - pigeon.body.position.y / 20
    );
}

function glide(pigeon) {
    pigeon.setVelocityY(pigeon.body.velocity.y - .75);
    pigeon.setVelocityX(pigeon.body.velocity.x + 1 * (pigeon.flipX ? -1 : 1));
}

function drift(pigeon) {
    pigeon.setVelocityX(pigeon.body.velocity.x + 1 * (pigeon.flipX ? -1 : 1));
}

function walk(pigeon) {
    pigeon.x += 1 * (pigeon.flipX ? -1 : 1);
    pigeon.setVelocity((pigeon.flipX ? -1 : 1) * 0.5, 0);
}

function stand(pigeon) {
    pigeon.setVelocity(0, 0);
}

function dive(pigeon) {
    pigeon.setVelocityY(pigeon.body.velocity.y + 3);
    pigeon.setVelocityX(pigeon.body.velocity.x + 2 * (pigeon.flipX ? -1 : 1));
}

function swoop(pigeon) {
    pigeon.setVelocityX(pigeon.body.velocity.x + 2 * (pigeon.flipX ? -1 : 1));
}

function roboFlap(pigeon, posDifVector, velDifVector) {
    let body = pigeon.body;
    let velocity = body.velocity;
    if (posDifVector.y < 0) {
        body.setVelocityY(
            velocity.y -
                (Math.abs(posDifVector.y) / 3 + Math.abs(velDifVector.y) / 5)
        );
    }
    if (posDifVector.x * (pigeon.flipX ? -1 : 1) > 0) {
        body.setVelocityX(
            velocity.x +
                (Math.abs(posDifVector.x) / 4 + Math.abs(velDifVector.x) / 5) *
                    (pigeon.flipX ? -1 : 1)
        );
    }
}

//pigeon state machine
const PIGEON_STATE_ANIMATIONS = new Map([
    ["walk", { key: "walk", repeat: -1 }],
    ["stand", { key: "idle", frameRate: 2, repeat: -1 }],
    ["glide", { key: "flap_nomove", repeat: -1 }],
    ["fall", { key: "noflap_nomove", repeat: -1 }],
    ["drift", { key: "noflap_move", repeat: -1 }],
    ["dive", { key: "dive", repeat: -1 }],
    ["swoop", { key: "flap_move", repeat: -1 }],
]);

const PIGEON_STATE_MOVEMENT = new Map([
    ["walk", walk],
    ["stand", stand],
    ["drift", drift],
    ["glide", glide],
    ["dive", dive],
    ["swoop", swoop],
]);

var pigeonsMap = new Map();

//computer controlled pigeon actions feat spaghetti

function pigeonThink(dummy, delta) {
    let newMode;
    let sprite = dummy.object;


    if (dummy.object.onPerch && !dummy.object.body.onFloor()) {
        dummy.object.onPerch = false;
    }

    let descisions;
    if (dummy.independent) {
        descisions = roam(dummy);
    } else {
        let seenPigeons = seeOtherPigeons(dummy); //list of observed pigeons
        descisions = flock(dummy, seenPigeons); //sets movement booleans to stay with flock
    }

    sprite.body.setDrag(sprite.body.velocity.y > 0 ? 0 : LIFT_DRAG);

    //descisions holds  list of values
    let special = descisions[0];
    let flip = descisions[1];
    let leaning = descisions[2];
    let wings = descisions[3];

    if (flip != sprite.flipX) {
        sprite.body.setVelocityX(pigeon.body.velocity.x / 2);
    }
    sprite.flipX = flip;

    //flip if on world edge
    if (sprite.body.position.x <= 100) {
        sprite.flipX = false;
    }
    if (sprite.body.position.x >= SCENE_WIDTH - 100) {
        sprite.flipX = true;
    }

    if (dummy.freezeFrame >= FLAP_CONST) {
        //animation timer tied to robo_pigeon
        if (dummy.flapCompleted) {
            //boolean for anim timer flapping
            if (sprite.body.onFloor()) {
                //choose correct behavior based off of descisions list
                if (leaning) {
                    newMode = "walk";
                } else {
                    newMode = "stand";
                }
            } else if (special == 0) {
                if (wings) {
                    if (leaning) {
                        newMode = "swoop";
                    } else {
                        newMode = "glide";
                    }
                } else if (leaning) {
                    newMode = "drift";
                } else {
                    newMode = "fall";
                }
            } else {
                if (leaning) {
                    newMode = "glide";
                } else {
                    newMode = "swoop";
                }
            }
            if (newMode != dummy.mode) {
                dummy.mode = newMode;
                sprite.play(PIGEON_STATE_ANIMATIONS.get(dummy.mode));
            }
            if (special == 0) {
                if (dummy.mode != "fall") {
                    PIGEON_STATE_MOVEMENT.get(dummy.mode)(sprite);
                }
            } else if (special == "flap") {
                if (dummy.independent || (dummy.following.onPerch || dummy.onPerch)) {
                    if (leaning) {
                        flapMove(sprite);
                    } else {
                        flapNoMove(sprite);
                    }
                } else {
                    roboFlap(sprite, descisions[4], descisions[5]);
                }

                flap = false;
                dummy.flapCompleted = false;
                dummy.freezeFrame = 0;
            } else if (special == "dive") {
                dive(sprite);
                sprite.play(PIGEON_STATE_ANIMATIONS.get("dive"));
            }
        } else {
            dummy.freezeFrame = 0;
            dummy.flapCompleted = true;
            if (leaning) {
                dummy.mode = "drift";
            } else {
                dummy.mode = "fall";
            }
        }
    } else {
        sprite.play(PIGEON_STATE_ANIMATIONS.get(dummy.mode));
    }
    dummy.freezeFrame += delta;
    if (sprite.body.velocity.y > 150 || special == "dive") {
        sprite.body.checkCollision.down = false;
    } else {
        sprite.body.checkCollision.down = true;
    }
}

function seeOtherPigeons(observer) {
    let body1 = observer.object.body;
    let seenPigeons = [];
    let indiePigeons = [];

    for (agent of pigeonAgents) {
        if (agent.object == observer.object) {
            continue;
        }
        let body2 = agent.object.body;
        if (
            Phaser.Math.Distance.Between(
                body1.position.x,
                body1.position.y,
                body2.position.x,
                body2.position.y
            ) <= observedRadius
        ) {
            if (agent.independent) {
                indiePigeons.push(agent.object);
            } else {
                seenPigeons.push(agent.object);
            }
        }
    }
    if (seenPigeons.length > MAX_FLOCK) {
        if (seenPigeons.length < observer.slicer + MAX_FLOCK) {
            observer.slicer = generateRandomBetween(
                -1,
                seenPigeons.length - MAX_FLOCK + 1
            );
            seenPigeons = seenPigeons.slice(
                observer.slicer,
                observer.slicer + MAX_FLOCK
            );
        } else {
            seenPigeons = seenPigeons.slice(
                observer.slicer,
                observer.slicer + MAX_FLOCK
            );
        }
    }

    if (follow_bool) {
        if (
            Phaser.Math.Distance.Between(
                body1.position.x,
                body1.position.y,
                pigeon.body.position.x,
                pigeon.body.position.y
            ) <= observedRadius
        ) {
            observer.following = pigeon;
        } else if(observer.following == pigeon){
            observer.following = -1;
        }
    }else if(observer.following == pigeon){
        observer.following = -1;
    }

    if(observer.following != pigeon && !indiePigeons.includes(observer.following)){
        if(indiePigeons.length > 0){
            let rando = generateRandomBetween(-1, indiePigeons.length);
            observer.following = indiePigeons[rando];
        } else{
            observer.following = -1;
        }
    }
    if(observer.following != -1){
        for(i = 0; i<LEADING_WEIGHT; i++){
            seenPigeons.push(observer.following);
        }
    }

    return seenPigeons;
}

function flock(member, pigeonGroup) {
    let averagePosX = 0;
    let averagePosY = 0;
    let averageVelX = 0;
    let averageVelY = 0;

    let body = member.object.body;

    let minPosX = body.position.x;
    let maxPosX = body.position.x;


    for (agent of pigeonGroup) {
        if (agent == member.object) {
            continue;
        }
        let body2 = agent.body;

        averageVelX += body2.velocity.x;
        averageVelY += body2.velocity.y;
        averagePosX += body2.position.x;
        averagePosY += body2.position.y;

        if (body2.position.x > maxPosX) {
            maxPosX = body2.position.x;
        } else if (body2.position.x < minPosX) {
            minPosX = body2.position.x;
        }
    }
    minPosX = minPosX < 100 ? 100 : minPosX;
    maxPosX = maxPosX > SCENE_WIDTH - 100 ? SCENE_WIDTH - 100 : maxPosX;

    if (minPosX > maxPosX) {
        if (minPosX == 100) {
            maxPosX = minPosX + 25;
        } else {
            minPosX = maxPosX - 25;
        }
    }

    averageVelX = averageVelX / pigeonGroup.length;
    averageVelY = averageVelY / pigeonGroup.length;
    averagePosX = averagePosX / pigeonGroup.length;
    averagePosY = averagePosY / pigeonGroup.length;

    if (body.onFloor()) {
        return walkFlock(member, averagePosX, averagePosY, minPosX, maxPosX);
    } else {
        return flapFlock(
            member,
            averagePosX,
            averagePosY,
            averageVelX,
            averageVelY
        );
    }
}

function walkFlock(member, averagePosX, averagePosY, minPosX, maxPosX) {
    let wings;
    let leaning;
    let flip;

    let specialCase = 0;

    let body = member.object.body;

    if (member.object.onPerch) {
        let perch = member.object.currPerch;
        minPosX = perch.body.position.x;
        maxPosX = perch.body.width + perch.body.position.x;
    }
    let range = maxPosX - minPosX;

    if (member.justLanded) {
        member.object.body.setVelocity(0, 0);
        member.target.pos = generateRandomBetween(minPosX, maxPosX);
        member.justLanded = false;
    }
    flip = member.target.pos < body.position.x;
    if (Math.abs(member.target.pos - body.position.x) > 1) {
        leaning = true;
    } else {
        if (generateRandomBetween(0, 1000) < 10) {
            if (member.object.onPerch) {
                member.target.pos = generateRandomBetween(minPosX, maxPosX);
            } else {
                let dir;
                if (body.position.x - range < 100) {
                    dir = 1;
                } else if (body.position.x + range > SCENE_WIDTH - 100) {
                    dir = -1;
                } else if (Math.abs(body.position.x - averagePosX) > 25) {
                    dir = averagePosX < body.position.x ? 1 : -1;
                } else {
                    dir = body.position.x < SCENE_WIDTH / 2 ? 1 : -1;
                }
                member.target.pos = member.object.body.position.x + range * dir;
            }
        }
    }
    let posDifVector;
    if(member.following == -1){
        if (body.position.y - averagePosY > 50) {
            specialCase = "flap";
            member.justLanded = false;
        } else if (body.position.y - averagePosY < -200) {
            specialCase = "dive";
            member.justLanded = false;
            member.object.y += 5;
        }else if (Math.abs(body.position.x - averagePosX) > range/2){
            leaning = true;
            flip = body.position.x > averagePosX ? true:false;
        }
        posDifVector = {
            x: averagePosX - body.position.x,
            y: averagePosY - body.position.y,
        };
    } else{
        let lead = member.following.body.position;
        if (body.position.y - lead.y > 50) {
            specialCase = "flap";
            member.justLanded = false;
        } else if (body.position.y - lead.y< -200) {
            specialCase = "dive";
            member.justLanded = false;
            member.object.y += 5;
        }else if (Math.abs(body.position.x - lead.x) > range/2){
            leaning = true;
            flip = body.position.x > lead.x ? true:false;
        }
        posDifVector = {
            x: averagePosX - body.position.x,
            y: averagePosY - body.position.y,
        };
    }
    return [specialCase, flip, leaning, wings, posDifVector, { x: 0, y: 0 }];
}

function flapFlock(member, averagePosX, averagePosY, averageVelX, averageVelY) {
    let wings = false;
    let leaning;
    let flip = member.object.flipX;

    averagePosX += member.noise.x;
    averagePosY += member.noise.y;

    let specialCase = 0;

    let body = member.object.body;
    let velocity = Object.assign({}, body.velocity);

    let posDifVector = {
        x: averagePosX - body.position.x,
        y: averagePosY - body.position.y,
    };
    let velDifVector = {
        x: averageVelX - velocity.x,
        y: averageVelY - velocity.y,
    };

    if(member.following.onPerch){
        let targetPerch = member.following.currPerch;
        let targetPos = Object.assign({}, targetPerch.body.position);

        if(Math.abs(member.noise.x) > targetPerch.body.width/2 - targetPerch.body.width/8){
            member.noise.x = generateWalkableNoise(targetPerch) * randomDirection();
        }

        targetPos.x += member.noise.x + targetPerch.body.width/2;
        targetPos.y -= PIGEON_DIMENSIONS.height

        if(Math.abs(body.position.x - targetPos.x) < PIGEON_DIMENSIONS.width + targetPerch.body.width/8){
            if(body.position.y < targetPos.y - PIGEON_DIMENSIONS.height){
                leaning = false;
                if (velocity.y > 150) {
                    specialCase = "flap";
                }
                if(targetPos.y - body.position.y < 25 && Math.abs(targetPos.x - body.position.x) < 15){
                    wings = false;
                }
            }else{
                specialCase = "flap";
                leaning = false;
                console.log("please");
            }
        }else{
            flip = body.position.x > targetPos.x + PIGEON_DIMENSIONS.width/2;
            flip = Math.abs(targetPos.x - body.position.x) > 25? flip:member.object.flipX;
            leaning = Math.abs(body.position.x - targetPos.x) < 50 ? false : true;

            if (targetPos.y < body.position.y) {
                if(body.velocity.y > -75){
                    specialCase = "flap";
                }else{ 
                    wings = true;
                } 
            } else {
                if (Math.abs(body.position.y - targetPos.y) > 500) {
                    specialCase = "dive";
                } else {
                    wings = Math.abs(body.position.y - targetPos.y) > 50 ? false : true;
                }
            }
        }
    }else{
        if (Math.abs(averageVelX) > 10) {
            flip = averageVelX < 0;
        } else if (Math.abs(averagePosX - body.position.x) > 45) {
            flip = averagePosX < body.position.x;
        }

        //directly change x velocity
        if (
            posDifVector.x * (flip ? -1 : 1) > 200 ||
            velDifVector.x * (flip ? -1 : 1) > 75
        ) {
            specialCase = "flap";
        } else if (posDifVector.x * (flip ? -1 : 1) > 50) {
            leaning = true;
        } else {
            leaning = false;
        }

        
        if (averagePosY < body.position.y) {
            if (Math.abs(posDifVector.y) > 50) {
                specialCase = "flap";
            } else if (averageVelY < 0) {
                if (velocity.y > 0) {
                    specialCase = "flap";
                } else if (Math.abs(averageVelY) - Math.abs(velocity.y) > 50) {
                    specialCase = "flap";
                }
            } else {
                wings = true;
            }
        } else if (Math.abs(posDifVector.y) < 100) {
            wings = true;
        } else {
            wings = false;
            if (Math.abs(posDifVector.y) > 200) {
                specialCase = "dive";
            }
        }
        if (
            Phaser.Math.Distance.Between(
                body.position.x,
                body.position.y,
                averagePosX,
                averagePosY
            ) <= 50
        ) {
            member.noise.x = generateNoisy(FLOCK_NOISE);
            member.noise.y = generateNoisy(FLOCK_NOISE);
        }
    }

    if (specialCase == "flap") {
        if (posDifVector.y > 0) {
            leaning = true;
        } else if (posDifVector * (flip ? -1 : 1) < 0) {
            leaning = false;
        } else {
            leaning =
                Math.abs(posDifVector.x) > Math.abs(posDifVector.y)
                    ? true
                    : false;
        }
    }

    return [specialCase, flip, leaning, wings, posDifVector, velDifVector];
}

function generateWalkableNoise(perch){
    newNoise = generateNoisy(perch.body.width / 2 - perch.body.width/8);
    return newNoise;
}

function roam(member) {
    let sprite = member.object;
    let body = sprite.body;
    let position = body.position;

    let wings;
    let leaning;
    let flip;
    let specialCase = 0;
    let targetPos = member.target.pos;
    let targetPerch = member.target.perch;

    if (
       (Phaser.Math.Distance.Between(
            position.x,
            position.y,
            targetPos.x,
            targetPos.y
        ) < 75 && targetPos.y > position.y) || body.onFloor()
    ) {
        return land(member);
    } else {
        flip = targetPos.x > position.x ? false : true;
        flip = Math.abs(targetPos.x - position.x) < targetPerch.body.width/8 ? sprite.flipX : flip;
        leaning = Math.abs(position.x - targetPos.x) < 50 ? false : true;

        if (targetPos.y < position.y) {
            if(body.velocity.y > -75){
                specialCase = "flap";
            }else{ 
                wings = true;
            } 
        } else {
            if (Math.abs(position.y - targetPos.y) > 500) {
                specialCase = "dive";
            } else {
                wings = Math.abs(position.y - targetPos.y) > 50 ? false : true;
            }
        }
        return [specialCase, flip, leaning, wings];
    }
}
function land(dummy) {
    let wings = true;
    let specialCase = 0;
    let flip = dummy.object.flipX;
    let leaning = false;
    
    if(dummy.object.body.onFloor()){
        if(dummy.target.perch == dummy.object.currPerch){
            if(Math.abs(dummy.object.body.position.x - dummy.target.pos.x) > 5){  
                flip =  dummy.target.pos.x > dummy.object.body.position.x ? false:true;
                leaning = true;
            } else if( generateRandomBetween(-1, 1000) < 10){
                let targeting = generateRoamTarget(dummy.noise.x);
                dummy.noise.x = targeting[1];
                dummy.target = targeting[0]; 
            }
        }else{
            let targetBelow = dummy.object.body.position.y > dummy.target.pos.y ? false:true;
            let greaterDistance = Math.abs(dummy.object.body.position.y - dummy.target.pos.y) > Math.abs(dummy.object.body.position.x - dummy.target.pos.x) ? 'y':'x';
            flip = dummy.object.body.position.x < dummy.target.pos.x ? false:true;
            if(greaterDistance == 'x'){
                leaning = true;
            }else{
                if(targetBelow){
                    specialCase = "dive";
                    dummy.object.y += 5;
                }else{
                    specialCase = "flap";
                }
            }
        }
    }else {
        if (dummy.object.body.velocity.y > 150) {
            specialCase = "flap";
        }
        if(dummy.target.pos.y - dummy.object.body.position.y < 5 && Math.abs(dummy.target.pos.x - dummy.object.body.position.x) < 5){
            wings = false;
        }
    }
    return [specialCase, flip, leaning, wings];
}

function generateRoamTarget(noiseX) {
    let perchTarget = 0;
    let xPos;
    let yPos;
    let newNoise;

    perchTarget = generateRandomBetween(-1, perches.length);
    perchTarget = perches[perchTarget];
    xPos =
        perchTarget.body.position.x +
        perchTarget.body.width / 2;
    yPos = perchTarget.body.position.y - 25;

    newNoise = generateNoisy(perchTarget.body.width / 2 - perchTarget.body.width/8);
    noiseX = newNoise;

    return [{pos: {x: xPos + noiseX, y: yPos }, perch: perchTarget}, newNoise];
}

function generateNoisy(num) {
    let rand = generateRandomBetween(0, num + 1);
    return rand * randomDirection();
}
function generateRandomBetween(min, max) {
    let range = max - min - 1;
    let rando = Math.floor(Math.random() * range);
    return rando + min + 1;
}
function randomDirection() {
    let rando = Math.floor(Math.random() * 2) - 1;
    return rando == 0 ? -1 : 1;
}

function getNewMode(lastMode, isGrounded, keys) {
    if (isGrounded) {
        if (left.isDown || right.isDown) {
            return "walk";
        } else if (pigeon.onPerch && down.isDown) {
            return "dive";
        } else {
            return "stand";
        }
    } else {
        if (keys.space.isDown) {
            if (left.isDown || right.isDown) {
                return "swoop";
            } else {
                return "glide";
            }
        } else {
            if (left.isDown || right.isDown) {
                return "drift";
            } else if (down.isDown) {
                return "dive";
            } else {
                return "fall";
            }
        }
    }
}