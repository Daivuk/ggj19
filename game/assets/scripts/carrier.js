var carrier = {
    texture: getTexture("carrier.png"),
    vb: null,
    position: new Vector3(0, 0, 0),
    world: new Matrix(),
    vertCount: 0,
    rockX: 0,
    rockY: 0
}

var CARRIER_DECK_WIDTH = 2
var CARRIER_DECK_LENGTH = 7
var CARRIER_DECK_HEIGHT = 0.8
var CARRIER_DECK_TRIM_HEIGHT = 0.1
var CARRIER_WATERLINE_WIDTH = .6
var CARRIER_WATERLINE_FRONT = .7
var CARRIER_WATERLINE_BACK = .3
var CARRIER_TOWER_WIDTH = 0.4
var CARRIER_TOWER_LENGTH = 0.7
var CARRIER_TOWER_HEIGHT = 2
var CARRIER_TOWER_OFFSET = -0.10

function carrier_init()
{
    var trimU = 16/100
    var trimV = 76/100
    var keelU = 0/100
    var keelV = 0/100
    var towerU = 0/100
    var towerV = 0/100

    var verts = [
        // Deck top
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 32.5/100, 1.5/100,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 32.5/100, 98.5/100,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 59.5/100, 98.5/100,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 32.5/100, 1.5/100,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 59.5/100, 98.5/100,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 59.5/100, 1.5/100,

        // Left trim
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,

        // Right trim
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,

        // Front trim
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,

        // Back trim
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, trimU, trimV,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, trimU, trimV,

        // Front keel
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        CARRIER_WATERLINE_WIDTH / 2, CARRIER_DECK_LENGTH / 2 - CARRIER_WATERLINE_FRONT, 0, 0, 0, 1, keelU, keelV,
        -CARRIER_WATERLINE_WIDTH / 2, CARRIER_DECK_LENGTH / 2 - CARRIER_WATERLINE_FRONT, 0, 0, 0, 1, keelU, keelV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        -CARRIER_WATERLINE_WIDTH / 2, CARRIER_DECK_LENGTH / 2 - CARRIER_WATERLINE_FRONT, 0, 0, 0, 1, keelU, keelV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,

        // Back keel
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        -CARRIER_WATERLINE_WIDTH / 2, -CARRIER_DECK_LENGTH / 2 + CARRIER_WATERLINE_BACK, 0, 0, 0, 1, keelU, keelV,
        CARRIER_WATERLINE_WIDTH / 2, -CARRIER_DECK_LENGTH / 2 + CARRIER_WATERLINE_BACK, 0, 0, 0, 1, keelU, keelV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        CARRIER_WATERLINE_WIDTH / 2, -CARRIER_DECK_LENGTH / 2 + CARRIER_WATERLINE_BACK, 0, 0, 0, 1, keelU, keelV,
        CARRIER_DECK_WIDTH / 2,-CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,

        // Left keel
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        -CARRIER_WATERLINE_WIDTH / 2, CARRIER_DECK_LENGTH / 2 - CARRIER_WATERLINE_FRONT, 0, 0, 0, 1, keelU, keelV,
        -CARRIER_WATERLINE_WIDTH / 2, -CARRIER_DECK_LENGTH / 2 + CARRIER_WATERLINE_BACK, 0, 0, 0, 1, keelU, keelV,
        -CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        -CARRIER_WATERLINE_WIDTH / 2, -CARRIER_DECK_LENGTH / 2 + CARRIER_WATERLINE_BACK, 0, 0, 0, 1, keelU, keelV,
        -CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,

        // Right keel
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        CARRIER_WATERLINE_WIDTH / 2, -CARRIER_DECK_LENGTH / 2 + CARRIER_WATERLINE_BACK, 0, 0, 0, 1, keelU, keelV,
        CARRIER_WATERLINE_WIDTH / 2, CARRIER_DECK_LENGTH / 2 - CARRIER_WATERLINE_FRONT, 0, 0, 0, 1, keelU, keelV,
        CARRIER_DECK_WIDTH / 2, -CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,
        CARRIER_WATERLINE_WIDTH / 2, CARRIER_DECK_LENGTH / 2 - CARRIER_WATERLINE_FRONT, 0, 0, 0, 1, keelU, keelV,
        CARRIER_DECK_WIDTH / 2, CARRIER_DECK_LENGTH / 2, CARRIER_DECK_HEIGHT - CARRIER_DECK_TRIM_HEIGHT, 0, 0, 1, keelU, keelV,

        // Tower left
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, 0/100, 14/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0/100, 48/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 31/100, 48/100,

        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, 16/100, 0/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, 0/100, 14/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 31/100, 48/100,
        
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, 31/100, 0/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, 16/100, 0/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 31/100, 48/100,

        // Tower right
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, 0/100, 14/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 31/100, 48/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 0/100, 48/100,

        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, 16/100, 0/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 31/100, 48/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, 0/100, 14/100,
        
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, 31/100, 0/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, 31/100, 48/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, 16/100, 0/100,

        // Tower back
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, towerU, towerV,

        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_WATERLINE_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT / 2, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,

        // Tower front
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_DECK_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, towerU, towerV,

        // Tower top
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT - CARRIER_TOWER_LENGTH / 2, 0, 0, 1, towerU, towerV,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, towerU, towerV,
        
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, 2/100, 14/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, 2/100, (14+28)/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, (2+28)/100, (14+28)/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 - CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, 2/100, 14/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, -CARRIER_TOWER_LENGTH / 2, CARRIER_TOWER_HEIGHT, 0, 0, 1, (2+28)/100, (14+28)/100,
        CARRIER_TOWER_OFFSET + CARRIER_DECK_WIDTH / 2 + CARRIER_TOWER_WIDTH / 2, 0, CARRIER_TOWER_HEIGHT, 0, 0, 1, (2+28)/100, 14/100,
    ]

    // Calculate normals
    calcNormal(verts)
    normalsToColor(verts)

    var vertexData = new Float32Array(verts)
    carrier.vb = VertexBuffer.createStatic(vertexData)
    carrier.vertCount = vertexData.length / 8
}

function carrier_update(dt)
{
    carrier.rockX += dt * 0.68
    carrier.rockY += dt
    var rockX = Math.sin(carrier.rockX)
    var rockY = Math.sin(carrier.rockY)
    rockX *= Math.PI / 2 * 2
    rockY *= Math.PI / 4 * 2

    carrier.world = 
        Matrix.createRotationX(rockX).mul(
        Matrix.createRotationY(rockY)).mul(
        Matrix.createTranslation(carrier.position))
}

function carrier_render()
{
    Renderer.setWorld(carrier.world)
    Renderer.setVertexBuffer(carrier.vb)
    Renderer.setTexture(carrier.texture, 1)
    Renderer.draw(carrier.vertCount)
}
