import * as nvk from "nvk/generated/1.1.126/linux";
import VulkanEngine from "./VulkanEngine";

Object.assign(globalThis, nvk);

const win = new VulkanWindow({
  title: "Hello Vulkan",
  width: 800,
  height: 600,
});

const app = new VulkanEngine(win);
app.run();
