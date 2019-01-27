var TANK_TEXTURE = getTexture("tank2.png")
var TANK_SIZE = 0.5
var TANK_RANGE_SQR = 15 * 15
var TANK_SHOT_INTERVAL = 0.3
var TANK_SHOT_COUNT = 3
var TANK_RECHARGE_TIME = 5
var TANK_LIFE = 5

var tanks = []

function tank_create(position)
{
    var vertBuffer = new Float32Array([
        -TANK_SIZE, TANK_SIZE, 0, 1, 1, 1, 0, 0,
        TANK_SIZE, 0, 0, 1, 1, 1, 1, 1,
        -TANK_SIZE, 0, 0, 1, 1, 1, 0, 1,
        -TANK_SIZE, TANK_SIZE, 0, 1, 1, 1, 0, 0,
        TANK_SIZE, TANK_SIZE, 0, 1, 1, 1, 1, 0,
        TANK_SIZE, 0, 0, 1, 1, 1, 1, 1,
    ])
    var tank = {
        position: new Vector3(position),
        vb: VertexBuffer.createStatic(vertBuffer),
        vertCount: vertBuffer.length / 8,
        world: new Matrix(),
        shotDelay: 0,
        shotRemaining: TANK_SHOT_COUNT,
        life: TANK_LIFE
    }
    tanks.push(tank)
}

function tanks_init()
{

}

function tanks_update(dt)
{
    var len = tanks.length
	plane.tanksInRange = 0
    for (var i = 0; i < len; ++i)
    {
        var tank = tanks[i]
        tank.world = Matrix.createConstrainedBillboard(tank.position, camera.position, Vector3.UNIT_Z)

        var disSqrt = Vector3.distanceSquared(tank.position.add(new Vector3(0, 0, 0.1)), plane.position)
		if (disSqrt <= TANK_RANGE_SQR)
		{
			// Keep track of the nbr of Tanks in range
			plane.tanksInRange++
		}
        if (tank.shotDelay <= 0)
        {
            if (disSqrt <= TANK_RANGE_SQR)
            {	
                entity_shoot(tank, plane, 15)
                tank.shotRemaining--
                if (tank.shotRemaining <= 0)
                {
                    tank.shotRemaining = TANK_SHOT_COUNT
                    tank.shotDelay = TANK_RECHARGE_TIME
                }
                else tank.shotDelay = TANK_SHOT_INTERVAL
            }
        }
        else
        {
            tank.shotDelay -= dt
        }
    }
}

function entity_shoot(from, target, precision)
{
    var dir = target.position.sub(from.position).normalize()
    shot_create(from.position.add(new Vector3(0, 0, 0.3)), dir.mul(SHOT_VEL * 0.5), from, precision, true, 2)
    play3DSound(from.position, "shot.wav", 0.5)
}

function play3DSound(position, filename, pitch)
{
    var dir = position.sub(camera.position)
    var dis = dir.length()
    if (dis > 40) return // Too far

    var volume = 1 - dis / 40
    volume = Math.pow(volume, 4)

    setTimeout(function()
    {
        var right = camera.front.cross(camera.up).normalize()
        var balance = right.dot(dir) / dis
        playSound(filename, volume, balance, pitch)
    }, (dis / 17.15) * 1000) // Speed of sound ;)
}

function tanks_render()
{
    Renderer.setTexture(TANK_TEXTURE, 1)

    var len = tanks.length
    for (var i = 0; i < len; ++i)
    {
        var tank = tanks[i]
        Renderer.setWorld(tank.world)
        Renderer.setVertexBuffer(tank.vb)
        Renderer.draw(tank.vertCount)
    }
}
