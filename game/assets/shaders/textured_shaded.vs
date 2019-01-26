input float3 inPosition;
input float3 inNormal;
input float2 inTexCoord;

output float4 outPosition;
output float2 outTexCoord;
output float outShade;

extern matrix world;
extern float3 sunDir;

void main()
{
    oPosition = mul(float4(inPosition, 1), oViewProjection);
    outPosition = oPosition;
    float3 normal = mul(float4(inNormal, 0), world).xyz;

    outTexCoord = inTexCoord;

    float percent = max(dot(normal, sunDir) * 0.75 + 0.25, 0.25);
    percent = 1 - pow(1 - percent, 4);

    outShade = percent;
}
