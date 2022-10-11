import { glMatrix, mat4, vec3 } from "gl-matrix";
import { clamp } from "./math";
import {
  readBinaryFile,
  Vertex,
  rawVertices,
  memcpy,
  rawIndicies,
  UniformBufferObject,
} from "./util";
import { performance } from "perf_hooks";

const MAX_FRAMES_IN_FLIGHT = 2;
const ENABLE_VALIDATION_LAYERS = Boolean(
  parseInt(process.env.ENABLE_VALIDATION_LAYERS || "")
);
const START_TIME = performance.now();

class QueueFamilyIndices {
  public graphicsFamily?: number;
  public presentFamily?: number;

  isComplete() {
    return (
      this.graphicsFamily !== undefined && this.presentFamily !== undefined
    );
  }
}

class SwapChainSupportDetails {
  public capabilities = new VkSurfaceCapabilitiesKHR();
  public formats: VkSurfaceFormatKHR[] = [];
  public presentModes: Int32Array = new Int32Array();
}

export default class VulkanEngine {
  static debugCallback(
    messageSeverity: VkDebugUtilsMessageSeverityFlagBitsEXT,
    messageType: VkDebugUtilsMessageTypeFlagBitsEXT,
    pCallbackData: VkDebugUtilsMessengerCallbackDataEXT | null,
    pUserData: null
  ) {
    console.error("Validation layer:", pCallbackData?.pMessage);
    return false;
  }

  private win: VulkanWindow;
  private instance = new VkInstance();
  private validationLayers = ["VK_LAYER_KHRONOS_validation"];
  private deviceExtensions = ["VK_KHR_swapchain"];
  private debugMessenger = new VkDebugUtilsMessengerEXT();
  private surface = new VkSurfaceKHR();
  private physicalDevice = new VkPhysicalDevice();
  private device = new VkDevice();
  private graphicsQueue = new VkQueue();
  private presentQueue = new VkQueue();
  private swapChain = new VkSwapchainKHR();
  private swapChainImages: VkImage[] = [];
  private swapChainImageFormat?: VkFormat;
  private swapChainExtent: VkExtent2D | null = null;
  private swapChainImageViews: VkImageView[] = [];
  private renderPass = new VkRenderPass();
  private descriptorSetLayout = new VkDescriptorSetLayout();
  private pipelineLayout = new VkPipelineLayout();
  private graphicsPipeline = new VkPipeline();
  private swapChainFramebuffers: VkFramebuffer[] = [];
  private commandPool = new VkCommandPool();
  private vertexBuffer = new VkBuffer();
  private vertexBufferMemory = new VkDeviceMemory();
  private indexBuffer = new VkBuffer();
  private indexBufferMemory = new VkDeviceMemory();
  private uniformBuffers: VkBuffer[] = [];
  private uniformBuffersMemory: VkDeviceMemory[] = [];
  private descriptorPool = new VkDescriptorPool();
  private descriptorSets: VkDescriptorSet[] = [];
  private commandBuffers: VkCommandBuffer[] = [];
  private imageAvailableSemaphores: VkSemaphore[] = [];
  private renderFinishedSemaphores: VkSemaphore[] = [];
  private inFlightFences: VkFence[] = [];
  private currentFrame = 0;
  private framebufferResized = false;
  private shuttingDown = false;

  constructor(win: VulkanWindow) {
    this.win = win;
  }

  run() {
    this.init();
    this.update();
    this.cleanup();
  }

  init() {
    this.createInstance();
    this.createSurface();
    this.pickPhysicalDevice();
    this.createLogicalDevice();
    this.setupDebugMessenger();
    this.createSwapChain();
    this.createImageViews();
    this.createRenderPass();
    this.createDescriptorSetLayout();
    this.createGraphicsPipeline();
    this.createFramebuffers();
    this.createCommandPool();
    this.createVertexBuffer();
    this.createIndexBuffer();
    this.createUniformBuffers();
    this.createDescriptorPool();
    this.createDescriptorSets();
    this.createCommandBuffers();
    this.createSyncObjects();
    this.win.onresize = () => (this.framebufferResized = true);
    this.win.onclose = () => (this.shuttingDown = true);
  }

  update() {
    while (!this.win.shouldClose()) {
      this.win.pollEvents();
      if (!this.shuttingDown) this.drawFrame();
    }
  }

  cleanup() {
    vkDeviceWaitIdle(this.device);
    this.cleanupSwapChain();

    for (let i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
      vkDestroyBuffer(this.device, this.uniformBuffers[i], null);
      vkFreeMemory(this.device, this.uniformBuffersMemory[i], null);
    }

    vkDestroyDescriptorPool(this.device, this.descriptorPool, null);
    vkDestroyDescriptorSetLayout(this.device, this.descriptorSetLayout, null);

    vkDestroyBuffer(this.device, this.indexBuffer, null);
    vkFreeMemory(this.device, this.indexBufferMemory, null);

    vkDestroyBuffer(this.device, this.vertexBuffer, null);
    vkFreeMemory(this.device, this.vertexBufferMemory, null);

    vkDestroyPipeline(this.device, this.graphicsPipeline, null);
    vkDestroyPipelineLayout(this.device, this.pipelineLayout, null);

    vkDestroyRenderPass(this.device, this.renderPass, null);

    for (let i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
      vkDestroySemaphore(this.device, this.imageAvailableSemaphores[i], null);
      vkDestroySemaphore(this.device, this.renderFinishedSemaphores[i], null);
      vkDestroyFence(this.device, this.inFlightFences[i], null);
    }

    vkDestroyCommandPool(this.device, this.commandPool, null);

    if (ENABLE_VALIDATION_LAYERS) {
      vkDestroyDebugUtilsMessengerEXT(this.instance, this.debugMessenger, null);
    }

    vkDestroySurfaceKHR(this.instance, this.surface, null);
    vkDestroyDevice(this.device, null);
    vkDestroyInstance(this.instance, null);

    this.win.close();
  }

  createInstance() {
    if (ENABLE_VALIDATION_LAYERS && !this.checkValidationLayerSupport()) {
      throw new Error(
        "Validation layers requested, but not available. Are Vulkan dev tools installed?"
      );
    }

    const appInfo = new VkApplicationInfo();
    appInfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
    appInfo.pApplicationName = "Hello Triangle";
    appInfo.applicationVersion = VK_MAKE_VERSION(1, 0, 0);
    appInfo.pEngineName = "No Engine";
    appInfo.engineVersion = VK_MAKE_VERSION(1, 0, 0);
    appInfo.apiVersion = VK_API_VERSION_1_0;

    const createInfo = new VkInstanceCreateInfo();
    createInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
    createInfo.pApplicationInfo = appInfo;

    if (ENABLE_VALIDATION_LAYERS) {
      createInfo.enabledLayerCount = this.validationLayers.length;
      createInfo.ppEnabledLayerNames = this.validationLayers;
    } else {
      createInfo.enabledLayerCount = 0;
    }

    const extensions = this.getRequiredExtensions();
    this.validateExtensions(extensions);
    createInfo.ppEnabledExtensionNames = extensions;
    createInfo.enabledExtensionCount = extensions.length;

    if (vkCreateInstance(createInfo, null, this.instance) !== VK_SUCCESS) {
      throw new Error("Failed to create instance");
    }
  }

  getRequiredExtensions() {
    const extensions = this.win.getRequiredInstanceExtensions();
    if (ENABLE_VALIDATION_LAYERS) {
      extensions.push("VK_EXT_debug_utils");
    }
    return extensions;
  }

  validateExtensions(required: string[]) {
    const extensionCount: VkInout = { $: 0 };
    vkEnumerateInstanceExtensionProperties(null, extensionCount, null);
    const extensionProperties = Array(Number(extensionCount.$))
      .fill(null)
      .map(() => new VkExtensionProperties());
    vkEnumerateInstanceExtensionProperties(
      null,
      extensionCount,
      extensionProperties
    );

    const supportedExtensions = extensionProperties.map((e) => e.extensionName);
    for (const ext of required) {
      if (!supportedExtensions.includes(ext)) {
        throw new Error(`Required window extension not supported: ${ext}`);
      }
    }
  }

  checkValidationLayerSupport() {
    const layerCount: VkInout = { $: 0 };
    vkEnumerateInstanceLayerProperties(layerCount, null);
    const layerProperties = Array(Number(layerCount.$))
      .fill(null)
      .map(() => new VkLayerProperties());
    vkEnumerateInstanceLayerProperties(layerCount, layerProperties);
    const layerNames = layerProperties.map((l) => l.layerName);
    for (const layer of this.validationLayers) {
      if (!layerNames.includes(layer)) return false;
    }
    return true;
  }

  populateDebugMessengerCreateInfo() {
    const createInfo = new VkDebugUtilsMessengerCreateInfoEXT();
    createInfo.sType = VK_STRUCTURE_TYPE_DEBUG_UTILS_MESSENGER_CREATE_INFO_EXT;
    createInfo.messageSeverity =
      VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT |
      VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT |
      VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT;
    createInfo.messageType =
      VK_DEBUG_UTILS_MESSAGE_TYPE_GENERAL_BIT_EXT |
      VK_DEBUG_UTILS_MESSAGE_TYPE_VALIDATION_BIT_EXT |
      VK_DEBUG_UTILS_MESSAGE_TYPE_PERFORMANCE_BIT_EXT;
    createInfo.pfnUserCallback = VulkanEngine.debugCallback;
    createInfo.pUserData = null;
    return createInfo;
  }

  setupDebugMessenger() {
    if (!ENABLE_VALIDATION_LAYERS) return;
    const createInfo = this.populateDebugMessengerCreateInfo();

    if (
      vkCreateDebugUtilsMessengerEXT(
        this.instance,
        createInfo,
        null,
        this.debugMessenger
      ) !== VK_SUCCESS
    ) {
      throw new Error("Failed to set up debug messenger");
    }
  }

  pickPhysicalDevice() {
    const deviceCount: VkInout = { $: 0 };
    vkEnumeratePhysicalDevices(this.instance, deviceCount, null);
    if (deviceCount.$ === 0) {
      throw new Error("Failed to find GPUs with Vulkan support");
    }

    const devices = new Array(Number(deviceCount.$))
      .fill(null)
      .map(() => new VkPhysicalDevice());
    vkEnumeratePhysicalDevices(this.instance, deviceCount, devices);
    const device = devices.find((d) => this.isDeviceSuitable(d));
    if (!device) {
      throw new Error("Failed to find a suitable GPU");
    }
    this.physicalDevice = device;
  }

  isDeviceSuitable(device: VkPhysicalDevice) {
    const deviceProperties = new VkPhysicalDeviceProperties();
    vkGetPhysicalDeviceProperties(device, deviceProperties);

    const deviceFeatures = new VkPhysicalDeviceFeatures();
    vkGetPhysicalDeviceFeatures(device, deviceFeatures);

    const queueFamilies = this.findQueueFamilies(device);
    const extensionsSupported = this.checkDeviceExtensionSupport(device);

    let swapChainAdequate = false;
    if (extensionsSupported) {
      const swapChainSupport = this.querySwapChainSupport(device);
      swapChainAdequate =
        swapChainSupport.formats.length > 0 &&
        swapChainSupport.presentModes.length > 0;
    }

    if (
      deviceProperties.deviceType === VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU &&
      deviceFeatures.geometryShader &&
      queueFamilies.isComplete() &&
      extensionsSupported &&
      swapChainAdequate
    ) {
      console.log("Picked device:", deviceProperties.deviceName);
      return true;
    }

    return false;
  }

  checkDeviceExtensionSupport(device: VkPhysicalDevice) {
    const extensionCount: VkInout = { $: 0 };
    vkEnumerateDeviceExtensionProperties(device, null, extensionCount, null);
    const availableExtensions = new Array(Number(extensionCount.$))
      .fill(null)
      .map(() => new VkExtensionProperties());
    vkEnumerateDeviceExtensionProperties(
      device,
      null,
      extensionCount,
      availableExtensions
    );

    const requiredExtensions = new Set(this.deviceExtensions);

    for (const extension of availableExtensions) {
      if (extension.extensionName === null) continue;
      requiredExtensions.delete(extension.extensionName);
    }

    return requiredExtensions.size === 0;
  }

  findQueueFamilies(device: VkPhysicalDevice): QueueFamilyIndices {
    const indices = new QueueFamilyIndices();

    const queueFamilyCount: VkInout = { $: 0 };
    vkGetPhysicalDeviceQueueFamilyProperties(device, queueFamilyCount, null);
    const queueFamilies = new Array(Number(queueFamilyCount.$))
      .fill(null)
      .map(() => new VkQueueFamilyProperties());
    vkGetPhysicalDeviceQueueFamilyProperties(
      device,
      queueFamilyCount,
      queueFamilies
    );
    let i = 0;
    const presentSupport: VkInout = { $: false };
    for (const queueFamily of queueFamilies) {
      if (queueFamily.queueFlags & VK_QUEUE_GRAPHICS_BIT) {
        indices.graphicsFamily = i;
      }

      vkGetPhysicalDeviceSurfaceSupportKHR(
        device,
        i,
        this.surface,
        presentSupport
      );
      if (presentSupport.$) {
        indices.presentFamily = i;
      }

      if (indices.isComplete()) {
        break;
      }
      i++;
    }

    return indices;
  }

  querySwapChainSupport(device: VkPhysicalDevice) {
    const details = new SwapChainSupportDetails();

    vkGetPhysicalDeviceSurfaceCapabilitiesKHR(
      device,
      this.surface,
      details.capabilities
    );

    const formatCount: VkInout = { $: 0 };
    vkGetPhysicalDeviceSurfaceFormatsKHR(
      device,
      this.surface,
      formatCount,
      null
    );
    if (formatCount.$ !== 0) {
      details.formats = new Array(Number(formatCount.$))
        .fill(null)
        .map(() => new VkSurfaceFormatKHR());
      vkGetPhysicalDeviceSurfaceFormatsKHR(
        device,
        this.surface,
        formatCount,
        details.formats
      );
    }

    const presentModeCount: VkInout = { $: 0 };
    vkGetPhysicalDeviceSurfacePresentModesKHR(
      device,
      this.surface,
      presentModeCount,
      null
    );
    if (presentModeCount.$ !== 0) {
      details.presentModes = new Int32Array(Number(presentModeCount.$));
      vkGetPhysicalDeviceSurfacePresentModesKHR(
        device,
        this.surface,
        presentModeCount,
        details.presentModes
      );
    }

    return details;
  }

  createLogicalDevice() {
    const indices = this.findQueueFamilies(this.physicalDevice);

    const queueCreateInfos: VkDeviceQueueCreateInfo[] = [];
    const uniqueQueueFamilies = new Set([
      indices.graphicsFamily!,
      indices.presentFamily!,
    ]);

    const queuePriority = 1.0;
    for (const queueFamily of uniqueQueueFamilies) {
      const queueCreateInfo = new VkDeviceQueueCreateInfo();
      queueCreateInfo.sType = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
      queueCreateInfo.queueFamilyIndex = queueFamily;
      queueCreateInfo.queueCount = 1;
      const floatArray = new Float32Array([queuePriority]);
      queueCreateInfo.pQueuePriorities = floatArray;
      queueCreateInfos.push(queueCreateInfo);
    }

    const deviceFeatures = new VkPhysicalDeviceFeatures();

    const createInfo = new VkDeviceCreateInfo();
    createInfo.sType = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
    createInfo.pQueueCreateInfos = queueCreateInfos;
    createInfo.queueCreateInfoCount = queueCreateInfos.length;
    createInfo.pEnabledFeatures = deviceFeatures;
    createInfo.enabledExtensionCount = this.deviceExtensions.length;
    createInfo.ppEnabledExtensionNames = this.deviceExtensions;

    if (ENABLE_VALIDATION_LAYERS) {
      createInfo.enabledLayerCount = this.validationLayers.length;
      createInfo.ppEnabledLayerNames = this.validationLayers;
    } else {
      createInfo.enabledLayerCount = 0;
    }

    if (
      vkCreateDevice(this.physicalDevice, createInfo, null, this.device) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to create logical device");
    }

    vkGetDeviceQueue(
      this.device,
      indices.graphicsFamily!,
      0,
      this.graphicsQueue
    );

    vkGetDeviceQueue(this.device, indices.presentFamily!, 0, this.presentQueue);
  }

  createSurface() {
    if (
      this.win.createSurface(this.instance, null, this.surface) !== VK_SUCCESS
    ) {
      throw new Error("Failed to create window surface");
    }
  }

  createSwapChain() {
    const swapChainSupport = this.querySwapChainSupport(this.physicalDevice);

    const surfaceFormat = this.chooseSwapSurfaceFormat(
      swapChainSupport.formats
    );

    if (!surfaceFormat) {
      throw new Error("Failed to fetch surface format");
    }

    const presentMode = this.chooseSwapPresentMode(
      swapChainSupport.presentModes
    );
    const extent = this.chooseSwapExtent(swapChainSupport.capabilities);

    let imageCount = swapChainSupport.capabilities.minImageCount + 1;
    if (
      swapChainSupport.capabilities.maxImageCount > 0 &&
      imageCount > swapChainSupport.capabilities.maxImageCount
    ) {
      imageCount = swapChainSupport.capabilities.maxImageCount;
    }

    const createInfo = new VkSwapchainCreateInfoKHR();
    createInfo.sType = VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR;
    createInfo.surface = this.surface;
    createInfo.minImageCount = imageCount;
    createInfo.imageFormat = surfaceFormat?.format;
    createInfo.imageColorSpace = surfaceFormat?.colorSpace;
    createInfo.imageExtent = extent;
    createInfo.imageArrayLayers = 1;
    createInfo.imageUsage = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT;

    const indices = this.findQueueFamilies(this.physicalDevice);
    if (indices.graphicsFamily !== indices.presentFamily) {
      createInfo.imageSharingMode = VK_SHARING_MODE_CONCURRENT;
      createInfo.queueFamilyIndexCount = 2;
      createInfo.pQueueFamilyIndices = new Uint32Array([
        indices.graphicsFamily!,
        indices.presentFamily!,
      ]);
    } else {
      createInfo.imageSharingMode = VK_SHARING_MODE_EXCLUSIVE;
      createInfo.queueFamilyIndexCount = 0;
      createInfo.pQueueFamilyIndices = null;
    }

    createInfo.preTransform = swapChainSupport.capabilities.currentTransform;
    createInfo.compositeAlpha = VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR;
    createInfo.presentMode = presentMode;
    createInfo.clipped = true;
    createInfo.oldSwapchain = null;

    if (
      vkCreateSwapchainKHR(this.device, createInfo, null, this.swapChain) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to create swap chain");
    }

    const imageCount2: VkInout = { $: 0 };
    vkGetSwapchainImagesKHR(this.device, this.swapChain, imageCount2, null);
    this.swapChainImages = new Array(Number(imageCount2.$))
      .fill(null)
      .map(() => new VkImage());
    vkGetSwapchainImagesKHR(
      this.device,
      this.swapChain,
      imageCount2,
      this.swapChainImages
    );
    this.swapChainImageFormat = surfaceFormat?.format;
    this.swapChainExtent = extent;
  }

  chooseSwapSurfaceFormat(availableFormats: VkSurfaceFormatKHR[]) {
    if (!availableFormats.length) return null;
    for (const availableFormat of availableFormats) {
      if (
        availableFormat.format === VK_FORMAT_B8G8R8A8_SRGB &&
        availableFormat.colorSpace === VK_COLOR_SPACE_SRGB_NONLINEAR_KHR
      ) {
        return availableFormat;
      }
    }
    return availableFormats[0];
  }

  chooseSwapPresentMode(availablePresentModes: Int32Array) {
    for (const availablePresentMode of availablePresentModes) {
      if (availablePresentMode === VK_PRESENT_MODE_MAILBOX_KHR) {
        return availablePresentMode;
      }
    }
    return VK_PRESENT_MODE_FIFO_KHR;
  }

  chooseSwapExtent(capabilities: VkSurfaceCapabilitiesKHR) {
    if (capabilities.currentExtent?.width !== Number.MAX_SAFE_INTEGER) {
      return capabilities.currentExtent;
    }

    const width = this.win.frameBufferWidth;
    const height = this.win.frameBufferHeight;

    const actualExtent = new VkExtent2D();
    actualExtent.width = clamp(
      width,
      capabilities.minImageExtent?.width || 0,
      capabilities.maxImageExtent?.width || 0
    );
    actualExtent.height = clamp(
      height,
      capabilities.minImageExtent?.height || 0,
      capabilities.maxImageExtent?.height || 0
    );

    return actualExtent;
  }

  createImageViews() {
    this.swapChainImageViews = new Array(this.swapChainImages.length)
      .fill(null)
      .map(() => new VkImageView());

    for (let i = 0; i < this.swapChainImageViews.length; ++i) {
      const createInfo = new VkImageViewCreateInfo();
      createInfo.sType = VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO;
      createInfo.image = this.swapChainImages[i];
      createInfo.viewType = VK_IMAGE_VIEW_TYPE_2D;
      createInfo.format = this.swapChainImageFormat!;
      createInfo.components = new VkComponentMapping({
        r: VK_COMPONENT_SWIZZLE_IDENTITY,
        g: VK_COMPONENT_SWIZZLE_IDENTITY,
        b: VK_COMPONENT_SWIZZLE_IDENTITY,
        a: VK_COMPONENT_SWIZZLE_IDENTITY,
      });
      createInfo.subresourceRange = new VkImageSubresourceRange({
        aspectMask: VK_IMAGE_ASPECT_COLOR_BIT,
        baseMipLevel: 0,
        levelCount: 1,
        baseArrayLayer: 0,
        layerCount: 1,
      });

      vkCreateImageView(
        this.device,
        createInfo,
        null,
        this.swapChainImageViews[i]
      );
    }
  }

  createRenderPass() {
    const colorAttachment = new VkAttachmentDescription();
    colorAttachment.format = this.swapChainImageFormat!;
    colorAttachment.samples = VK_SAMPLE_COUNT_1_BIT;
    colorAttachment.loadOp = VK_ATTACHMENT_LOAD_OP_CLEAR;
    colorAttachment.storeOp = VK_ATTACHMENT_STORE_OP_STORE;
    colorAttachment.stencilLoadOp = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
    colorAttachment.stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
    colorAttachment.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;
    colorAttachment.finalLayout = VK_IMAGE_LAYOUT_PRESENT_SRC_KHR;

    const colorAttachmentRef = new VkAttachmentReference();
    colorAttachmentRef.attachment = 0;
    colorAttachmentRef.layout = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;

    const subpass = new VkSubpassDescription();
    subpass.pipelineBindPoint = VK_PIPELINE_BIND_POINT_GRAPHICS;
    subpass.colorAttachmentCount = 1;
    subpass.pColorAttachments = [colorAttachmentRef];

    const renderPassInfo = new VkRenderPassCreateInfo();
    renderPassInfo.sType = VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO;
    renderPassInfo.attachmentCount = 1;
    renderPassInfo.pAttachments = [colorAttachment];
    renderPassInfo.subpassCount = 1;
    renderPassInfo.pSubpasses = [subpass];

    const dependency = new VkSubpassDependency();
    dependency.srcSubpass = VK_SUBPASS_EXTERNAL;
    dependency.dstSubpass = 0;
    dependency.srcStageMask = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
    dependency.srcAccessMask = 0;
    dependency.dstStageMask = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
    dependency.dstAccessMask = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;

    renderPassInfo.dependencyCount = 1;
    renderPassInfo.pDependencies = [dependency];

    if (
      vkCreateRenderPass(this.device, renderPassInfo, null, this.renderPass) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to create render pass");
    }
  }

  createGraphicsPipeline() {
    const vertShaderCode = readBinaryFile("./bin/shaders/vert.spv");
    const fragShaderCode = readBinaryFile("./bin/shaders/frag.spv");

    const vertShaderModule = this.createShaderModule(vertShaderCode);
    const fragShaderModule = this.createShaderModule(fragShaderCode);

    const vertShaderStageInfo = new VkPipelineShaderStageCreateInfo();
    vertShaderStageInfo.sType =
      VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    vertShaderStageInfo.stage = VK_SHADER_STAGE_VERTEX_BIT;
    vertShaderStageInfo.module = vertShaderModule;
    vertShaderStageInfo.pName = "main";

    const fragShaderStageInfo = new VkPipelineShaderStageCreateInfo();
    fragShaderStageInfo.sType =
      VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    fragShaderStageInfo.stage = VK_SHADER_STAGE_FRAGMENT_BIT;
    fragShaderStageInfo.module = fragShaderModule;
    fragShaderStageInfo.pName = "main";

    const shaderStages = [vertShaderStageInfo, fragShaderStageInfo];

    const bindingDescription = Vertex.getBindingDescription();
    const attributeDescriptions = Vertex.getAttributeDescription();

    const vertexInputInfo = new VkPipelineVertexInputStateCreateInfo();
    vertexInputInfo.sType =
      VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
    vertexInputInfo.vertexBindingDescriptionCount = 1;
    vertexInputInfo.pVertexBindingDescriptions = [bindingDescription];
    vertexInputInfo.vertexAttributeDescriptionCount =
      attributeDescriptions.length;
    vertexInputInfo.pVertexAttributeDescriptions = attributeDescriptions;

    const inputAssembly = new VkPipelineInputAssemblyStateCreateInfo();
    inputAssembly.sType =
      VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO;
    inputAssembly.topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;
    inputAssembly.primitiveRestartEnable = false;

    const viewport = new VkViewport();
    viewport.x = 0;
    viewport.y = 0;
    viewport.width = this.swapChainExtent?.width || 0;
    viewport.height = this.swapChainExtent?.height || 0;
    viewport.minDepth = 0.0;
    viewport.maxDepth = 1.0;

    const scissor = new VkRect2D();
    scissor.offset = new VkOffset2D({
      x: 0,
      y: 0,
    });
    scissor.extent = this.swapChainExtent;

    const dynamicStates = new Int32Array([
      VK_DYNAMIC_STATE_VIEWPORT,
      VK_DYNAMIC_STATE_SCISSOR,
    ]);
    const dynamicState = new VkPipelineDynamicStateCreateInfo();
    dynamicState.sType = VK_STRUCTURE_TYPE_PIPELINE_DYNAMIC_STATE_CREATE_INFO;
    dynamicState.dynamicStateCount = dynamicStates.length;
    dynamicState.pDynamicStates = dynamicStates;

    const viewportState = new VkPipelineViewportStateCreateInfo();
    viewportState.sType = VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO;
    viewportState.viewportCount = 1;
    viewportState.scissorCount = 1;

    const rasterizer = new VkPipelineRasterizationStateCreateInfo();
    rasterizer.sType =
      VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO;
    rasterizer.depthClampEnable = false;
    rasterizer.rasterizerDiscardEnable = false;
    rasterizer.polygonMode = VK_POLYGON_MODE_FILL;
    rasterizer.lineWidth = 1.0;
    rasterizer.cullMode = VK_CULL_MODE_NONE;
    rasterizer.frontFace = VK_FRONT_FACE_COUNTER_CLOCKWISE;
    rasterizer.depthBiasEnable = false;
    rasterizer.depthBiasConstantFactor = 0.0;
    rasterizer.depthBiasClamp = 0.0;
    rasterizer.depthBiasSlopeFactor = 0.0;

    const multisampling = new VkPipelineMultisampleStateCreateInfo();
    multisampling.sType =
      VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO;
    multisampling.sampleShadingEnable = false;
    multisampling.rasterizationSamples = VK_SAMPLE_COUNT_1_BIT;
    multisampling.minSampleShading = 1.0;
    multisampling.pSampleMask = null;
    multisampling.alphaToCoverageEnable = false;
    multisampling.alphaToOneEnable = false;

    const colorBlendAttachments = new VkPipelineColorBlendAttachmentState();
    colorBlendAttachments.colorWriteMask =
      VK_COLOR_COMPONENT_R_BIT |
      VK_COLOR_COMPONENT_G_BIT |
      VK_COLOR_COMPONENT_B_BIT |
      VK_COLOR_COMPONENT_A_BIT;
    colorBlendAttachments.blendEnable = false;
    colorBlendAttachments.srcColorBlendFactor = VK_BLEND_FACTOR_ONE;
    colorBlendAttachments.dstColorBlendFactor = VK_BLEND_FACTOR_ZERO;
    colorBlendAttachments.colorBlendOp = VK_BLEND_OP_ADD;
    colorBlendAttachments.srcAlphaBlendFactor = VK_BLEND_FACTOR_ONE;
    colorBlendAttachments.dstAlphaBlendFactor = VK_BLEND_FACTOR_ZERO;
    colorBlendAttachments.alphaBlendOp = VK_BLEND_OP_ADD;

    const colorBlending = new VkPipelineColorBlendStateCreateInfo();
    colorBlending.sType =
      VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO;
    colorBlending.logicOpEnable = false;
    colorBlending.logicOp = VK_LOGIC_OP_COPY;
    colorBlending.attachmentCount = 1;
    colorBlending.pAttachments = [colorBlendAttachments];
    colorBlending.blendConstants = [0.0, 0.0, 0.0, 0.0];

    const pipelineLayoutInfo = new VkPipelineLayoutCreateInfo();
    pipelineLayoutInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO;
    pipelineLayoutInfo.setLayoutCount = 1;
    pipelineLayoutInfo.pSetLayouts = [this.descriptorSetLayout];
    pipelineLayoutInfo.pushConstantRangeCount = 0;
    pipelineLayoutInfo.pPushConstantRanges = null;

    try {
      if (
        vkCreatePipelineLayout(
          this.device,
          pipelineLayoutInfo,
          null,
          this.pipelineLayout
        ) !== VK_SUCCESS
      ) {
        throw new Error("Failed to create pipeline layout");
      }

      const pipelineInfo = new VkGraphicsPipelineCreateInfo();
      pipelineInfo.sType = VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO;
      pipelineInfo.stageCount = 2;
      pipelineInfo.pStages = shaderStages;
      pipelineInfo.pVertexInputState = vertexInputInfo;
      pipelineInfo.pInputAssemblyState = inputAssembly;
      pipelineInfo.pViewportState = viewportState;
      pipelineInfo.pRasterizationState = rasterizer;
      pipelineInfo.pMultisampleState = multisampling;
      pipelineInfo.pDepthStencilState = null;
      pipelineInfo.pColorBlendState = colorBlending;
      pipelineInfo.pDynamicState = dynamicState;
      pipelineInfo.layout = this.pipelineLayout;
      pipelineInfo.renderPass = this.renderPass;
      pipelineInfo.subpass = 0;
      pipelineInfo.basePipelineHandle = null;
      pipelineInfo.basePipelineIndex = -1;

      if (
        vkCreateGraphicsPipelines(this.device, null, 1, [pipelineInfo], null, [
          this.graphicsPipeline,
        ]) !== VK_SUCCESS
      ) {
        throw new Error("Failed to create graphics pipeline");
      }
    } finally {
      vkDestroyShaderModule(this.device, vertShaderModule, null);
      vkDestroyShaderModule(this.device, fragShaderModule, null);
    }
  }

  createShaderModule(code: Uint8Array) {
    const createInfo = new VkShaderModuleCreateInfo();
    createInfo.sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
    createInfo.codeSize = code.byteLength;
    createInfo.pCode = code;

    const shaderModule = new VkShaderModule();
    if (
      vkCreateShaderModule(this.device, createInfo, null, shaderModule) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to create shader module");
    }

    return shaderModule;
  }

  createFramebuffers() {
    this.swapChainFramebuffers = new Array(this.swapChainImageViews.length)
      .fill(null)
      .map(() => new VkFramebuffer());

    for (let i = 0; i < this.swapChainImageViews.length; ++i) {
      const attachments = [this.swapChainImageViews[i]];

      const framebufferInfo = new VkFramebufferCreateInfo();
      framebufferInfo.sType = VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO;
      framebufferInfo.renderPass = this.renderPass;
      framebufferInfo.attachmentCount = 1;
      framebufferInfo.pAttachments = attachments;
      framebufferInfo.width = this.swapChainExtent?.width!;
      framebufferInfo.height = this.swapChainExtent?.height!;
      framebufferInfo.layers = 1;

      if (
        vkCreateFramebuffer(
          this.device,
          framebufferInfo,
          null,
          this.swapChainFramebuffers[i]
        ) !== VK_SUCCESS
      ) {
        throw new Error("Failed to create framebuffer");
      }
    }
  }

  createCommandPool() {
    const queueFamilyIndices = this.findQueueFamilies(this.physicalDevice);

    const poolInfo = new VkCommandPoolCreateInfo();
    poolInfo.sType = VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO;
    poolInfo.flags = VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT;
    poolInfo.queueFamilyIndex = queueFamilyIndices.graphicsFamily!;

    if (
      vkCreateCommandPool(this.device, poolInfo, null, this.commandPool) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to create command pool");
    }
  }

  createCommandBuffers() {
    this.commandBuffers = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkCommandBuffer());

    const allocInfo = new VkCommandBufferAllocateInfo();
    allocInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO;
    allocInfo.commandPool = this.commandPool;
    allocInfo.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    allocInfo.commandBufferCount = this.commandBuffers.length;

    if (
      vkAllocateCommandBuffers(this.device, allocInfo, this.commandBuffers) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to allocate command buffers");
    }
  }

  createSyncObjects() {
    this.imageAvailableSemaphores = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkSemaphore());
    this.renderFinishedSemaphores = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkSemaphore());
    this.inFlightFences = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkFence());

    const semaphoreInfo = new VkSemaphoreCreateInfo();
    semaphoreInfo.sType = VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO;

    const fenceInfo = new VkFenceCreateInfo();
    fenceInfo.sType = VK_STRUCTURE_TYPE_FENCE_CREATE_INFO;
    fenceInfo.flags = VK_FENCE_CREATE_SIGNALED_BIT;

    for (let i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
      if (
        vkCreateSemaphore(
          this.device,
          semaphoreInfo,
          null,
          this.imageAvailableSemaphores[i]
        ) !== VK_SUCCESS ||
        vkCreateSemaphore(
          this.device,
          semaphoreInfo,
          null,
          this.renderFinishedSemaphores[i]
        ) !== VK_SUCCESS ||
        vkCreateFence(this.device, fenceInfo, null, this.inFlightFences[i]) !==
          VK_SUCCESS
      ) {
        throw new Error("Failed to create semaphores");
      }
    }
  }

  recordCommandBuffer(commandBuffer: VkCommandBuffer, imageIndex: number) {
    const beginInfo = new VkCommandBufferBeginInfo();
    beginInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
    beginInfo.flags = 0;
    beginInfo.pInheritanceInfo = null;

    if (vkBeginCommandBuffer(commandBuffer, beginInfo) !== VK_SUCCESS) {
      throw new Error("Failed to begin recording command buffer");
    }

    const renderPassInfo = new VkRenderPassBeginInfo();
    renderPassInfo.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    renderPassInfo.renderPass = this.renderPass;
    renderPassInfo.framebuffer = this.swapChainFramebuffers[imageIndex];
    renderPassInfo.renderArea = new VkRect2D({
      offset: new VkOffset2D({ x: 0, y: 0 }),
      extent: this.swapChainExtent,
    });

    const clearColor = new VkClearValue();
    clearColor.color = new VkClearColorValue({
      float32: [0.0, 0.0, 0.0, 1.0],
    });

    renderPassInfo.clearValueCount = 1;
    renderPassInfo.pClearValues = [clearColor];

    vkCmdBeginRenderPass(
      commandBuffer,
      renderPassInfo,
      VK_SUBPASS_CONTENTS_INLINE
    );

    vkCmdBindPipeline(
      commandBuffer,
      VK_PIPELINE_BIND_POINT_GRAPHICS,
      this.graphicsPipeline
    );

    const offsets = new BigUint64Array([0n]);
    vkCmdBindVertexBuffers(
      commandBuffer,
      0,
      1,
      [this.vertexBuffer],
      offsets as any
    );
    vkCmdBindIndexBuffer(
      commandBuffer,
      this.indexBuffer,
      0,
      VK_INDEX_TYPE_UINT16
    );

    const viewport = new VkViewport();
    viewport.x = 0.0;
    viewport.y = 0.0;
    viewport.width = this.swapChainExtent?.width!;
    viewport.height = this.swapChainExtent?.height!;
    viewport.minDepth = 0.0;
    viewport.maxDepth = 1.0;
    vkCmdSetViewport(commandBuffer, 0, 1, [viewport]);

    const scissor = new VkRect2D();
    scissor.offset = new VkOffset2D({ x: 0, y: 0 });
    scissor.extent = this.swapChainExtent;
    vkCmdSetScissor(commandBuffer, 0, 1, [scissor]);

    vkCmdBindDescriptorSets(
      commandBuffer,
      VK_PIPELINE_BIND_POINT_GRAPHICS,
      this.pipelineLayout,
      0,
      1,
      [this.descriptorSets[this.currentFrame]],
      0,
      null
    );

    vkCmdDrawIndexed(commandBuffer, rawIndicies.length, 1, 0, 0, 0);

    vkCmdEndRenderPass(commandBuffer);

    if (vkEndCommandBuffer(commandBuffer) !== VK_SUCCESS) {
      throw new Error("Failed to record command buffer");
    }
  }

  drawFrame() {
    vkWaitForFences(
      this.device,
      1,
      [this.inFlightFences[this.currentFrame]],
      true,
      Number.MAX_VALUE
    );

    const imageIndex: VkInout = { $: 0 };
    let result = vkAcquireNextImageKHR(
      this.device,
      this.swapChain,
      Number.MAX_VALUE,
      this.imageAvailableSemaphores[this.currentFrame],
      null,
      imageIndex
    );

    if (result === VK_ERROR_OUT_OF_DATE_KHR) {
      this.recreateSwapChain();
      return;
    } else if (result !== VK_SUCCESS && result !== VK_SUBOPTIMAL_KHR) {
      throw new Error("Failed to acquire swapchain image");
    }

    vkResetFences(this.device, 1, [this.inFlightFences[this.currentFrame]]);

    vkResetCommandBuffer(this.commandBuffers[this.currentFrame], 0);
    this.recordCommandBuffer(
      this.commandBuffers[this.currentFrame],
      Number(imageIndex.$)
    );

    this.updateUniformBuffer(this.currentFrame);

    const submitInfo = new VkSubmitInfo();
    submitInfo.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;

    const waitSemaphores = [this.imageAvailableSemaphores[this.currentFrame]];
    const waitStages = new Int32Array([
      VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
    ]);
    submitInfo.waitSemaphoreCount = 1;
    submitInfo.pWaitSemaphores = waitSemaphores;
    submitInfo.pWaitDstStageMask = waitStages;
    submitInfo.commandBufferCount = 1;
    submitInfo.pCommandBuffers = [this.commandBuffers[this.currentFrame]];

    const signalSemaphores = [this.renderFinishedSemaphores[this.currentFrame]];
    submitInfo.signalSemaphoreCount = 1;
    submitInfo.pSignalSemaphores = signalSemaphores;

    if (
      vkQueueSubmit(
        this.graphicsQueue,
        1,
        [submitInfo],
        this.inFlightFences[this.currentFrame]
      ) !== VK_SUCCESS
    ) {
      throw new Error("Failed to submit draw command buffer");
    }

    const presentInfo = new VkPresentInfoKHR();
    presentInfo.sType = VK_STRUCTURE_TYPE_PRESENT_INFO_KHR;
    presentInfo.waitSemaphoreCount = 1;
    presentInfo.pWaitSemaphores = signalSemaphores;
    const swapChains = [this.swapChain];
    presentInfo.swapchainCount = 1;
    presentInfo.pSwapchains = swapChains;
    presentInfo.pImageIndices = new Uint32Array([Number(imageIndex.$)]);
    presentInfo.pResults = null;

    result = vkQueuePresentKHR(this.presentQueue, presentInfo);

    if (
      result === VK_ERROR_OUT_OF_DATE_KHR ||
      result === VK_SUBOPTIMAL_KHR ||
      this.framebufferResized
    ) {
      this.framebufferResized = false;
      this.recreateSwapChain();
    } else if (result !== VK_SUCCESS) {
      throw new Error("Failed to present swapchain image");
    }

    this.currentFrame = (this.currentFrame + 1) % MAX_FRAMES_IN_FLIGHT;
  }

  cleanupSwapChain() {
    for (const framebuffer of this.swapChainFramebuffers) {
      vkDestroyFramebuffer(this.device, framebuffer, null);
    }
    for (const imageView of this.swapChainImageViews) {
      vkDestroyImageView(this.device, imageView, null);
    }
    vkDestroySwapchainKHR(this.device, this.swapChain, null);
  }

  recreateSwapChain() {
    vkDeviceWaitIdle(this.device);

    this.cleanupSwapChain();

    this.createSwapChain();
    this.createImageViews();
    this.createFramebuffers();
  }

  createVertexBuffer() {
    const bufferSize = rawVertices.byteLength;

    const stagingBuffer = new VkBuffer();
    const stagingBufferMemory = new VkDeviceMemory();

    this.createBuffer(
      bufferSize,
      VK_BUFFER_USAGE_TRANSFER_SRC_BIT,
      VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT |
        VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
      stagingBuffer,
      stagingBufferMemory
    );

    const data: VkInoutAddress = { $: 0n };

    vkMapMemory(this.device, stagingBufferMemory, 0, bufferSize, 0, data);
    memcpy(data.$, rawVertices, bufferSize);
    vkUnmapMemory(this.device, stagingBufferMemory);

    this.createBuffer(
      bufferSize,
      VK_BUFFER_USAGE_TRANSFER_DST_BIT | VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
      VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT,
      this.vertexBuffer,
      this.vertexBufferMemory
    );

    this.copyBuffer(stagingBuffer, this.vertexBuffer, bufferSize);

    vkDestroyBuffer(this.device, stagingBuffer, null);
    vkFreeMemory(this.device, stagingBufferMemory, null);
  }

  copyBuffer(srcBuffer: VkBuffer, dstBuffer: VkBuffer, size: number) {
    const allocInfo = new VkCommandBufferAllocateInfo();
    allocInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO;
    allocInfo.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    allocInfo.commandPool = this.commandPool;
    allocInfo.commandBufferCount = 1;

    const commandBuffer = new VkCommandBuffer();
    vkAllocateCommandBuffers(this.device, allocInfo, [commandBuffer]);

    const beginInfo = new VkCommandBufferBeginInfo();
    beginInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;

    vkBeginCommandBuffer(commandBuffer, beginInfo);

    const copyRegion = new VkBufferCopy();
    copyRegion.srcOffset = 0;
    copyRegion.dstOffset = 0;
    copyRegion.size = size;
    vkCmdCopyBuffer(commandBuffer, srcBuffer, dstBuffer, 1, [copyRegion]);
    vkEndCommandBuffer(commandBuffer);

    const submitInfo = new VkSubmitInfo();
    submitInfo.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;
    submitInfo.commandBufferCount = 1;
    submitInfo.pCommandBuffers = [commandBuffer];

    vkQueueSubmit(this.graphicsQueue, 1, [submitInfo], null);
    vkQueueWaitIdle(this.graphicsQueue);

    vkFreeCommandBuffers(this.device, this.commandPool, 1, [commandBuffer]);
  }

  createIndexBuffer() {
    const bufferSize = rawIndicies.byteLength;

    const stagingBuffer = new VkBuffer();
    const stagingBufferMemory = new VkDeviceMemory();

    this.createBuffer(
      bufferSize,
      VK_BUFFER_USAGE_TRANSFER_SRC_BIT,
      VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT |
        VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
      stagingBuffer,
      stagingBufferMemory
    );

    const data: VkInoutAddress = { $: 0n };

    vkMapMemory(this.device, stagingBufferMemory, 0, bufferSize, 0, data);
    memcpy(data.$, rawIndicies, bufferSize);
    vkUnmapMemory(this.device, stagingBufferMemory);

    this.createBuffer(
      bufferSize,
      VK_BUFFER_USAGE_TRANSFER_DST_BIT | VK_BUFFER_USAGE_INDEX_BUFFER_BIT,
      VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT,
      this.indexBuffer,
      this.indexBufferMemory
    );

    this.copyBuffer(stagingBuffer, this.indexBuffer, bufferSize);

    vkDestroyBuffer(this.device, stagingBuffer, null);
    vkFreeMemory(this.device, stagingBufferMemory, null);
  }

  createBuffer(
    size: number,
    usage: number,
    properties: VkMemoryPropertyFlagBits,
    buffer: VkBuffer,
    bufferMemory: VkDeviceMemory
  ) {
    const bufferInfo = new VkBufferCreateInfo();
    bufferInfo.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
    bufferInfo.size = size;
    bufferInfo.usage = usage;
    bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE;

    if (vkCreateBuffer(this.device, bufferInfo, null, buffer) !== VK_SUCCESS) {
      throw new Error("Failed to create buffer");
    }

    const memRequirements = new VkMemoryRequirements();
    vkGetBufferMemoryRequirements(this.device, buffer, memRequirements);

    const allocInfo = new VkMemoryAllocateInfo();
    allocInfo.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
    allocInfo.allocationSize = memRequirements.size;
    allocInfo.memoryTypeIndex = this.findMemoryType(
      memRequirements.memoryTypeBits,
      properties
    );

    if (
      vkAllocateMemory(this.device, allocInfo, null, bufferMemory) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to allocate vertex buffer memory");
    }

    vkBindBufferMemory(this.device, buffer, bufferMemory, 0);
  }

  findMemoryType(typeFilter: number, properties: VkMemoryPropertyFlagBits) {
    const memProperties = new VkPhysicalDeviceMemoryProperties();
    vkGetPhysicalDeviceMemoryProperties(this.physicalDevice, memProperties);

    for (let i = 0; i < memProperties.memoryTypeCount; ++i) {
      if (!memProperties.memoryTypes) continue;
      if (
        typeFilter & (1 << i) &&
        (memProperties.memoryTypes[i].propertyFlags & properties) === properties
      ) {
        return i;
      }
    }

    throw new Error("Failed to find suitable memory type");
  }

  createDescriptorSetLayout() {
    const uboLayoutBinding = new VkDescriptorSetLayoutBinding();
    uboLayoutBinding.binding = 0;
    uboLayoutBinding.descriptorType = VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER;
    uboLayoutBinding.descriptorCount = 1;
    uboLayoutBinding.stageFlags = VK_SHADER_STAGE_VERTEX_BIT;
    uboLayoutBinding.pImmutableSamplers = null;

    const layoutInfo = new VkDescriptorSetLayoutCreateInfo();
    layoutInfo.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO;
    layoutInfo.bindingCount = 1;
    layoutInfo.pBindings = [uboLayoutBinding];

    if (
      vkCreateDescriptorSetLayout(
        this.device,
        layoutInfo,
        null,
        this.descriptorSetLayout
      ) !== VK_SUCCESS
    ) {
      throw new Error("Failed to create descriptor set layout");
    }
  }

  createUniformBuffers() {
    const bufferSize = UniformBufferObject.byteLength();

    this.uniformBuffers = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkBuffer());
    this.uniformBuffersMemory = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkDeviceMemory());

    for (let i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
      this.createBuffer(
        bufferSize,
        VK_BUFFER_USAGE_UNIFORM_BUFFER_BIT,
        VK_MEMORY_PROPERTY_HOST_COHERENT_BIT |
          VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT,
        this.uniformBuffers[i],
        this.uniformBuffersMemory[i]
      );
    }
  }

  updateUniformBuffer(currentImage: number) {
    const now = performance.now();
    const time = (now - START_TIME) / 1000;

    const ubo = new UniformBufferObject();
    mat4.rotate(
      ubo.model,
      mat4.create(),
      time * glMatrix.toRadian(90),
      vec3.fromValues(0, 0, 1)
    );
    mat4.lookAt(
      ubo.view,
      vec3.fromValues(2, 2, 2),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 1)
    );
    mat4.perspective(
      ubo.proj,
      glMatrix.toRadian(45),
      this.swapChainExtent!.width / this.swapChainExtent!.height,
      0.1,
      10
    );
    ubo.proj[5] *= -1;

    const buffer = UniformBufferObject.toFloatArray(ubo);

    const data: VkInoutAddress = { $: 0n };
    vkMapMemory(
      this.device,
      this.uniformBuffersMemory[currentImage],
      0,
      buffer.byteLength,
      0,
      data
    );
    memcpy(data.$, buffer, buffer.byteLength);
    vkUnmapMemory(this.device, this.uniformBuffersMemory[currentImage]);
  }

  createDescriptorPool() {
    const poolSize = new VkDescriptorPoolSize();
    poolSize.type = VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER;
    poolSize.descriptorCount = MAX_FRAMES_IN_FLIGHT;

    const poolInfo = new VkDescriptorPoolCreateInfo();
    poolInfo.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO;
    poolInfo.poolSizeCount = 1;
    poolInfo.pPoolSizes = [poolSize];
    poolInfo.maxSets = MAX_FRAMES_IN_FLIGHT;
    poolInfo.flags = 0;

    if (
      vkCreateDescriptorPool(
        this.device,
        poolInfo,
        null,
        this.descriptorPool
      ) !== VK_SUCCESS
    ) {
      throw new Error("Failed to create descriptor pool");
    }
  }

  createDescriptorSets() {
    const layouts = new Array(MAX_FRAMES_IN_FLIGHT).fill(
      this.descriptorSetLayout
    );
    const allocInfo = new VkDescriptorSetAllocateInfo();
    allocInfo.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO;
    allocInfo.descriptorPool = this.descriptorPool;
    allocInfo.descriptorSetCount = MAX_FRAMES_IN_FLIGHT;
    allocInfo.pSetLayouts = layouts;

    this.descriptorSets = new Array(MAX_FRAMES_IN_FLIGHT)
      .fill(null)
      .map(() => new VkDescriptorSet());

    if (
      vkAllocateDescriptorSets(this.device, allocInfo, this.descriptorSets) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to allocated descriptor sets");
    }

    for (let i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
      const bufferInfo = new VkDescriptorBufferInfo();
      bufferInfo.buffer = this.uniformBuffers[i];
      bufferInfo.offset = 0;
      bufferInfo.range = VK_WHOLE_SIZE;

      const descriptorWrite = new VkWriteDescriptorSet();
      descriptorWrite.sType = VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET;
      descriptorWrite.dstSet = this.descriptorSets[i];
      descriptorWrite.dstBinding = 0;
      descriptorWrite.dstArrayElement = 0;
      descriptorWrite.descriptorType = VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER;
      descriptorWrite.descriptorCount = 1;
      descriptorWrite.pBufferInfo = [bufferInfo];
      descriptorWrite.pImageInfo = null;
      descriptorWrite.pTexelBufferView = null;

      vkUpdateDescriptorSets(this.device, 1, [descriptorWrite], 0, null);
    }
  }
}
