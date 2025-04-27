import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: []
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    initialize: (state, action) => {
      state.categories = action.payload.categories;
    },
    addCategory: (state, action) => {
      state.categories.push({
        id: Date.now(),
        name: action.payload,
        widgets: []
      });
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        cat => cat.id !== action.payload
      );
    },
    addWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets.push(widget);
      }
    },
    updateWidget: (state, action) => {
      const { categoryId, widgetId, updatedWidget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        const index = category.widgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
          category.widgets[index] = updatedWidget;
        }
      }
    },
    removeWidget: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter(w => w.id !== widgetId);
      }
    }
  }
});

export const {
  initialize,
  addCategory,
  deleteCategory,
  addWidget,
  updateWidget,
  removeWidget
} = dashboardSlice.actions;

export default dashboardSlice.reducer;