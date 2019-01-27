var MAP_SIZE = 500
var CLOUD_CEILING = 40
var MAP_TEXTURE_SCALE = 0.1

var map = {
    vb: null,
    vertCount: 0,
    texture: getTexture("grass.png"),
    world: new Matrix()
}

function map_reset()
{
    tanks = []
    aas = []
    tents = []
    shots = []
    smokes = []

    load_entities()
}

function map_init()
{
    // Generate clouds
    for (var i = 0; i < 100; ++i)
    {
        cloud_create(Random.randVector3(
            new Vector3(-MAP_SIZE, -MAP_SIZE, CLOUD_CEILING - 2),
            new Vector3(MAP_SIZE, MAP_SIZE, CLOUD_CEILING + 2)))
    }

    // Height map
    var file = new BinaryFileReader("heightMap.raw")
    var hm = []
    var verts = []
    for (var y = 0; y < 256; ++y)
    {
        for (var x = 0; x < 256; ++x)
        {
            var val = file.readUInt8() / 256
            val = 1 - Math.pow(1 - val, 3)
            if (val != 0) val += 0.1
            hm.push(val * 5)
        }
    }

    for (var y = 0; y < 255; ++y)
    {
        for (var x = 0; x < 255; ++x)
        {
            if (hm[(y) * 256 + x] != 0 ||
                hm[(y + 1) * 256 + x] != 0 ||
                hm[(y + 1) * 256 + x + 1] != 0)
                verts.push(
                    x - 128, y - 128, hm[y * 256 + x], 0, 0, 1, x * MAP_TEXTURE_SCALE, y * MAP_TEXTURE_SCALE,
                    x - 128 + 1, y - 128 + 1, hm[(y + 1) * 256 + x + 1], 0, 0, 1, x * MAP_TEXTURE_SCALE + MAP_TEXTURE_SCALE, y * MAP_TEXTURE_SCALE + MAP_TEXTURE_SCALE,
                    x - 128, y - 128 + 1, hm[(y + 1) * 256 + x], 0, 0, 1, x * MAP_TEXTURE_SCALE, y * MAP_TEXTURE_SCALE + MAP_TEXTURE_SCALE
                )
            if (hm[(y) * 256 + x] != 0 ||
                hm[(y) * 256 + x + 1] != 0 ||
                hm[(y + 1) * 256 + x + 1] != 0)
                verts.push(
                    x - 128, y - 128, hm[y * 256 + x], 0, 0, 1, x * MAP_TEXTURE_SCALE, y * MAP_TEXTURE_SCALE,
                    x - 128 + 1, y - 128, hm[y * 256 + x + 1], 0, 0, 1, x * MAP_TEXTURE_SCALE + MAP_TEXTURE_SCALE, y * MAP_TEXTURE_SCALE,
                    x - 128 + 1, y - 128 + 1, hm[(y + 1) * 256 + x + 1], 0, 0, 1, x * MAP_TEXTURE_SCALE + MAP_TEXTURE_SCALE, y * MAP_TEXTURE_SCALE + MAP_TEXTURE_SCALE
                )
        }
    }

    map.hm = hm

    calcNormal(verts)
    normalsToColor(verts)

    map.vb = VertexBuffer.createStatic(new Float32Array(verts))
    map.vertCount = verts.length / 8

    load_entities()
}

function load_entities()
{
    var file = new BinaryFileReader("entities.raw")
    var totalValue = 0
    for (var y = 0; y < 256; ++y)
    {
        for (var x = 0; x < 256; ++x)
        {
            var r = file.readUInt8()
            var g = file.readUInt8()
            var b = file.readUInt8()
            var a = file.readUInt8()
            if (a == 0) continue

            if (r == 255)
            { 
                tank_create(new Vector3(x - 128, y - 128, map.hm[y * 256 + x]))
                totalValue += 15
            }
            if (g == 255)
            { 
                tent_create(new Vector3(x - 128, y - 128, map.hm[y * 256 + x]))
                totalValue += 10
            }
            if (b == 255)
            {
                aa_create(new Vector3(x - 128, y - 128, map.hm[y * 256 + x]))
                totalValue += 5
            }
        }
    }
}

function map_render()
{
    Renderer.setWorld(map.world)
    Renderer.setVertexBuffer(map.vb)
    Renderer.setTexture(map.texture, 1)
    Renderer.draw(map.vertCount)
}
