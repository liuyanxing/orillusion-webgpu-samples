import"./modulepreload-polyfill.c7c6310f.js";const p=`@vertex
fn main(@location(0) position : vec3<f32>) -> @builtin(position) vec4<f32> {
    return vec4<f32>(position, 1.0);
}`,w=`@group(0) @binding(0) var<uniform> color : vec4<f32>;

@fragment
fn main() -> @location(0) vec4<f32> {
    return color;
}`,c=new Float32Array([0,.5,0,-.5,-.5,0,.5,-.5,0]),m=3;async function h(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter();if(!t)throw new Error("No Adapter Found");const r=await t.requestDevice(),n=e.getContext("webgpu"),o=navigator.gpu.getPreferredCanvasFormat?navigator.gpu.getPreferredCanvasFormat():n.getPreferredFormat(t),a=window.devicePixelRatio||1;e.width=e.clientWidth*a,e.height=e.clientHeight*a;const i={width:e.width,height:e.height};return n.configure({device:r,format:o,alphaMode:"opaque"}),{device:r,context:n,format:o,size:i}}async function v(e,t){const r=await e.createRenderPipelineAsync({label:"Basic Pipline",layout:"auto",vertex:{module:e.createShaderModule({code:p}),entryPoint:"main",buffers:[{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},fragment:{module:e.createShaderModule({code:w}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),n=e.createBuffer({label:"GPUBuffer store vertex",size:c.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(n,0,c);const o=e.createBuffer({label:"GPUBuffer store rgba color",size:4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(o,0,new Float32Array([1,1,0,1]));const a=e.createBindGroup({label:"Uniform Group with colorBuffer",layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:o}}]});return{pipeline:r,vertexBuffer:n,colorBuffer:o,uniformGroup:a}}function s(e,t,r){const n=e.createCommandEncoder(),a={colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},i=n.beginRenderPass(a);i.setPipeline(r.pipeline),i.setBindGroup(0,r.uniformGroup),i.setVertexBuffer(0,r.vertexBuffer),i.draw(m),i.end(),e.queue.submit([n.finish()])}async function P(){var a,i;const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:r,format:n}=await h(e),o=await v(t,n);s(t,r,o),(a=document.querySelector('input[type="color"]'))==null||a.addEventListener("input",f=>{const u=f.target.value;console.log(u);const l=+("0x"+u.slice(1,3))/255,d=+("0x"+u.slice(3,5))/255,g=+("0x"+u.slice(5,7))/255;t.queue.writeBuffer(o.colorBuffer,0,new Float32Array([l,d,g,1])),s(t,r,o)}),(i=document.querySelector('input[type="range"]'))==null||i.addEventListener("input",f=>{const u=+f.target.value;console.log(u),c[0]=0+u,c[3]=-.5+u,c[6]=.5+u,t.queue.writeBuffer(o.vertexBuffer,0,c),s(t,r,o)}),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,s(t,r,o)})}P();
