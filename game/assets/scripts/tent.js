var tent_TEXTURE = getTexture("carrier.png")
var TENT_SIZE = 0.6
var tent_LIFE = 3

var TENT_WIDTH = 0.8
var TENT_LENGTH = 1
var TENT_HEIGHT = 0.6

var tents = []

function tent_create(position)
{
    var u = 16 / 100
    var v = 76 / 100

    var verts = [
        // Front
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        0, -TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        0, -TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        0, -TENT_LENGTH / 2, TENT_HEIGHT, 0, 0, 1, u, v,

        // back
        -TENT_WIDTH / 2, TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        0, TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        0, TENT_LENGTH / 2, TENT_HEIGHT, 0, 0, 1, u, v,
        0, TENT_LENGTH / 2, -1, 0, 0, 1, u, v,

        // Left
        -TENT_WIDTH / 2, TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, -1, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,

        // Roof
        -TENT_WIDTH / 2, TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, -TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        0, -TENT_LENGTH / 2, TENT_HEIGHT, 0, 0, 1, u, v,
        -TENT_WIDTH / 2, TENT_LENGTH / 2, TENT_HEIGHT - TENT_WIDTH / 2, 0, 0, 1, u, v,
        0, -TENT_LENGTH / 2, TENT_HEIGHT, 0, 0, 1, u, v,
        0, TENT_LENGTH / 2, TENT_HEIGHT, 0, 0, 1, u, v,
    ]

    mirrorVertices(verts)
    calcNormal(verts);
    normalsToColor(verts)

    var tent = {
        position: new Vector3(position),
        vb: VertexBuffer.createStatic(new Float32Array(verts)),
        vertCount: verts.length / 8,
        world: Matrix.createTranslation(position),
        life: tent_LIFE
    }
    tents.push(tent)
}

function tents_init()
{

}

function tents_update(dt)
{
}

function tents_render()
{
    Renderer.setTexture(tent_TEXTURE, 1)

    var len = tents.length
    for (var i = 0; i < len; ++i)
    {
        var tent = tents[i]
        Renderer.setWorld(tent.world)
        Renderer.setVertexBuffer(tent.vb)
        Renderer.draw(tent.vertCount)
    }
}
