var COL_SKY_BOTTOM = Color.fromHexRGB(0x8bd0ba)
var COL_SKY_TOP = Color.fromHexRGB(0x55a894)
var COL_WATER = Color.fromHexRGB(0x38607c)
var COL_CLOUD = Color.fromHexRGB(0xfff8c0)

var res = new Vector2(0, 0)

init()

function init()
{
    skybox_init()
}

function update(dt)
{
    res = Renderer.getResolution()

    camera_update(dt)
    skybox_update(dt)
}

function render()
{
    res = Renderer.getResolution()

    Renderer.clear(COL_WATER)
    Renderer.setView(camera.view)
    Renderer.setProjection(camera.projection)
    
    skybox_render()

    // Renderer.clear(COL_WATER)
    // SpriteBatch.begin()
    // SpriteBatch.drawRectWithColors(null, new Rect(0, 0, res.x, res.y * (2/3)), COL_SKY_TOP, COL_SKY_BOTTOM, COL_SKY_BOTTOM, COL_SKY_TOP)
    // SpriteBatch.drawSprite(null, new Vector2(100, 100), COL_CLOUD, 0, 100);
    // SpriteBatch.drawSprite(null, new Vector2(150, 90), COL_CLOUD, 0, 100);

    // SpriteBatch.drawSprite(null, new Vector2(500, 120), COL_CLOUD, 0, 100);
    // SpriteBatch.drawSprite(null, new Vector2(550, 110), COL_CLOUD, 0, 100);
    // SpriteBatch.end()
}

function renderUI()
{
    res = Renderer.getResolution()
}
