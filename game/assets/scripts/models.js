function calcNormal(verts)
{
    for (var i = 0; i < verts.length; i += 3 * 8)
    {
        var p1 = new Vector3(verts[i + 0], verts[i + 1], verts[i + 2])
        var p2 = new Vector3(verts[i + 8], verts[i + 9], verts[i + 10])
        var p3 = new Vector3(verts[i + 16], verts[i + 17], verts[i + 18])
        var normal = p3.sub(p2).cross(p1.sub(p2)).normalize()
        verts[i + 3] = normal.x
        verts[i + 4] = normal.y
        verts[i + 5] = normal.z
        verts[i + 11] = normal.x
        verts[i + 12] = normal.y
        verts[i + 13] = normal.z
        verts[i + 19] = normal.x
        verts[i + 20] = normal.y
        verts[i + 21] = normal.z
    }
}

function mirrorVertices(verts)
{
    var len = verts.length
    for (var i = 0; i < len; i += 8 * 3)
    {
        verts.push(
            -verts[i + 0], verts[i + 1], verts[i + 2], 0, 0, 1, verts[i + 6], verts[i + 7],
            -verts[i + 16], verts[i + 17], verts[i + 18], 0, 0, 1, verts[i + 22], verts[i + 23],
            -verts[i + 8], verts[i + 9], verts[i + 10], 0, 0, 1, verts[i + 14], verts[i + 15]
        )
    }
}

function normalsToColor(verts)
{
    var len = verts.length
    for (var i = 0; i < len; i += 8)
    {
        var d = sun.dir.dot(new Vector3(verts[i + 3], verts[i + 4], verts[i + 5]))
        var percent = (d + 1) / 2
        percent = Math.pow(percent, 4)
        percent = 0.25 + (1.25 - 0.25) * percent
        percent = Math.min(1, Math.max(0, percent))

        verts[i + 3] = percent
        verts[i + 4] = percent
        verts[i + 5] = percent
    }
}
