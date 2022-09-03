import {
  vkAcquireNextImageKHR,
  vkAllocateCommandBuffers,
  VkApplicationInfo,
  VkAttachmentDescription,
  VkAttachmentReference,
  vkBeginCommandBuffer,
  VkClearColorValue,
  VkClearValue,
  vkCmdBeginRenderPass,
  vkCmdBindPipeline,
  vkCmdDraw,
  vkCmdEndRenderPass,
  vkCmdSetScissor,
  vkCmdSetViewport,
  VkCommandBuffer,
  VkCommandBufferAllocateInfo,
  VkCommandBufferBeginInfo,
  VkCommandPool,
  VkCommandPoolCreateInfo,
  VkComponentMapping,
  vkCreateCommandPool,
  vkCreateDebugUtilsMessengerEXT,
  vkCreateDevice,
  vkCreateFence,
  vkCreateFramebuffer,
  vkCreateGraphicsPipelines,
  vkCreateImageView,
  vkCreateInstance,
  vkCreatePipelineLayout,
  vkCreateRenderPass,
  vkCreateSemaphore,
  vkCreateShaderModule,
  vkCreateSwapchainKHR,
  VkDebugUtilsMessageSeverityFlagBitsEXT,
  VkDebugUtilsMessageTypeFlagBitsEXT,
  VkDebugUtilsMessengerCallbackDataEXT,
  VkDebugUtilsMessengerCreateInfoEXT,
  VkDebugUtilsMessengerEXT,
  vkDestroyCommandPool,
  vkDestroyDebugUtilsMessengerEXT,
  vkDestroyDevice,
  vkDestroyFence,
  vkDestroyFramebuffer,
  vkDestroyImageView,
  vkDestroyInstance,
  vkDestroyPipeline,
  vkDestroyPipelineLayout,
  vkDestroyRenderPass,
  vkDestroySemaphore,
  vkDestroyShaderModule,
  vkDestroySurfaceKHR,
  vkDestroySwapchainKHR,
  VkDevice,
  VkDeviceCreateInfo,
  VkDeviceQueueCreateInfo,
  vkDeviceWaitIdle,
  vkEndCommandBuffer,
  vkEnumerateDeviceExtensionProperties,
  vkEnumerateInstanceExtensionProperties,
  vkEnumerateInstanceLayerProperties,
  vkEnumeratePhysicalDevices,
  VkExtensionProperties,
  VkExtent2D,
  VkFence,
  VkFenceCreateInfo,
  VkFormat,
  VkFramebuffer,
  VkFramebufferCreateInfo,
  vkGetDeviceQueue,
  vkGetPhysicalDeviceFeatures,
  vkGetPhysicalDeviceProperties,
  vkGetPhysicalDeviceQueueFamilyProperties,
  vkGetPhysicalDeviceSurfaceCapabilitiesKHR,
  vkGetPhysicalDeviceSurfaceFormatsKHR,
  vkGetPhysicalDeviceSurfacePresentModesKHR,
  vkGetPhysicalDeviceSurfaceSupportKHR,
  vkGetSwapchainImagesKHR,
  VkGraphicsPipelineCreateInfo,
  VkImage,
  VkImageSubresourceRange,
  VkImageView,
  VkImageViewCreateInfo,
  VkInout,
  VkInstance,
  VkInstanceCreateInfo,
  VkLayerProperties,
  VkOffset2D,
  VkPhysicalDevice,
  VkPhysicalDeviceFeatures,
  VkPhysicalDeviceProperties,
  VkPipeline,
  VkPipelineColorBlendAttachmentState,
  VkPipelineColorBlendStateCreateInfo,
  VkPipelineDynamicStateCreateInfo,
  VkPipelineInputAssemblyStateCreateInfo,
  VkPipelineLayout,
  VkPipelineLayoutCreateInfo,
  VkPipelineMultisampleStateCreateInfo,
  VkPipelineRasterizationStateCreateInfo,
  VkPipelineShaderStageCreateInfo,
  VkPipelineVertexInputStateCreateInfo,
  VkPipelineViewportStateCreateInfo,
  VkPresentInfoKHR,
  VkQueue,
  VkQueueFamilyProperties,
  vkQueuePresentKHR,
  vkQueueSubmit,
  VkRect2D,
  VkRenderPass,
  VkRenderPassBeginInfo,
  VkRenderPassCreateInfo,
  vkResetCommandBuffer,
  vkResetFences,
  VkSemaphore,
  VkSemaphoreCreateInfo,
  VkShaderModule,
  VkShaderModuleCreateInfo,
  VkSubmitInfo,
  VkSubpassDependency,
  VkSubpassDescription,
  VkSurfaceCapabilitiesKHR,
  VkSurfaceFormatKHR,
  VkSurfaceKHR,
  VkSwapchainCreateInfoKHR,
  VkSwapchainKHR,
  VkViewport,
  vkWaitForFences,
  VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT,
  VK_API_VERSION_1_0,
  VK_ATTACHMENT_LOAD_OP_CLEAR,
  VK_ATTACHMENT_LOAD_OP_DONT_CARE,
  VK_ATTACHMENT_STORE_OP_DONT_CARE,
  VK_ATTACHMENT_STORE_OP_STORE,
  VK_BLEND_FACTOR_ONE,
  VK_BLEND_FACTOR_ZERO,
  VK_BLEND_OP_ADD,
  VK_COLOR_COMPONENT_A_BIT,
  VK_COLOR_COMPONENT_B_BIT,
  VK_COLOR_COMPONENT_G_BIT,
  VK_COLOR_COMPONENT_R_BIT,
  VK_COLOR_SPACE_SRGB_NONLINEAR_KHR,
  VK_COMMAND_BUFFER_LEVEL_PRIMARY,
  VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT,
  VK_COMPONENT_SWIZZLE_IDENTITY,
  VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR,
  VK_CULL_MODE_BACK_BIT,
  VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT,
  VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT,
  VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT,
  VK_DEBUG_UTILS_MESSAGE_TYPE_GENERAL_BIT_EXT,
  VK_DEBUG_UTILS_MESSAGE_TYPE_PERFORMANCE_BIT_EXT,
  VK_DEBUG_UTILS_MESSAGE_TYPE_VALIDATION_BIT_EXT,
  VK_DYNAMIC_STATE_SCISSOR,
  VK_DYNAMIC_STATE_VIEWPORT,
  VK_FENCE_CREATE_SIGNALED_BIT,
  VK_FORMAT_B8G8R8A8_SRGB,
  VK_FRONT_FACE_CLOCKWISE,
  VK_IMAGE_ASPECT_COLOR_BIT,
  VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL,
  VK_IMAGE_LAYOUT_PRESENT_SRC_KHR,
  VK_IMAGE_LAYOUT_UNDEFINED,
  VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT,
  VK_IMAGE_VIEW_TYPE_2D,
  VK_LOGIC_OP_COPY,
  VK_MAKE_VERSION,
  VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU,
  VK_PIPELINE_BIND_POINT_GRAPHICS,
  VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
  VK_POLYGON_MODE_FILL,
  VK_PRESENT_MODE_FIFO_KHR,
  VK_PRESENT_MODE_MAILBOX_KHR,
  VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
  VK_QUEUE_GRAPHICS_BIT,
  VK_SAMPLE_COUNT_1_BIT,
  VK_SHADER_STAGE_FRAGMENT_BIT,
  VK_SHADER_STAGE_VERTEX_BIT,
  VK_SHARING_MODE_CONCURRENT,
  VK_SHARING_MODE_EXCLUSIVE,
  VK_STRUCTURE_TYPE_APPLICATION_INFO,
  VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO,
  VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO,
  VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO,
  VK_STRUCTURE_TYPE_DEBUG_UTILS_MESSENGER_CREATE_INFO_EXT,
  VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO,
  VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO,
  VK_STRUCTURE_TYPE_FENCE_CREATE_INFO,
  VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO,
  VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO,
  VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO,
  VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_DYNAMIC_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO,
  VK_STRUCTURE_TYPE_PRESENT_INFO_KHR,
  VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO,
  VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO,
  VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO,
  VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO,
  VK_STRUCTURE_TYPE_SUBMIT_INFO,
  VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR,
  VK_SUBPASS_CONTENTS_INLINE,
  VK_SUBPASS_EXTERNAL,
  VK_SUCCESS,
  VulkanWindow,
} from "nvk/generated/1.1.126/linux";
import { clamp } from "./math";
import { readBinaryFile } from "./util";

const enableValidationLayers = Boolean(
  parseInt(process.env.ENABLE_VALIDATION_LAYERS || "")
);

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

export default class Application {
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
  private physicalDevice?: VkPhysicalDevice;
  private device = new VkDevice();
  private graphicsQueue = new VkQueue();
  private presentQueue = new VkQueue();
  private swapChain = new VkSwapchainKHR();
  private swapChainImages: VkImage[] = [];
  private swapChainImageFormat?: VkFormat;
  private swapChainExtent: VkExtent2D | null = null;
  private swapChainImageViews: VkImageView[] = [];
  private renderPass = new VkRenderPass();
  private pipelineLayout = new VkPipelineLayout();
  private graphicsPipeline = new VkPipeline();
  private swapChainFramebuffers: VkFramebuffer[] = [];
  private commandPool = new VkCommandPool();
  private commandBuffer = new VkCommandBuffer();
  private imageAvailableSemaphore = new VkSemaphore();
  private renderFinishedSemaphore = new VkSemaphore();
  private inFlightFence = new VkFence();

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
    this.createGraphicsPipeline();
    this.createFramebuffers();
    this.createCommandPool();
    this.createCommandBuffer();
    this.createSyncObjects();
  }

  update() {
    while (!this.win.shouldClose()) {
      this.win.pollEvents();
      this.drawFrame();
    }
    vkDeviceWaitIdle(this.device);
  }

  cleanup() {
    if (enableValidationLayers) {
      vkDestroyDebugUtilsMessengerEXT(this.instance, this.debugMessenger, null);
    }
    vkDestroySemaphore(this.device, this.imageAvailableSemaphore, null);
    vkDestroySemaphore(this.device, this.renderFinishedSemaphore, null);
    vkDestroyFence(this.device, this.inFlightFence, null);
    vkDestroyCommandPool(this.device, this.commandPool, null);
    vkDestroyPipeline(this.device, this.graphicsPipeline, null);
    vkDestroyPipelineLayout(this.device, this.pipelineLayout, null);
    for (const framebuffer of this.swapChainFramebuffers) {
      vkDestroyFramebuffer(this.device, framebuffer, null);
    }
    vkDestroyRenderPass(this.device, this.renderPass, null);
    for (const imageView of this.swapChainImageViews) {
      vkDestroyImageView(this.device, imageView, null);
    }
    vkDestroySwapchainKHR(this.device, this.swapChain, null);
    vkDestroySurfaceKHR(this.instance, this.surface, null);
    vkDestroyDevice(this.device, null);
    vkDestroyInstance(this.instance, null);
    this.win.close();
  }

  createInstance() {
    if (enableValidationLayers && !this.checkValidationLayerSupport()) {
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

    if (enableValidationLayers) {
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
    if (enableValidationLayers) {
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
    createInfo.pfnUserCallback = Application.debugCallback;
    createInfo.pUserData = null;
    return createInfo;
  }

  setupDebugMessenger() {
    if (!enableValidationLayers) return;
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
    this.physicalDevice = devices.find((d) => this.isDeviceSuitable(d));
    if (!this.physicalDevice) {
      throw new Error("Failed to find a suitable GPU");
    }
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
    const indices = this.findQueueFamilies(this.physicalDevice!);

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

    if (enableValidationLayers) {
      createInfo.enabledLayerCount = this.validationLayers.length;
      createInfo.ppEnabledLayerNames = this.validationLayers;
    } else {
      createInfo.enabledLayerCount = 0;
    }

    if (
      vkCreateDevice(this.physicalDevice!, createInfo, null, this.device) !==
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
    const swapChainSupport = this.querySwapChainSupport(this.physicalDevice!);

    const surfaceFormat = this.chooseSwapSurfaceFormat(
      swapChainSupport.formats
    );
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
    createInfo.imageFormat = surfaceFormat.format;
    createInfo.imageColorSpace = surfaceFormat.colorSpace;
    createInfo.imageExtent = extent;
    createInfo.imageArrayLayers = 1;
    createInfo.imageUsage = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT;

    const indices = this.findQueueFamilies(this.physicalDevice!);
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
    this.swapChainImageFormat = surfaceFormat.format;
    this.swapChainExtent = extent;
  }

  chooseSwapSurfaceFormat(availableFormats: VkSurfaceFormatKHR[]) {
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

    const vertexInputInfo = new VkPipelineVertexInputStateCreateInfo();
    vertexInputInfo.sType =
      VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
    vertexInputInfo.vertexBindingDescriptionCount = 0;
    vertexInputInfo.pVertexBindingDescriptions = null;
    vertexInputInfo.vertexAttributeDescriptionCount = 0;
    vertexInputInfo.pVertexAttributeDescriptions = null;

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
    rasterizer.cullMode = VK_CULL_MODE_BACK_BIT;
    rasterizer.frontFace = VK_FRONT_FACE_CLOCKWISE;
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
    pipelineLayoutInfo.setLayoutCount = 0;
    pipelineLayoutInfo.pSetLayouts = null;
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
    const queueFamilyIndices = this.findQueueFamilies(this.physicalDevice!);

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

  createCommandBuffer() {
    const allocInfo = new VkCommandBufferAllocateInfo();
    allocInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO;
    allocInfo.commandPool = this.commandPool;
    allocInfo.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    allocInfo.commandBufferCount = 1;

    if (
      vkAllocateCommandBuffers(this.device, allocInfo, [this.commandBuffer]) !==
      VK_SUCCESS
    ) {
      throw new Error("Failed to allocate command buffers");
    }
  }

  createSyncObjects() {
    const semaphoreInfo = new VkSemaphoreCreateInfo();
    semaphoreInfo.sType = VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO;

    const fenceInfo = new VkFenceCreateInfo();
    fenceInfo.sType = VK_STRUCTURE_TYPE_FENCE_CREATE_INFO;
    fenceInfo.flags = VK_FENCE_CREATE_SIGNALED_BIT;

    if (
      vkCreateSemaphore(
        this.device,
        semaphoreInfo,
        null,
        this.imageAvailableSemaphore
      ) !== VK_SUCCESS ||
      vkCreateSemaphore(
        this.device,
        semaphoreInfo,
        null,
        this.renderFinishedSemaphore
      ) !== VK_SUCCESS ||
      vkCreateFence(this.device, fenceInfo, null, this.inFlightFence) !==
        VK_SUCCESS
    ) {
      throw new Error("Failed to create semaphores");
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

    vkCmdDraw(commandBuffer, 3, 1, 0, 0);

    vkCmdEndRenderPass(commandBuffer);

    if (vkEndCommandBuffer(commandBuffer) !== VK_SUCCESS) {
      throw new Error("Failed to record command buffer");
    }
  }

  drawFrame() {
    vkWaitForFences(
      this.device,
      1,
      [this.inFlightFence],
      true,
      Number.MAX_VALUE
    );
    vkResetFences(this.device, 1, [this.inFlightFence]);

    const imageIndex: VkInout = { $: 0 };
    vkAcquireNextImageKHR(
      this.device,
      this.swapChain,
      Number.MAX_VALUE,
      this.imageAvailableSemaphore,
      null,
      imageIndex
    );

    vkResetCommandBuffer(this.commandBuffer, 0);
    this.recordCommandBuffer(this.commandBuffer, Number(imageIndex.$));

    const submitInfo = new VkSubmitInfo();
    submitInfo.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;

    const waitSemaphores = [this.imageAvailableSemaphore];
    const waitStages = new Int32Array([
      VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
    ]);
    submitInfo.waitSemaphoreCount = 1;
    submitInfo.pWaitSemaphores = waitSemaphores;
    submitInfo.pWaitDstStageMask = waitStages;
    submitInfo.commandBufferCount = 1;
    submitInfo.pCommandBuffers = [this.commandBuffer];

    const signalSemaphores = [this.renderFinishedSemaphore];
    submitInfo.signalSemaphoreCount = 1;
    submitInfo.pSignalSemaphores = signalSemaphores;

    if (
      vkQueueSubmit(this.graphicsQueue, 1, [submitInfo], this.inFlightFence) !==
      VK_SUCCESS
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

    vkQueuePresentKHR(this.presentQueue, presentInfo);
  }
}
