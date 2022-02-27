#version 300 es
precision mediump float;

uniform vec2 resolution;

layout(location = 0) out vec4 outColor;

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec2 velocity = vec2(0.0, 0.0);
    outColor = vec4(velocity, 0.0, 1.0);
}
