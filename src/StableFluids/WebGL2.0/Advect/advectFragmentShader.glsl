#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform float dt;
uniform sampler2D velocityTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 preVelocity = texelFetch(velocityTexture, coord, 0).rg;

    ivec2 coord2 = coord - ivec2(preVelocity * dt * resolution);
    vec2 curVelocity = texelFetch(velocityTexture, coord2, 0).rg;

    // ivec2 iResolution = ivec2(resolution);
    // curVelocity = coord.x > iResolution.x - 2 ? vec2(0.0) : curVelocity;
    // curVelocity = coord.x < 2 ? vec2(0.0) : curVelocity;
    // curVelocity = coord.y > iResolution.y - 2 ? vec2(0.0) : curVelocity;
    // curVelocity = coord.y < 2 ? vec2(0.0) : curVelocity;

    outColor = vec4(curVelocity, 0.0, 1.0);
}
