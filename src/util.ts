import fs from "fs";
import {
  VkVertexInputAttributeDescription,
  VkVertexInputBindingDescription,
  VK_FORMAT_R32G32B32_SFLOAT,
  VK_FORMAT_R32G32_SFLOAT,
  VK_VERTEX_INPUT_RATE_VERTEX,
} from "nvk/generated/1.1.126/linux";

export function readBinaryFile(filename: string) {
  const file = fs.readFileSync(filename);
  return new Uint8Array(file);
}

export function memcpy(dstPtr: bigint, srcData: Float32Array, byteLen: number) {
  const dstBuffer = ArrayBuffer.fromAddress(dstPtr, byteLen);
  const srcBuffer = srcData.buffer;
  const dstView = new Uint8Array(dstBuffer);
  const srcView = new Uint8Array(srcBuffer);
  for (let ii = 0; ii < byteLen; ++ii) dstView[ii] = srcView[ii];
}

export class Vertex {
  // pos: vec2 = [0, 0];
  // color: vec3 = [0, 0, 0];

  // constructor(pos: vec2, color: vec3) {
  //   this.pos = pos;
  //   this.color = color;
  // }

  static getBindingDescription() {
    const bindingDescription = new VkVertexInputBindingDescription();
    bindingDescription.binding = 0;
    bindingDescription.stride = 5 * 4; // a number size * 5
    bindingDescription.inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
    return bindingDescription;
  }

  static getAttributeDescription() {
    const attributeDescriptions: VkVertexInputAttributeDescription[] = [
      new VkVertexInputAttributeDescription(),
      new VkVertexInputAttributeDescription(),
    ];

    attributeDescriptions[0].binding = 0;
    attributeDescriptions[0].location = 0;
    attributeDescriptions[0].format = VK_FORMAT_R32G32_SFLOAT; // 2x 32-bit signed floats representing XY
    attributeDescriptions[0].offset = 0; // no offset, starts at beginning of each segment

    attributeDescriptions[1].binding = 0;
    attributeDescriptions[1].location = 1;
    attributeDescriptions[1].format = VK_FORMAT_R32G32B32_SFLOAT; // 3x 32-bit signed floats representing RGB
    attributeDescriptions[1].offset = 2 * 4; // color starts at third number in each segment
    //attributeDescriptions[1].offset = sizeof([0, 0]);

    return attributeDescriptions;
  }
}

// const onlyVertices: Vertex[] = [
//   new Vertex([0, 0.5], [1, 0, 0]),
//   new Vertex([0.5, 0.5], [0, 1, 0]),
//   new Vertex([-0.5, 0.5], [0, 0, 1]),
// ];

export const rawVertices = new Float32Array([
  0, -0.5, 1, 0, 0, 0.5, 0.5, 0, 1, 0, -0.5, 0.5, 0, 0, 1,
]);

// const vertices: Array<[[number, number], [number, number, number]]> = [
//   [
//     [0, 0.5],
//     [1, 0, 0],
//   ],
//   [
//     [0.5, 0.5],
//     [0, 1, 0],
//   ],
//   [
//     [-0.5, 0.5],
//     [0, 0, 1],
//   ],
// ];
