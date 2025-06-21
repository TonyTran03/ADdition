import { proxy } from "valtio";

// Valtio store for 3D editor models
export const editorState = proxy({
  models: {}, // id → { id, type, position, rotation, scale, metadata }
  selectedId: null,

  // Add a new model with default transform values
  addModel(type) {
    const id = Date.now().toString();
    this.models[id] = {
      id,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      metadata: {},
    };
    this.selectedId = id;
  },

  // Select a model by its ID
  selectModel(id) {
    if (this.models[id]) {
      this.selectedId = id;
    }
  },

  // Update position array [x,y,z]
  updatePosition(pos) {
    if (this.selectedId && this.models[this.selectedId]) {
      this.models[this.selectedId].position = pos;
    }
  },

  // Update rotation around axis 0=x,1=y,2=z
  updateRotation(axis, value) {
    if (this.selectedId && this.models[this.selectedId]) {
      const rot = this.models[this.selectedId].rotation;
      rot[axis] = value;
      this.models[this.selectedId].rotation = rot;
    }
  },

  // Update uniform scale
  updateScale(value) {
    if (this.selectedId && this.models[this.selectedId]) {
      this.models[this.selectedId].scale = value;
    }
  },
});
