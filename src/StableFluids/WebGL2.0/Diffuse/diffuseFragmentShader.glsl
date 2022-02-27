#version 300 es
precision mediump float;

uniform float diffuse;
uniform vec2 resolution;
uniform float dt;
uniform sampler2D velocityTexture;
uniform sampler2D diffuseTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 preVelocity = texelFetch(velocityTexture, coord, 0).rg;
    ivec2 coord1 = ivec2(gl_FragCoord.xy) - ivec2(2.0, 0.0);
    vec2 curVelocity1 = texelFetch(diffuseTexture, coord1, 0).rg;
    ivec2 coord2 = ivec2(gl_FragCoord.xy) + ivec2(2.0, 0.0);
    vec2 curVelocity2 = texelFetch(diffuseTexture, coord2, 0).rg;
    ivec2 coord3 = ivec2(gl_FragCoord.xy) - ivec2(0.0, 2.0);
    vec2 curVelocity3 = texelFetch(diffuseTexture, coord3, 0).rg;
    ivec2 coord4 = ivec2(gl_FragCoord.xy) + ivec2(0.0, 2.0);
    vec2 curVelocity4 = texelFetch(diffuseTexture, coord4, 0).rg;


    vec2 curVelocity = (preVelocity + diffuse * dt * (curVelocity1 + curVelocity2 + curVelocity3 + curVelocity4)) / (1.0 + 4.0 * diffuse * dt);

    // ivec2 iResolution = ivec2(resolution);
    // curVelocity = coord.x > iResolution.x - 2 ? vec2(0.0) : curVelocity;
    // curVelocity = coord.x < 2 ? vec2(0.0) : curVelocity;
    // curVelocity = coord.y > iResolution.y - 2 ? vec2(0.0) : curVelocity;
    // curVelocity = coord.y < 2 ? vec2(0.0) : curVelocity;

    outColor = vec4(curVelocity, 0.0, 1.0);
}