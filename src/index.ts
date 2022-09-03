import { VulkanWindow } from "nvk/generated/1.1.126/linux";
import Application from "./Application";

const WIDTH = 800;
const HEIGHT = 600;

const win = new VulkanWindow({
  title: "Hello Vulkan",
  width: WIDTH,
  height: HEIGHT,
  resizable: false,
});

const app = new Application(win);
app.run();
