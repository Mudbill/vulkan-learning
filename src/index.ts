import * as nvk from "nvk/generated/1.1.126/linux";
import Application from "./Application";

Object.assign(globalThis, nvk);

const WIDTH = 800;
const HEIGHT = 600;

const win = new VulkanWindow({
  title: "Hello Vulkan",
  width: WIDTH,
  height: HEIGHT,
});

const app = new Application(win);
app.run();
