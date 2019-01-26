input float3 inPosition;
input float3 inNormal;
input float2 inTexCoord;

output float4 outPosition;
output float2 outTexCoord;
output float4 outShade;

extern matrix world;
extern float3 sunDir;

void main()
{
    oPosition = mul(float4(inPosition, 1), oViewProjection);
    outPosition = oPosition;
    float3 normal = mul(float4(inNormal, 0), world).xyz;
    // float3 normal = mul(inNormal, (float3x3)world);

    outTexCoord = inTexCoord;

    float d = dot(normal, sunDir);
    float percent = (d + 1) / 2;
    percent = pow(percent, 4);
    percent = lerp(0.5, 4, percent);
    percent = saturate(percent);

    outShade = float4(percent, percent, percent, 1);
}
