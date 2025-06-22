import { proxy } from "valtio";
import modelList from "../assets/models.json";

export const editorState = proxy({
  models: {}, // id → { id, type, name, position, rotation, scale, metadata }
  selectedId: null,

  addModel(type) {
    const id = Date.now().toString();
    const modelMeta = modelList.find((m) => m.id === type);

    this.models[id] = {
      id,
      type,
      name: modelMeta?.label || "",
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

  updatePosition(pos) {
    if (this.selectedId && this.models[this.selectedId]) {
      this.models[this.selectedId].position = pos;
    }
  },

  updateRotation(axis, value) {
    if (this.selectedId && this.models[this.selectedId]) {
      const rot = this.models[this.selectedId].rotation;
      rot[axis] = value;
      this.models[this.selectedId].rotation = rot;
    }
  },

  updateScale(value) {
    if (this.selectedId && this.models[this.selectedId]) {
      this.models[this.selectedId].scale = value;
    }
  },

  renameModel(newName) {
    if (this.selectedId && this.models[this.selectedId]) {
      this.models[this.selectedId].name = newName;
    }
  },
});
