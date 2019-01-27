var aa_TEXTURE = getTexture("turret.png")
var aa_SIZE = 1
var aa_RANGE_SQR = 40 * 40
var aa_RECHARGE_TIME = 5
var aa_LIFE = 5

var aas = []

function aa_create(position)
{
    var vertBuffer = new Float32Array([
        -aa_SIZE / 2, aa_SIZE, 0, 1, 1, 1, 0, 0,
        aa_SIZE / 2, 0, 0, 1, 1, 1, 1, 1,
        -aa_SIZE / 2, 0, 0, 1, 1, 1, 0, 1,
        -aa_SIZE / 2, aa_SIZE, 0, 1, 1, 1, 0, 0,
        aa_SIZE / 2, aa_SIZE, 0, 1, 1, 1, 1, 0,
        aa_SIZE / 2, 0, 0, 1, 1, 1, 1, 1,
    ])
    var aa = {
        position: new Vector3(position),
        vb: VertexBuffer.createStatic(vertBuffer),
        vertCount: vertBuffer.length / 8,
        world: new Matrix(),
        shotDelay: 0,
        life: aa_LIFE
    }
    aas.push(aa)
}

function aas_init()
{

}

function aas_update(dt)
{
    var len = aas.length
	plane.aaInRange = 0
    for (var i = 0; i < len; ++i)
    {
        var aa = aas[i]
        aa.world = Matrix.createConstrainedBillboard(aa.position, camera.position, Vector3.UNIT_Z)

        var disSqrt = Vector3.distanceSquared(aa.position.add(new Vector3(0, 0, 0.1)), plane.position)
		if (disSqrt <= 20 * 20)
		{
			// Keep track of the nbr of AAs in range
			plane.aaInRange++
		}
			
        if (aa.shotDelay <= 0)
        {
			if (disSqrt <= aa_RANGE_SQR && disSqrt >= 10 * 10)
            {
                turret_shoot(aa, plane, 15)
                aa.shotDelay = aa_RECHARGE_TIME
            }
        }
        else
        {
            aa.shotDelay -= dt
        }
    }
}

function turret_shoot(from, target, precision)
{
    var dir = target.position.sub(from.position)
    var dist = dir.length()
    var shot = shot_create(from.position.add(new Vector3(0, 0, 0.3)), dir.div(dist).mul(SHOT_VEL), from, precision, true, dist / (SHOT_VEL))
    shot.flak = true
    play3DSound(from.position, "shot.wav", 0.75)
}

function aas_render()
{
    Renderer.setTexture(aa_TEXTURE, 1)

    var len = aas.length
    for (var i = 0; i < len; ++i)
    {
        var aa = aas[i]
        Renderer.setWorld(aa.world)
        Renderer.setVertexBuffer(aa.vb)
        Renderer.draw(aa.vertCount)
    }
}
