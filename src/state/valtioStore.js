import { proxy } from "valtio";

export const editorState = proxy({
  models: {}, // id → { id, type, position, metadata }
  selectedId: null,

  addModel(type) {
    const id = Date.now().toString();
    this.models[id] = {
      id, // ← include it here
      type,
      position: [0, 0, 0],
      metadata: {},
    };
    this.selectedId = id;
  },

  selectModel(id) {
    if (this.models[id]) this.selectedId = id;
  },

  updatePosition(pos) {
    if (this.selectedId && this.models[this.selectedId]) {
      this.models[this.selectedId].position = pos;
    }
  },
});
