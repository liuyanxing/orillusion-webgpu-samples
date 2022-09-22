import triangleVert from './shaders/triangle.vert.wgsl?raw'
import redFrag from './shaders/red.frag.wgsl?raw'

// initialize webgpu device & config canvas context
async function initWebGPU(canvas: HTMLCanvasElement) {
    if (!navigator.gpu) { throw new Error("browser does not support webgpu"); }
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
    });
    const device = await adapter!.requestDevice();
    const format = navigator.gpu.getPreferredCanvasFormat();
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;

    const context = canvas.getContext('webgpu') as GPUCanvasContext;
    context.configure({
        device,
        format, 
    });
    return { device, format, context };
}
// create a simple pipiline
async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
    const descriptor: GPURenderPipelineDescriptor = {
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: triangleVert,
            }),
            entryPoint: 'main',
        },
        primitive: {
            topology: 'triangle-list',
        },
        fragment: {
            module: device.createShaderModule({
                code: redFrag,
            }),
            entryPoint: 'main',
            targets: [{ format }]
        }
    };
    const pipline = await device.createRenderPipelineAsync(descriptor);
    return pipline;
}
// create & submit device commands
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline) {
    const view = context.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [{
            view,
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp:'clear',
            storeOp: 'store'
        }]
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
}

async function run() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const { device, format, context } = await initWebGPU(canvas);
    const pipline = await initPipeline(device, format);
    draw(device, context, pipline);
}
run()