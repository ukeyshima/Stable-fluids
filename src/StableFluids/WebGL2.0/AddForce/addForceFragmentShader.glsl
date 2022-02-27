#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform vec2 mousePosition;
uniform vec2 mouseDirection;
uniform int mouseDown;
uniform sampler2D velocityTexture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 velocity = texelFetch(velocityTexture, coord, 0).rg;
    vec2 p = (gl_FragCoord.xy - mousePosition) / min(resolution.x, resolution.y);
    velocity += p.x > -1.0 && p.x < 1.0 && p.y > -1.0 && p.y < 1.0 ? float(mouseDown) * vec2(mouseDirection.x, -mouseDirection.y) * vec2(0.001 / length(p)) : vec2(0.0);
    outColor = vec4(velocity, 0.0, 1.0);
}