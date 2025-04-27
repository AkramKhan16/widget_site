import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  initialize, 
  addCategory, 
  deleteCategory, 
  addWidget, 
  updateWidget, 
  removeWidget 
} from '../store/dashboardSlice';
import Widget from './Widget';
import AddWidgetModel from './AddWidgetModel';
import AddCategoryModal from './AddCategoryModal';
import dashboardData from '../data/dashboardData.json';
import '../styles.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const categories = useSelector(state => state.dashboard.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialize(dashboardData));
  }, [dispatch]);

  const handleCreateCategory = (name) => {
    dispatch(addCategory(name));
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  const handleRemoveWidget = (categoryId, widgetId) => {
    dispatch(removeWidget({ categoryId, widgetId }));
  };

  const handleAddWidget = (categoryId, widgetName, widgetType, widgetData) => {
    const newWidget = {
      id: Date.now(),
      name: widgetName,
      type: widgetType,
      data: {
        labels: widgetData?.labels || [],
        values: widgetData?.values || [],
        colors: widgetData?.colors || []
      }
    };
    
    dispatch(addWidget({ 
      categoryId: categoryId || selectedCategoryId, 
      widget: newWidget 
    }));
    setShowModal(false);
  };

  const handleUpdateWidget = (categoryId, widgetId, widgetName, widgetType, widgetData) => {
    const updatedWidget = {
      id: widgetId,
      name: widgetName,
      type: widgetType,
      data: {
        labels: widgetData?.labels || [],
        values: widgetData?.values || [],
        colors: widgetData?.colors || []
      }
    };
    
    dispatch(updateWidget({ 
      categoryId, 
      widgetId, 
      updatedWidget 
    }));
    setShowModal(false);
  };

  const handleWidgetSubmit = (categoryId, widgetName, widgetType, widgetData) => {
    if (editingWidget) {
      handleUpdateWidget(categoryId, editingWidget.id, widgetName, widgetType, widgetData);
    } else {
      handleAddWidget(categoryId, widgetName, widgetType, widgetData);
    }
    setEditingWidget(null);
  };

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

      <div className="create-category-btn">
        <button 
          onClick={() => setShowCategoryModal(true)} 
          className="btn-create-category"
        >
          Create New Category
        </button>
      </div>

      {showCategoryModal && (
        <AddCategoryModal 
          onClose={() => setShowCategoryModal(false)}
          onAdd={handleCreateCategory}
        />
      )}

      {categories.map(category => (
        <section key={category.id} className="category-section">
          <div className="category-header">
            <h2>{category.name}</h2>
            <div className="category-actions">
              <button 
                onClick={() => handleDeleteCategory(category.id)} 
                className="delete-category-btn"
              >
                Delete Category
              </button>
              <button
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setShowModal(true);
                }}
                className="add-widget-btn"
              >
                <span className="plus-icon">+</span> Add Widget
              </button>
            </div>
          </div>
          <div className="widgets-grid">
            {category.widgets
              .filter(widget => 
                widget.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(widget => (
                <Widget
                  key={widget.id}
                  widget={widget}
                  onRemove={() => handleRemoveWidget(category.id, widget.id)}
                  onEdit={() => {
                    setEditingWidget(widget);
                    setSelectedCategoryId(category.id);
                    setShowModal(true);
                  }}
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
          onAdd={handleWidgetSubmit}
          editingWidget={editingWidget}
          selectedCategoryId={selectedCategoryId}
        />
      )}
    </div>
  );
};

export default Dashboard;