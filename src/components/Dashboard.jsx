import React, { useState } from 'react';
import Widget from './Widget';
import AddWidgetModel from './AddWidgetModel';
import dashboardData from '../data/dashboardData.json';
import '../styles.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(dashboardData.categories);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingWidget, setEditingWidget] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Handle adding/updating a widget
  const handleAddWidget = (categoryId, widgetName, widgetType, widgetData) => {
    if (editingWidget) {
      setCategories(prevCategories =>
        prevCategories.map(category => ({
          ...category,
          widgets: category.widgets.map(widget =>
            widget.id === editingWidget.id
              ? {
                  ...widget,
                  name: widgetName,
                  type: widgetType,
                  data: widgetData
                }
              : widget
          )
        }))
      );
    } else {
      const newWidget = {
        id: Date.now(),
        name: widgetName,
        type: widgetType,
        data: widgetData
      };
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryId
            ? { ...category, widgets: [...category.widgets, newWidget] }
            : category
        )
      );
    }
    setEditingWidget(null);
  };

  // Handle removing a widget
  const handleRemoveWidget = (categoryId, widgetId) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              widgets: category.widgets.filter(widget => widget.id !== widgetId)
            }
          : category
      )
    );
  };

  // Handle editing a widget
  const handleEditWidget = (widget) => {
    setEditingWidget(widget);
    const category = categories.find(cat =>
      cat.widgets.some(w => w.id === widget.id)
    );
    setSelectedCategory(category.id);
    setShowModal(true);
  };

  // Handle deleting a category
  const handleDeleteCategory = (categoryId) => {
    setCategories(prevCategories =>
      prevCategories.filter(category => category.id !== categoryId)
    );
  };

  // Handle creating a new category
  const handleCreateCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: newCategoryName,
      widgets: []
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  // Filter categories based on the search term
  const filteredCategories = categories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Executive Dashboard</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search widgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Button to create a new category */}
      <div className="create-category-btn">
        <button onClick={() => setShowCategoryModal(true)} className="btn-create-category">
          Create New Category
        </button>
      </div>

      {/* Modal for creating a new category */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Category</h2>
              <button onClick={() => setShowCategoryModal(false)} className="close-btn">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
              }}
            >
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredCategories.map(category => (
        <section key={category.id} className="category-section">
          <div className="category-header">
            <h2>{category.name}</h2>
            <div className="category-actions">
              <button onClick={() => handleDeleteCategory(category.id)} className="delete-category-btn">
                Delete Category
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(category.id);
                  setEditingWidget(null);
                  setShowModal(true);
                }}
                className="add-widget-btn"
              >
                <span className="plus-icon">+</span> Add Widget
              </button>
            </div>
          </div>
          <div className="widgets-grid">
            {category.widgets.map(widget => (
              <Widget
                key={widget.id}
                widget={widget}
                onRemove={() => handleRemoveWidget(category.id, widget.id)}
                onEdit={() => handleEditWidget(widget)}
              />
            ))}
          </div>
        </section>
      ))}

      {showModal && (
        <AddWidgetModel
          onClose={() => {
            setShowModal(false);
            setEditingWidget(null);
          }}
          onAdd={(name, type, data) => {
            handleAddWidget(selectedCategory, name, type, data);
            setShowModal(false);
          }}
          editingWidget={editingWidget}
        />
      )}
    </div>
  );
};

export default Dashboard;
