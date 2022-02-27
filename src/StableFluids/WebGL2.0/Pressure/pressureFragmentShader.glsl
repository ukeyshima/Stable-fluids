#version 300 es
precision mediump float;

uniform float dt;
uniform vec2 resolution;
uniform sampler2D poissonTexture;
uniform sampler2D velocityTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float p0 = texelFetch(poissonTexture, coord + ivec2(1.0, 0.0), 0).r;
    float p1 = texelFetch(poissonTexture, coord - ivec2(1.0, 0.0), 0).r;
    float p2 = texelFetch(poissonTexture, coord + ivec2(0.0, 1.0), 0).r;
    float p3 = texelFetch(poissonTexture, coord - ivec2(0.0, 1.0), 0).r;
    vec2 velocity = texelFetch(velocityTexture, coord, 0).rg;

    velocity = velocity - vec2(p0 - p1, p2 - p3) / 2.0;

    // ivec2 iResolution = ivec2(resolution);
    // velocity = coord.x > iResolution.x - 2 ? vec2(0.0) : velocity;
    // velocity = coord.x < 2 ? vec2(0.0) : velocity;
    // velocity = coord.y > iResolution.y - 2 ? vec2(0.0) : velocity;
    // velocity = coord.y < 2 ? vec2(0.0) : velocity;

    outColor = vec4(velocity, 0.0, 1.0);
}