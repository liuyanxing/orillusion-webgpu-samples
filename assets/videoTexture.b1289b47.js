import"./modulepreload-polyfill.c7c6310f.js";import{b as w}from"./basic.vert.adc01c29.js";import{v as f,a as v}from"./cube.aa091a3d.js";import{b as P}from"./math.c29ca26c.js";import"./mat4.f7fc816f.js";const b=`@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_external;

@fragment
fn main(@location(0) fragUV: vec2<f32>,
        @location(1) fragPosition: vec4<f32>) -> @location(0) vec4<f32> {
  return textureSampleLevel(Texture, Sampler, fragUV) * fragPosition;
}
`,y="/orillusion-webgpu-samples/video.mp4";async function B(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const a=await navigator.gpu.requestAdapter();if(!a)throw new Error("No Adapter Found");const r=await a.requestDevice(),i=e.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat?navigator.gpu.getPreferredCanvasFormat():i.getPreferredFormat(a),o=window.devicePixelRatio||1;e.width=e.clientWidth*o,e.height=e.clientHeight*o;const t={width:e.width,height:e.height};return i.configure({device:r,format:n,alphaMode:"opaque"}),{device:r,context:i,format:n,size:t}}async function T(e,a,r){const i=await e.createRenderPipelineAsync({label:"Basic Pipline",layout:"auto",vertex:{module:e.createShaderModule({code:w}),entryPoint:"main",buffers:[{arrayStride:20,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:b}),entryPoint:"main",targets:[{format:a}]},primitive:{topology:"triangle-list",cullMode:"back",frontFace:"ccw"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}}),n=e.createTexture({size:r,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),o=n.createView(),t=e.createBuffer({label:"GPUBuffer store vertex",size:f.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(t,0,f);const u=e.createBuffer({label:"GPUBuffer store 4x4 matrix",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=e.createBindGroup({label:"Uniform Group with Matrix",layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}}]});return{pipeline:i,vertexBuffer:t,mvpBuffer:u,uniformGroup:s,depthTexture:n,depthView:o}}function U(e,a,r,i){const n=e.createCommandEncoder(),o={colorAttachments:[{view:a.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:r.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},t=n.beginRenderPass(o);t.setPipeline(r.pipeline),t.setBindGroup(0,r.uniformGroup),t.setBindGroup(1,i),t.setVertexBuffer(0,r.vertexBuffer),t.draw(v),t.end(),e.queue.submit([n.finish()])}async function G(){const e=document.createElement("video");e.loop=!0,e.autoplay=!0,e.muted=!0,e.src=y,await e.play();const a=document.querySelector("canvas");if(!a)throw new Error("No Canvas");const{device:r,context:i,format:n,size:o}=await B(a),t=await T(r,n,o),u=r.createSampler({magFilter:"linear",minFilter:"linear"});let s=o.width/o.height;const l={x:0,y:0,z:-5},m={x:1,y:1,z:1},c={x:0,y:0,z:0};function d(){const g=r.importExternalTexture({source:e}),h=r.createBindGroup({layout:t.pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:u},{binding:1,resource:g}]}),p=Date.now()/1e3;c.x=Math.sin(p),c.y=Math.cos(p);const x=P(s,l,c,m);r.queue.writeBuffer(t.mvpBuffer,0,x.buffer),U(r,i,t,h),requestAnimationFrame(d)}d(),window.addEventListener("resize",()=>{o.width=a.width=a.clientWidth*devicePixelRatio,o.height=a.height=a.clientHeight*devicePixelRatio,t.depthTexture.destroy(),t.depthTexture=r.createTexture({size:o,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),t.depthView=t.depthTexture.createView(),s=o.width/o.height})}G();
