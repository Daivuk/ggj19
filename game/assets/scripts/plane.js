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
    propellerTexture: getTexture("properller.png"),
    propellerTexture2: getTexture("properller2.png"),
    propellerTexture3: getTexture("properller3.png"),
    propellerVertCount: 0,
    propellerIdleSound: getSound("propellerIdle.wav").createInstance(),
    propellerIdleSound2: getSound("propellerIdle.wav").createInstance(),
    propellerIdleSound3: getSound("propellerIdle.wav").createInstance(),
    takeOffJingleSound: getSound("TakeOffJingle.wav").createInstance(),
    propellerVS: getShader("propeller.vs"),
    propellerPS: getShader("propeller.ps"),
    locked: true,
    engineRev: 0,
    engineRevTarget: 0,
    lift: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
    shootDelay: 0,
    nextShot: 0,
    speed: 0
}

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
	plane.takeOffJingleSound.stop()
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

    // Local position on deck
    plane.position = new Vector3(
        0, 
        -CARRIER_DECK_LENGTH / 2 + PLANE_LENGTH, 
        CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET)

    plane.propellerIdleSound.setLoop(true)
    plane.propellerIdleSound.setVolume(0.2)
    plane.propellerIdleSound.play()

    plane.propellerIdleSound2.setLoop(true)
    plane.propellerIdleSound2.setVolume(0)
    plane.propellerIdleSound2.play()

    plane.propellerIdleSound3.setLoop(true)
    plane.propellerIdleSound3.setVolume(0)
    plane.propellerIdleSound3.play()

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
        if (rthumb.y < -0.8)
        {
            // Start!
            plane.locked = false
			plane.takeOffJingleSound.setLoop(false)
			plane.takeOffJingleSound.setVolume(1.0)
			plane.takeOffJingleSound.play()
        }
    }
    else 
    {
        plane.engineRevTarget = -rthumb.y + 2
        plane.engineRev += (plane.engineRevTarget - plane.engineRev) * dt
        plane.propellerIdleSound.setPitch((plane.engineRev - 1.5 - 1) * 0.25 + 1)

        plane.propellerIdleSound2.setPitch((plane.engineRev - 1.5 - 1) * 0.55 + 1)
        plane.propellerIdleSound2.setVolume((plane.engineRev - 1.5) * 0.5)
        
        plane.propellerIdleSound3.setPitch((plane.engineRev - 1.5 - 1) * 2 + 1)
        plane.propellerIdleSound3.setVolume((plane.engineRev - 2.5) * 0.5)

        plane.velocity = plane.velocity.add(plane.front.mul(plane.engineRev * dt))
        plane.speed = plane.velocity.length()
        plane.speed -= plane.speed * dt
        plane.velocity = plane.velocity.normalize().mul(plane.speed)
        plane.position = plane.position.add(plane.velocity.mul(dt))

        plane.lift = plane.speed - 1.9

        if (plane.onDeck)
        {
            if (plane.lift > -0.5)
                plane.rest = Math.max(0, plane.rest - dt)
            else
                plane.rest = Math.min(1, plane.rest + dt)
            if (plane.lift > 0.5)
            {
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

            // Yaw
            plane.yaw = plane.yaw + (rthumb.x * 30 * plane.speed - plane.yaw) * dt * 2
            plane.front = plane.front.transform(Matrix.createFromAxisAngle(plane.up, plane.yaw * dt))
            
            // Plane always try to point toward velocity
            plane.front = plane.front.add(plane.velocity.normalize().sub(plane.front).mul(dt * 5)).normalize()

            // Reajust up based on the new front
            right = plane.front.cross(plane.up)
            plane.up = right.cross(plane.front).normalize()
        }
    }

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
    if (GamePad.isDown(0, Button.RIGHT_TRIGGER))
    {
        if (plane.shootDelay <= 0)
        {
            plane.shootDelay = PLANE_SHOT_INTERNAL
            playSound("shot.wav", 2, (plane.nextShot - 0.5) * 0.1, 1.5)
            setTimeout(function(){playSound("shot.wav", 1.5, 0, 1)}, PLANE_SHOT_INTERNAL * 1.1 * 1000)
            
            var right = plane.front.cross(plane.up).normalize()
            var dir = new Vector3(plane.world._21, plane.world._22, plane.world._23)
            var pos = new Vector3(plane.world._41, plane.world._42, plane.world._43)
            shot_create(pos.add(right.mul((plane.nextShot - 0.5) * PLANE_WIDTH / 2)).add(dir.mul(PLANE_LENGTH / 2 * 0.85)), plane.velocity.add(dir.normalize().mul(SHOT_VEL)), plane)

            plane.nextShot = (plane.nextShot + 1) % 2
            camera_shake(0.01)
        }
    }

    // Detect crash
    if (plane.position.z <= 0)
    {
        // Kaboom
        plane_respawn()
    }
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
