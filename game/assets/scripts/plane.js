var PLANE_WIDTH = 0.6
var PLANE_DROP = 0.03
var PLANE_LENGTH = 0.5
var PLANE_HULL_WIDTH = 0.07
var PLANE_TAIL_WIDTH = 0.02
var PLANE_GEAR_OFFSET = 0.1
var PLANE_FIN_LENGTH = 0.08
var PLANE_FIN_WIDTH = 0.2
var PLANE_TAIL_MID = (PLANE_HULL_WIDTH + PLANE_TAIL_WIDTH) / 2
var PROP_SIZE = 0.1
var PLANE_SHOT_INTERNAL = 0.1

var UPGRADES = {
    fuel: [200, 400, 600],
    ammo: [50, 100, 200],
    speed: [0.25, 1, 1.75],
    life: [10, 20, 40]
}

var plane = {
    position: new Vector3(0, 0, 100),
    velocity: new Vector3(0, 0, 0),
    front: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1),
    onDeck: true,
    wingFold: 1,
    world: new Matrix(),
    vb: null,
    texture: getTexture("carrier.png"),
    vertCount: 0,
    rest: 1,
    propellerAngle: 0,
    propellerWorld: new Matrix(),
    propellerVB: null,
    propellerTexture: getTexture("properller.png"), // Oops, properller
    propellerTexture2: getTexture("properller2.png"),
    propellerTexture3: getTexture("properller3.png"),
    propellerVertCount: 0,
    propellerIdleSound: getSound("propellerIdle.wav").createInstance(),
    propellerIdleSound2: getSound("propellerIdle.wav").createInstance(),
    propellerIdleSound3: getSound("propellerIdle.wav").createInstance(),
    propellerVS: getShader("propeller.vs"),
    propellerPS: getShader("propeller.ps"),
    takeOffJingle: getMusic("TakeOffJingle-Short.ogg"),
	flyingTheme: getMusic("FlyingTheme.ogg"),
	combatTheme: getMusic("CombatTheme.ogg"),
	musicIsPlaying: false,
	combatIsPlaying: false,
	tanksInRange: 0,
	aaInRange: 0,
    locked: true,
    engineRev: 0,
    engineRevTarget: 0,
    lift: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
    shootDelay: 0,
    nextShot: 0,
    speed: 0,
    upgrades: {
        fuel: 0,
        ammo: 0,
        speed: 0,
        life: 0
    },
    cash: 0,
    takeOffDelay: 1,
    life: UPGRADES.life[0],
    fuel: UPGRADES.fuel[0],
    bullets: UPGRADES.ammo[0]
}

function plane_init()
{
    var hullU = 16 / 100
    var hullV = 76 / 100

    var verts = [
        // Nose top
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Nose bottom
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Nose left
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Nose tip
        0, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Tail top
        -PLANE_HULL_WIDTH / 2, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Tail bottom
        -PLANE_HULL_WIDTH / 2, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Tail left
        -PLANE_HULL_WIDTH / 2, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, -PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, 0, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Tail tip
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -PLANE_TAIL_WIDTH / 2, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, -PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, PLANE_TAIL_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Tail left fin
        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH, 0, 0, 0, 1, hullU, hullV,
        -PLANE_FIN_WIDTH / 2, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH - PLANE_FIN_LENGTH * 0.25, 0, 0, 0, 1, hullU, hullV,
        -PLANE_FIN_WIDTH / 2, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH - PLANE_FIN_LENGTH * 0.75, 0, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH, 0, 0, 0, 1, hullU, hullV,
        -PLANE_FIN_WIDTH / 2, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH - PLANE_FIN_LENGTH * 0.75, 0, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, 0, 0, 0, 1, hullU, hullV,

        // Tail fin
        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH, 0, 0, 0, 1, hullU, hullV,
        -0.01, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.5, 0, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.75, PLANE_FIN_WIDTH / 2, 0, 0, 1, hullU, hullV,

        -0.01, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.5, 0, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2, 0, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.25, PLANE_FIN_WIDTH / 2, 0, 0, 1, hullU, hullV,

        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.75, PLANE_FIN_WIDTH / 2, 0, 0, 1, hullU, hullV,
        -0.01, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.5, 0, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 2 + PLANE_FIN_LENGTH * 0.25, PLANE_FIN_WIDTH / 2, 0, 0, 1, hullU, hullV,

        // Cockpit
        0, PLANE_LENGTH / 8, PLANE_HULL_WIDTH, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 8, PLANE_HULL_WIDTH / 2, 0, 0, 1, hullU, hullV,
        0, -PLANE_LENGTH / 4, PLANE_TAIL_MID / 2, 0, 0, 1, hullU, hullV,

        // Left wing drop top
        -PLANE_HULL_WIDTH / 2 - PLANE_DROP, PLANE_LENGTH / 2 * 0.85, -PLANE_HULL_WIDTH / 4 - PLANE_DROP / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2 - PLANE_DROP, PLANE_LENGTH / 2 * 0.25, -PLANE_HULL_WIDTH / 4 - PLANE_DROP / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2 * 0.25, -PLANE_HULL_WIDTH / 4, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2 - PLANE_DROP, PLANE_LENGTH / 2 * 0.85, -PLANE_HULL_WIDTH / 4 - PLANE_DROP / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2 * 0.25, -PLANE_HULL_WIDTH / 4, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2, PLANE_LENGTH / 2 * 0.85, -PLANE_HULL_WIDTH / 4, 0, 0, 1, hullU, hullV,

        // Left wing
        -PLANE_WIDTH / 2, PLANE_LENGTH / 2 * 0.85, 0, 0, 0, 1, hullU, hullV,
        -PLANE_WIDTH / 2, PLANE_LENGTH / 2 * 0.45, 0, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2 - PLANE_DROP, PLANE_LENGTH / 2 * 0.25, -PLANE_HULL_WIDTH / 4 - PLANE_DROP / 2, 0, 0, 1, hullU, hullV,
        -PLANE_WIDTH / 2, PLANE_LENGTH / 2 * 0.85, 0, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2 - PLANE_DROP, PLANE_LENGTH / 2 * 0.25, -PLANE_HULL_WIDTH / 4 - PLANE_DROP / 2, 0, 0, 1, hullU, hullV,
        -PLANE_HULL_WIDTH / 2 - PLANE_DROP, PLANE_LENGTH / 2 * 0.85, -PLANE_HULL_WIDTH / 4 - PLANE_DROP / 2, 0, 0, 1, hullU, hullV,
    ]

    mirrorVertices(verts)
    calcNormal(verts)
    normalsToColor(verts)

    var vertexData = new Float32Array(verts)
    plane.vb = VertexBuffer.createStatic(vertexData)
    plane.vertCount = vertexData.length / 8

    // Prop
    verts = [
        -PROP_SIZE, 0, PROP_SIZE, 0, 0,
        -PROP_SIZE, 0, -PROP_SIZE, 0, 1,
        PROP_SIZE, 0, -PROP_SIZE, 1, 1,
        -PROP_SIZE, 0, PROP_SIZE, 0, 0,
        PROP_SIZE, 0, -PROP_SIZE, 1, 1,
        PROP_SIZE, 0, PROP_SIZE, 1, 0,
    ]
    vertexData = new Float32Array(verts)
    plane.propellerVB = VertexBuffer.createStatic(vertexData)
    plane.propellerVertCount = vertexData.length / 5

    plane_respawn()
}

function plane_respawn()
{
    plane.takeOffDelay = 1
    plane.onDeck = true
    plane.speed = 0
    plane.position = new Vector3(0, 0, 100)
    plane.velocity = new Vector3(0, 0, 0)
    plane.front = new Vector3(0, 1, 0)
    plane.up = new Vector3(0, 0, 1)
    plane.onDeck = true
    plane.wingFold = 1
    plane.rest = 1
    plane.locked = true
    plane.engineRev = 0
    plane.engineRevTarget = 0
    plane.lift = 0
    plane.roll = 0
    plane.pitch = 0
    plane.yaw = 0
    plane.shootDelay = 0
    plane.nextShot = 0
    plane.speed = 0
    plane.life = 10

    // Local position on deck
    plane.position = new Vector3(
        0, 
        -CARRIER_DECK_LENGTH / 2 + PLANE_LENGTH, 
        CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET)

    plane.propellerIdleSound.stop()
    plane.propellerIdleSound2.stop()
    plane.propellerIdleSound3.stop()
    plane.takeOffJingle.stop();

    plane.propellerIdleSound.setLoop(true)
    plane.propellerIdleSound.setVolume(0.1)
    plane.propellerIdleSound.play()

    plane.propellerIdleSound2.setLoop(true)
    plane.propellerIdleSound2.setVolume(0)
    plane.propellerIdleSound2.play()

    plane.propellerIdleSound3.setLoop(true)
    plane.propellerIdleSound3.setVolume(0)
    plane.propellerIdleSound3.play()

    plane.takeOffJingle.setVolume(.8)

	plane.musicIsPlaying = false
	plane.combatIsPlaying = false
	plane.flyingTheme.stop()
	plane.combatTheme.stop()
	
    plane.world = Matrix.createRotationX(plane.rest * 10)
    if (plane.onDeck)
    {
        plane.world = plane.world.mul(Matrix.createWorld(plane.position, plane.front, plane.up).mul(carrier.world))
    }
    else
    {
        plane.world = plane.world.mul(Matrix.createWorld(plane.position, plane.front, plane.up))
    }
}

function plane_update(dt)
{
    var lthumb = GamePad.getLeftThumb(0)
    var rthumb = GamePad.getRightThumb(0)

    if (plane.locked)
    {
        plane.fuel = UPGRADES.fuel[plane.upgrades.fuel]
        plane.bullets = UPGRADES.ammo[plane.upgrades.ammo]
        plane.life = UPGRADES.life[plane.upgrades.life]

        if (rthumb.y < -0.8 && !store.isVisible())
        {
            // Start!
            plane.locked = false
        }
        else
        {
            if (!store.isVisible())
            {
                if (GamePad.isJustDown(0, Button.A))
                {
                    store.setVisible(true)
                }
            }
            else
            {
                if (GamePad.isJustDown(0, Button.B))
                {
                    store.setVisible(false)
                }
            }
        }
    }
    else 
    {
        var prevPos = new Vector3(plane.position)
        if (rthumb.y < 0 && !plane.onDeck)
        {
            rthumb.y *= UPGRADES.speed[plane.upgrades.speed]
        }
        plane.engineRevTarget = -rthumb.y + 2
        if (plane.fuel == 0) plane.engineRevTarget = 0
        plane.engineRev += (plane.engineRevTarget - plane.engineRev) * dt
        plane.propellerIdleSound.setPitch((plane.engineRev - 1.5 - 1) * 0.25 + 1)

        plane.propellerIdleSound2.setPitch((plane.engineRev - 1.5 - 1) * 0.55 + 1)
        plane.propellerIdleSound2.setVolume((plane.engineRev - 1.5) * 0.3)
        
        plane.propellerIdleSound3.setPitch((plane.engineRev - 1.5 - 1) * 2 + 1)
        plane.propellerIdleSound3.setVolume((plane.engineRev - 2.5) * 0.3)

        plane.velocity = plane.velocity.add(plane.front.mul(plane.engineRev * dt * 0.5))
        plane.speed = plane.velocity.length()
        plane.speed -= plane.speed * dt * 0.5

        plane.velocity = plane.velocity.normalize().mul(plane.speed)
        plane.position = plane.position.add(plane.velocity.mul(dt))

        plane.lift = plane.speed - 1.9

        if (plane.onDeck)
        {
            if (plane.lift > -0.5)
                plane.rest = Math.max(0, plane.rest - dt)
            else
                plane.rest = Math.min(1, plane.rest + dt)
            if (plane.lift > 0.5 || plane.position.y > carrier.position.y + CARRIER_DECK_LENGTH / 2)
            {
                plane.takeOffJingle.play(false)
                plane.onDeck = false

                // Translate the position to real position
                plane.world = Matrix.createRotationX(plane.rest * 10)
                plane.world = plane.world.mul(Matrix.createWorld(plane.position, plane.front, plane.up).mul(carrier.world))
                plane.position = new Vector3(plane.world._41, plane.world._42, plane.world._43)
                plane.front = new Vector3(plane.world._21, plane.world._22, plane.world._23)
                plane.up = new Vector3(plane.world._31, plane.world._32, plane.world._33)
            }
        }
        else
        {
            plane.takeOffDelay -= dt
            plane.rest = Math.max(0, plane.rest - dt)
            var right = plane.front.cross(plane.up)

            // Gravity
            plane.velocity = plane.velocity.add(Vector3.UNIT_Z.mul(-dt / 2))

            // Lift
            plane.velocity = plane.velocity.add(plane.up.mul((plane.lift + 1) * dt / 2))

            // Roll
            plane.roll = plane.roll + (lthumb.x * 45 * plane.speed - plane.roll) * dt * 2
            plane.up = plane.up.transform(Matrix.createFromAxisAngle(plane.front, -plane.roll * dt))

            // Pitch
            plane.pitch = plane.pitch + (lthumb.y * 30 * plane.speed - plane.pitch) * dt * 2
            var pitchTransform = Matrix.createFromAxisAngle(right, -plane.pitch * dt)
            plane.front = plane.front.transform(pitchTransform).normalize()
            // Transform the energy to the velocity also
            plane.velocity = plane.velocity.transform(Matrix.createFromAxisAngle(right, -plane.pitch * dt * 0.5))

            // Yaw
            plane.yaw = plane.yaw + (rthumb.x * 30 * plane.speed - plane.yaw) * dt * 2
            plane.front = plane.front.transform(Matrix.createFromAxisAngle(plane.up, plane.yaw * dt))
            
            // Plane always try to point toward velocity
            plane.front = plane.front.add(plane.velocity.normalize().sub(plane.front).mul(dt * 5)).normalize()

            // Reajust up based on the new front
            right = plane.front.cross(plane.up)
            plane.up = right.cross(plane.front).normalize()

            // Are we landing?
            var invCarrier = carrier.world.invert()
            var prevLocal = prevPos.sub(carrier.position).transform(invCarrier)
            var local = plane.position.sub(carrier.position).transform(invCarrier)
            if (local.z <= CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET && plane.takeOffDelay <= 0)
            {
                if (local.x > -CARRIER_DECK_WIDTH / 2 &&
                    local.x < CARRIER_DECK_WIDTH / 2 &&
                    local.y > -CARRIER_DECK_LENGTH / 2 &&
                    local.y < CARRIER_DECK_LENGTH / 2)
                {
                    if (plane.speed < 2 && prevLocal.z > CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET)
                    {
                        if (Math.abs(plane.front.z) < 0.6)
                        {
                            playSound("landed.wav", 4)
                            plane_landed()
                        }
                    }
                    else
                    {
                        plane_crash()
                    }
                }
            }
        }
    }

    plane.fuel = Math.max(0, plane.fuel - plane.engineRev * dt)

    plane.propellerAngle += dt * -500 * (plane.engineRev + 1)
    plane.propellerAngle %= 360
    plane.world = Matrix.createRotationX(plane.rest * 10)
    if (plane.onDeck)
    {
        plane.world = plane.world.mul(Matrix.createWorld(plane.position, plane.front, plane.up).mul(carrier.world))
    }
    else
    {
        plane.world = plane.world.mul(Matrix.createWorld(plane.position, plane.front, plane.up))
    }
    plane.propellerWorld = Matrix.createTranslation(new Vector3(0, PLANE_LENGTH / 2 + 0.01, 0)).mul(
        Matrix.createRotationY(plane.propellerAngle)).mul(
        plane.world)

    plane.shootDelay -= dt
    if (plane.bullets > 0 && GamePad.isDown(0, Button.RIGHT_TRIGGER))
    {
        if (plane.shootDelay <= 0)
        {
            plane.bullets--
            plane.shootDelay = PLANE_SHOT_INTERNAL
            playSound("shot.wav", 2, (plane.nextShot - 0.5) * 0.1, 1.5)
            setTimeout(function(){playSound("shot.wav", 1.5, 0, 1)}, PLANE_SHOT_INTERNAL * 1.1 * 1000)
            
            var right = plane.front.cross(plane.up).normalize()
            var dir = new Vector3(plane.world._21, plane.world._22, plane.world._23)
            var pos = new Vector3(plane.world._41, plane.world._42, plane.world._43)
            shot_create(pos.add(right.mul((plane.nextShot - 0.5) * PLANE_WIDTH / 2)).add(dir.mul(PLANE_LENGTH / 2 * 0.85)), plane.velocity.add(dir.normalize().mul(SHOT_VEL)), plane, 1)
            plane.yaw += (plane.nextShot - 0.5) * 25

            plane.nextShot = (plane.nextShot + 1) % 2
            camera_shake(0.01)
        }
    }

    // Detect crash
    var mapX = Math.floor(plane.position.x + 128)
    var mapY = Math.floor(plane.position.y + 128)
    var h = 0
    if (mapX >= 0 && mapX < 256 && mapY >= 0 && mapY < 256) h = map.hm[mapY * 256 + mapX]
    if (plane.position.z <= h)
    {
        // Kaboom   
        plane_crash()
    }

	if (!plane.onDeck && !plane.takeOffJingle.isPlaying())
	{
		if(!plane.musicIsPlaying)
		{
			plane.flyingTheme.setVolume(1.0)
			plane.flyingTheme.play(true)
			plane.musicIsPlaying = true
			plane.combatTheme.setVolume(0.0)
			plane.combatTheme.play(true)		
		}
	}
	
	// If there are any tanks or AAs in range, switch to the combat music
	if(plane.tanksInRange > 0 || plane.aaInRange > 0)
		playCombatMusic(true)
	else
		playCombatMusic(false)
}

function plane_landed()
{
    store.setVisible(true)
    plane_respawn()
}

function playCombatMusic(in_combat)
{
	if(in_combat)
	{
		plane.flyingTheme.setVolume(0.0)
		plane.combatTheme.setVolume(1.0)
	}
	else
	{
		plane.flyingTheme.setVolume(1.0)
		plane.combatTheme.setVolume(0.0)		
	}
	plane.combatIsPlaying = in_combat;
}

function plane_crash()
{
    playSound("crash.wav")
    plane.cash = 0

    plane.upgrades.fuel = 0
    plane.upgrades.ammo = 0
    plane.upgrades.speed = 0
    plane.upgrades.life = 0

    findUI("refuelPow1").setVisible(false)
    findUI("refuelPow2").setVisible(false)
    findUI("ammoPow1").setVisible(false)
    findUI("ammoPow2").setVisible(false)
    findUI("speedPow1").setVisible(false)
    findUI("speedPow2").setVisible(false)
    findUI("lifePow1").setVisible(false)
    findUI("lifePow2").setVisible(false)

    findUI("getRefuel").setEnabled(true)
    findUI("getAmmo").setEnabled(true)
    findUI("getSpeed").setEnabled(true)
    findUI("getLife").setEnabled(true)
    
    plane.fuel = UPGRADES.fuel[plane.upgrades.fuel]
    plane.bullets = UPGRADES.ammo[plane.upgrades.ammo]
    plane.life = UPGRADES.life[plane.upgrades.life]

    plane_respawn()
}

function plane_render()
{
    Renderer.setWorld(plane.world)
    Renderer.setVertexBuffer(plane.vb)
    Renderer.setTexture(plane.texture, 1)
    Renderer.draw(plane.vertCount)
}

function propeller_render()
{
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED)
    Renderer.setFilterMode(FilterMode.NEAREST)
    Renderer.setBackFaceCull(false)
    Renderer.setDepthEnabled(true)
    Renderer.setDepthWrite(false)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setVertexShader(plane.propellerVS)
    Renderer.setPixelShader(plane.propellerPS)
    Renderer.setWorld(plane.propellerWorld)

    Renderer.setVertexBuffer(plane.propellerVB)
    Renderer.setTexture(plane.engineRev > 1.5 ? (plane.engineRev > 2.5 ? plane.propellerTexture3 : plane.propellerTexture2) : plane.propellerTexture, 0)
    Renderer.draw(plane.propellerVertCount)
}
