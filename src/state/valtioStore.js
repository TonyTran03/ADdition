import { proxy } from "valtio";

// Global editor state for models and selection
export const editorState = proxy({
  // Holds each model by its unique id
  models: {},

  // Currently selected model’s id, or null
  selectedId: null,

  // Adds a new model (auto-generates id, initializes metadata)
  addModel(type) {
    const id = Date.now().toString();
    this.models[id] = {
      type,
      position: [0, 0, 0],
      metadata: {},
    };
    this.selectedId = id;
  },

  // Selects an existing model
  selectModel(id) {
    this.selectedId = id;
  },

  // Updates position of the currently selected model
  updatePosition(position) {
    if (!this.selectedId) return;
    this.models[this.selectedId].position = position;
  },

  // Attach or mutate per-model logic in metadata
  setMetadata(key, value) {
    if (!this.selectedId) return;
    this.models[this.selectedId].metadata[key] = value;
  },
});
