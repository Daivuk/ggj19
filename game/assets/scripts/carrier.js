var carrier = {
    vs: getShader("textured_shaded.vs"),
    ps: getShader("textured_shaded.ps"),
    vb: null,
    position: new Vector3(0, 0, 0),
    world: new Matrix(),
    vertCount: 0
}

var CARRIER_DECK_WIDTH = 2
var CARRIER_DECK_LENGTH = 7
var CARRIER_DECK_HEIGHT = 0.8
var CARRIER_DECK_TRIM_HEIGHT = 0.1
var CARRIER_WATERLINE_WIDTH = .6
var CARRIER_WATERLINE_FRONT = .7
var CARRIER_WATERLINE_BACK = .3

function carrier_init()
{
    var vertexData = new Float32Array([
        // Deck top
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0, 0,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0, 0,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0, 0,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0, 0,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0, 0,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0, 0,
    ])
    carrier.vb = VertexBuffer.createStatic(vertexData)
    carrier.vertCount = vertexData.length / 8

    carrier.world = Matrix.createWorld(carrier.position, Vector3.UNIT_Y, Vector3.UNIT_Z)
    var normalWorld = Matrix.createWorld(Vector3.ZERO, Vector3.UNIT_Y, Vector3.UNIT_Z)
    carrier.vs.setMatrix("normalWorld", normalWorld)
}

function carrier_update(dt)
{
}

function carrier_render()
{
    Renderer.setBlendMode(BlendMode.OPAQUE)
    Renderer.setFilterMode(FilterMode.NEAREST)
    Renderer.setBackFaceCull(false)
    Renderer.setDepthEnabled(false)
    Renderer.setDepthWrite(false)
    Renderer.setPrimitiveMode(PrimitiveMode.TRIANGLE_LIST)
    Renderer.setWorld(carrier.world)
    Renderer.setVertexShader(carrier.vs)
    Renderer.setPixelShader(carrier.ps)
    Renderer.setVertexBuffer(carrier.vb)
    Renderer.draw(carrier.vertCount)
}
