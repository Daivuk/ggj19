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
    propellerVertCount: 0,
    propellerIdleSound: getSound("propellerIdle.wav").createInstance(),
    propellerVS: getShader("propeller.vs"),
    propellerPS: getShader("propeller.ps"),
    engineRev: 0
}

var PLANE_WIDTH = 0.6
var PLANE_DROP = 0.03
var PLANE_LENGTH = 0.5
var PLANE_HULL_WIDTH = 0.07
var PLANE_TAIL_WIDTH = 0.04
var PLANE_GEAR_OFFSET = 0.1
var PLANE_FIN_LENGTH = 0.15
var PLANE_FIN_WIDTH = 0.3
var PLANE_TAIL_MID = (PLANE_HULL_WIDTH + PLANE_TAIL_WIDTH) / 2
var PROP_SIZE = 0.1

function plane_init()
{
    // Local position on deck
    plane.position = new Vector3(
        0, 
        -CARRIER_DECK_LENGTH / 2 + PLANE_LENGTH, 
        CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET)

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

    // Mirror it all
    mirrorVertices(verts)

    // Calculate normals
    calcNormal(verts)

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

    plane.propellerIdleSound.setLoop(true)
    plane.propellerIdleSound.setVolume(0.4)
    plane.propellerIdleSound.play()
}

function plane_update(dt)
{
    plane.propellerAngle += dt * -500
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
}

function plane_render()
{
    Renderer.setWorld(plane.world)
    threeD.vs.setVector3("world", plane.world)
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
    plane.propellerVS.setVector3("world", plane.propellerWorld)

    Renderer.setVertexBuffer(plane.propellerVB)
    Renderer.setTexture(plane.propellerTexture, 0)
    Renderer.draw(plane.propellerVertCount)
}
