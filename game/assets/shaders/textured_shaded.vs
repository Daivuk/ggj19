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

    float d = dot(normal, sunDir);
    // float percent = max( * 0.75 + 0.25, 0.25);
    float percent = (d + 1) / 2;
    percent = lerp(0.25, 1, percent);
    percent = 1 - pow(1 - percent, 4);
    percent *= 1.05; // Gamma boost

    outShade = percent;
}
