input float3 inPosition;
input float3 inNormal;
input float2 inTexCoord;

output float2 outTexCoord;
output float outShade;

extern matrix normalWorld;

void main()
{
    oPosition = mul(float4(inPosition.xyz, 1), oViewProjection);
    float3 normal = mul(float4(inNormal, 1), normalWorld).xyz;

    outTexCoord = inTexCoord;
    outShade = 1;
}
