var plane = {
    position: new Vector3(0, 0, 100),
    velocity: new Vector3(0, 0, 0),
    front: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1),
    onDeck: true,
    wingFold: 1,
    world: new Matrix()
}

var PLANE_WIDTH = 0.6
var PLANE_LENGTH = 0.5
var PLANE_GEAR_OFFSET = 0.1

function plane_init()
{
    // Local position on deck
    plane.position = new Vector3(
        0, 
        -CARRIER_DECK_LENGTH / 2 + PLANE_LENGTH, 
        CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET)
}

function plane_update(dt)
{
    if (plane.onDeck)
    {
        plane.world = Matrix.createWorld(plane.position, plane.front, plane.up).mul(carrier.world)
    }
    else
    {
        plane.world = Matrix.createWorld(plane.position, plane.front, plane.up)
    }
}

function plane_render()
{

}
