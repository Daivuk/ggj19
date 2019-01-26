var plane = {
    position: new Vector3(0, 0, 100),
    velocity: new Vector3(0, 0, 0),
    front: new Vector3(0, 1, 0),
    up: new Vector3(0, 0, 1)
}

var PLANE_WIDTH = 0.6
var PLANE_LENGTH = 0.5
var PLANE_GEAR_OFFSET = 0.1

function plane_init()
{
    plane.position = new Vector3(
        carrier.position.x, 
        carrier.position.y - CARRIER_DECK_LENGTH / 2 + PLANE_LENGTH, 
        carrier.position.z + CARRIER_DECK_HEIGHT + PLANE_GEAR_OFFSET)
}

function plane_update(dt)
{

}

function plane_render()
{

}
