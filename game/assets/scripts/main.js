var res = new Vector2(0, 0)
var skyboxRT = Texture.createScreenRenderTarget()
var bloomRT = Texture.createScreenRenderTarget()
var screenRT = Texture.createScreenRenderTarget()
var font = getFont("font.fnt")
var bloomPS = getShader("bloom.ps")
var crosshair = getTexture("crosshair.png")
var store = loadUI("store.json")

init()

var costs = [0, 25, 75]

function init()
{
    Input.setMouseVisible(false)
    
    skybox_init()
    carrier_init()
    plane_init()
    camera_init()
    map_init()
    clouds_init()
    ocean_init()
    shots_init()
    trees_init()
    tanks_init()
    tents_init()
    aas_init()

    store.setVisible(false)
    setUINavigation(true)

    findUI("ok").setOnClick(function()
    {
        store.setVisible(false)
    })
    findUI("getRefuel").setOnClick(function()
    {
        if (plane.cash >= costs[plane.upgrades.fuel + 1])
        {
            plane.cash -= costs[plane.upgrades.fuel + 1]
            ++plane.upgrades.fuel
            if (plane.upgrades.fuel == 2) findUI("getRefuel").setEnabled(false)
            findUI("refuelPow" + plane.upgrades.fuel).setVisible(true)
            playSound("purchase.wav")
        }
        else
        {
            playSound("wrong.wav", 0.5, 0, 2)
        }
    })
    findUI("getAmmo").setOnClick(function()
    {
        if (plane.cash >= costs[plane.upgrades.ammo + 1])
        {
            plane.cash -= costs[plane.upgrades.ammo + 1]
            ++plane.upgrades.ammo
            if (plane.upgrades.ammo == 2) findUI("getAmmo").setEnabled(false)
            findUI("ammoPow" + plane.upgrades.ammo).setVisible(true)
            playSound("purchase.wav")
        }
        else
        {
            playSound("wrong.wav", 0.5, 0, 2)
        }
    })
    findUI("getSpeed").setOnClick(function()
    {
        if (plane.cash >= costs[plane.upgrades.speed + 1])
        {
            plane.cash -= costs[plane.upgrades.speed + 1]
            ++plane.upgrades.speed
            if (plane.upgrades.speed == 2) findUI("getSpeed").setEnabled(false)
            findUI("speedPow" + plane.upgrades.speed).setVisible(true)
            playSound("purchase.wav")
        }
        else
        {
            playSound("wrong.wav", 0.5, 0, 2)
        }
    })
    findUI("getLife").setOnClick(function()
    {
        if (plane.cash >= costs[plane.upgrades.life + 1])
        {
            plane.cash -= costs[plane.upgrades.life + 1]
            ++plane.upgrades.life
            if (plane.upgrades.life == 2) findUI("getLife").setEnabled(false)
            findUI("lifePow" + plane.upgrades.life).setVisible(true)
            playSound("purchase.wav")
        }
        else
        {
            playSound("wrong.wav", 0.5, 0, 2)
        }
    })
}

// var tmp = 0
function update(dt)
{
    if (Input.isJustDown(Key.ESCAPE)) quit()

    res = Renderer.getResolution()

    plane_update(dt)
    carrier_update(dt)
    tanks_update(dt)
    tents_update(dt)
    aas_update(dt)
    camera_update(dt)
    skybox_update(dt)
    clouds_update(dt)
    ocean_update(dt)
    sun_update(dt)
    shots_update(dt)
    smokes_update(dt)
    trees_update(dt)
    explosions_update(dt)

    // tmp -= dt
    // if (tmp <= 0)
    // {
    //     explosion_create(new Vector3(0, 3, 2), 8)
    //     tmp = 2
    // }
}

function render()
{
    res = Renderer.getResolution()

    Renderer.clear(Color.BLACK)
    Renderer.clearDepth()
    
    Renderer.pushRenderTarget(skyboxRT)
    skybox_render()
    sun_render()
    Renderer.popRenderTarget()

    Renderer.pushRenderTarget(screenRT)
    Renderer.clearDepth()
    
    SpriteBatch.begin()
    SpriteBatch.drawRect(skyboxRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()

    // Standard 3D
    threeD_setup()
    plane_render()
    carrier_render()
    tents_render()
    trees_render()
    tanks_render()
    aas_render()
    clouds_render()
    map_render()
    ocean_render()

    // Specials
    explosions_render()
    smokes_render()
    shots_render()
    propeller_render()

    cloud_renderOverlay()
    Renderer.popRenderTarget()

    Renderer.pushRenderTarget(bloomRT)
    SpriteBatch.begin(Matrix.IDENTITY, bloomPS)
    Renderer.setBlendMode(BlendMode.OPAQUE)
    SpriteBatch.drawRect(screenRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()
    Renderer.popRenderTarget()

    bloomRT.blur()
    SpriteBatch.begin()
    Renderer.setBlendMode(BlendMode.OPAQUE)
    SpriteBatch.drawRect(screenRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    Renderer.setBlendMode(BlendMode.ADD)
    SpriteBatch.drawRect(bloomRT, new Rect(0, 0, res.x, res.y), Color.WHITE)
    SpriteBatch.end()

    var viewProj = camera.view.mul(camera.projection)
    var target = plane.position.add(new Vector3(plane.world._21, plane.world._22, plane.world._23).mul(20))
    var screenPos = new Vector4(target.x, target.y, target.z, 1).transform(viewProj)
    var screenPos2d = new Vector2(
        screenPos.x / screenPos.z * res.x / 2 + res.x / 2, 
        -screenPos.y / screenPos.z * res.y / 2 + res.y / 2)
    if (!plane.dead)
    {
        SpriteBatch.begin()
        Renderer.setBlendMode(BlendMode.ADD)
        SpriteBatch.drawSprite(crosshair, screenPos2d, new Color(0.8, 0, 0, 1), 0, 1, Vector2.CENTER)
        SpriteBatch.end()
    }
    else
    {
        SpriteBatch.begin()
        Renderer.setBlendMode(BlendMode.PREMULTIPLIED)
        SpriteBatch.drawSprite(getTexture("credits.png"), new Vector2(res.x / 2, res.y / 1.25), Color.WHITE, 0, 1.5)
        SpriteBatch.end()
    }

    // Hud
    drawProgressBar(new Vector2(10, 30), "FUEL", plane.fuel, UPGRADES.fuel[plane.upgrades.fuel], UPGRADES.fuel[0])
    drawProgressBar(new Vector2(10, 70), "LIFE", plane.life, UPGRADES.life[plane.upgrades.life], UPGRADES.life[0])
    drawProgressBar(new Vector2(10, 110), "AMMO", plane.bullets, UPGRADES.ammo[plane.upgrades.ammo], UPGRADES.ammo[0])

    // SpriteBatch.begin()
    // SpriteBatch.drawText(font, "Speed: " + plane.speed, new Vector2(10, 20), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // SpriteBatch.drawText(font, "Lift: " + plane.lift, new Vector2(10, 40), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // if (plane.onDeck)
    // {
    //     SpriteBatch.drawText(font, "ON DECK", new Vector2(10, 60), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // }
    // SpriteBatch.drawText(font, "Life: " + plane.life, new Vector2(10, 80), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // SpriteBatch.drawText(font, "Fuel: " + plane.fuel, new Vector2(10, 100), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // SpriteBatch.drawText(font, "Bullets: " + plane.bullets, new Vector2(10, 120), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // SpriteBatch.drawText(font, "Cash: " + plane.cash + "$", new Vector2(10, 140), Vector2.TOP_LEFT, new Color(0.8, 0, 0, 1));
    // SpriteBatch.end()

    Renderer.setFilterMode(FilterMode.NEAREST)
}

function drawProgressBar(pos, name, val, max, base)
{
    var w = 100 * (max / base)
    var h = 25
    var p = val / max

    SpriteBatch.begin()
    SpriteBatch.drawRect(null, new Rect(pos.x, pos.y, w + 6, h + 6), Color.fromHexRGB(0x101024))
    SpriteBatch.drawRect(null, new Rect(pos.x + 2, pos.y + 2, w + 2, h + 2), Color.fromHexRGB(0x2a2a3a))
    SpriteBatch.drawRect(null, new Rect(pos.x + 3, pos.y + 3, w * p, h), Color.fromHexRGB(0xffcc68))
    SpriteBatch.end()

    SpriteBatch.begin(Matrix.createScale(1.5))
    var texPos = new Vector2((pos.x + 6) / 1.5, (pos.y + h / 2 + 3) / 1.5)
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(-1, -1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(0, -1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(1, -1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(-1, 0)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(1, 0)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(-1, 1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(0, 1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos.add(new Vector2(1, 1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
    SpriteBatch.drawText(font, name, texPos, Vector2.LEFT, Color.fromHexRGB(0xfff8c0))
    SpriteBatch.end()
}

function renderUI()
{
    res = Renderer.getResolution()

    if (store.isVisible())
    {
        SpriteBatch.begin(Matrix.createScale(2).mul(Matrix.createTranslation(new Vector3(res.x / 2, res.y / 2, 0))))
        if (plane.upgrades.fuel < 2)
        {
            var cost = costs[plane.upgrades.fuel + 1]
            var rect = findUI("getRefuel").getRect()
            var pos = new Vector2((rect.x / 2 - 160) - 1, (rect.y / 2 + rect.h / 4 - 90))
            SpriteBatch.drawText(font, cost + " $", pos.add(new Vector2(1)), Vector2.RIGHT, Color.fromHexRGB(0x101024))
            SpriteBatch.drawText(font, cost + " $", pos, Vector2.RIGHT, Color.fromHexRGB(0xfff8c0))
        }
        if (plane.upgrades.life < 2)
        {
            var cost = costs[plane.upgrades.life + 1]
            var rect = findUI("getLife").getRect()
            var pos = new Vector2((rect.x / 2 - 160) - 1, (rect.y / 2 + rect.h / 4 - 90))
            SpriteBatch.drawText(font, cost + " $", pos.add(new Vector2(1)), Vector2.RIGHT, Color.fromHexRGB(0x101024))
            SpriteBatch.drawText(font, cost + " $", pos, Vector2.RIGHT, Color.fromHexRGB(0xfff8c0))
        }
        if (plane.upgrades.ammo < 2)
        {
            var cost = costs[plane.upgrades.ammo + 1]
            var rect = findUI("getAmmo").getRect()
            var pos = new Vector2((rect.x / 2 - 160) - 1, (rect.y / 2 + rect.h / 4 - 90))
            SpriteBatch.drawText(font, cost + " $", pos.add(new Vector2(1)), Vector2.RIGHT, Color.fromHexRGB(0x101024))
            SpriteBatch.drawText(font, cost + " $", pos, Vector2.RIGHT, Color.fromHexRGB(0xfff8c0))
        }
        if (plane.upgrades.speed < 2)
        {
            var cost = costs[plane.upgrades.speed + 1]
            var rect = findUI("getSpeed").getRect()
            var pos = new Vector2((rect.x / 2 + rect.w / 2 - 160) + 1, (rect.y / 2 + rect.h / 4 - 90))
            SpriteBatch.drawText(font, cost + " $", pos.add(new Vector2(1)), Vector2.LEFT, Color.fromHexRGB(0x101024))
            SpriteBatch.drawText(font, cost + " $", pos, Vector2.LEFT, Color.fromHexRGB(0xfff8c0))
        }
        pos = new Vector2(70, 14)
        SpriteBatch.drawText(font, "Your cash: " + plane.cash  + " $", pos.add(new Vector2(1)), Vector2.CENTER, Color.fromHexRGB(0x101024))
        SpriteBatch.drawText(font, "Your cash: " + plane.cash  + " $", pos, Vector2.CENTER, Color.fromHexRGB(0xfff8c0))
        SpriteBatch.end()
    }
}
