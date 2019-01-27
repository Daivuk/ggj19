var TREE_TEXTURE = getTexture("trees.png")
var TREE_SIZE = 1

var trees = []

function tree_create(position)
{
    var type = Random.getNext(2)
    var vertBuffer = new Float32Array([
        -TREE_SIZE / 2, TREE_SIZE, 0, 1, 1, 1, 0, type / 2,
        TREE_SIZE / 2, 0, 0, 1, 1, 1, 1, type / 2 + 0.5,
        -TREE_SIZE / 2, 0, 0, 1, 1, 1, 0, type / 2 + 0.5,
        -TREE_SIZE / 2, TREE_SIZE, 0, 1, 1, 1, 0, type / 2,
        TREE_SIZE / 2, TREE_SIZE, 0, 1, 1, 1, 1, type / 2,
        TREE_SIZE / 2, 0, 0, 1, 1, 1, 1, type / 2 + 0.5,
    ])
    var tree = {
        position: new Vector3(position),
        vb: VertexBuffer.createStatic(vertBuffer),
        vertCount: vertBuffer.length / 8,
        world: new Matrix()
    }
    trees.push(tree)
}

function trees_init()
{
    Random.setSeed(0)
    for (var i = 0; i < 2000; ++i)
    {
        var pos = new Vector3(Random.randInt(-128, 127), Random.randInt(-128, 127), 0)
        var mapX = pos.x + 128
        var mapY = pos.y + 128
        var h = map.hm[mapY * 256 + mapX]
        if (h > 1)
        {
            pos.z = h
            tree_create(pos)
        }
    }
}

function trees_update(dt)
{
    var len = trees.length
    for (var i = 0; i < len; ++i)
    {
        var tree = trees[i]
        tree.world = Matrix.createConstrainedBillboard(tree.position, camera.position, Vector3.UNIT_Z)
    }
}

function trees_render()
{
    Renderer.setTexture(TREE_TEXTURE, 1)

    var len = trees.length
    for (var i = 0; i < len; ++i)
    {
        var tree = trees[i]
        Renderer.setWorld(tree.world)
        Renderer.setVertexBuffer(tree.vb)
        Renderer.draw(tree.vertCount)
    }
}
