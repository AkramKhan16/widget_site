import { React, useState, useEffect } from 'react';

const AddWidgetModel = ({ onClose, onAdd, editingWidget }) => {
  const [widgetName, setWidgetName] = useState('');
  const [widgetType, setWidgetType] = useState('donut');
  const [labels, setLabels] = useState('');
  const [values, setValues] = useState('');
  const [colors, setColors] = useState('');

  useEffect(() => {
    if (editingWidget) {
      setWidgetName(editingWidget.name);
      setWidgetType(editingWidget.type);
      if (editingWidget.data) {
        setLabels(editingWidget.data.labels?.join(', ') || '');
        setValues(editingWidget.data.values?.join(', ') || '');
        setColors(editingWidget.data.colors?.join(', ') || '');
      }
    } else {
    
      setWidgetName('');
      setWidgetType('donut');
      setLabels('');
      setValues('');
      setColors('');
    }
  }, [editingWidget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const widgetData = widgetType === 'text'
      ? {}
      : {
          labels: labels.split(',').map(item => item.trim()),
          values: values.split(',').map(item => parseFloat(item.trim())),
          colors: colors.split(',').map(item => item.trim())
        };
    
    onAdd(widgetName, widgetType, widgetData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingWidget ? 'Edit Widget' : 'Add New Widget'}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Widget Name</label>
            <input
              type="text"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Widget Type</label>
            <select
              value={widgetType}
              onChange={(e) => setWidgetType(e.target.value)}
            >
              <option value="donut">Donut Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="text">Text Widget</option>
            </select>
          </div>

          {widgetType !== 'text' && (
            <>
              <div className="form-group">
                <label>Labels (comma separated)</label>
                <input
                  type="text"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  placeholder="e.g., Apples, Bananas, Oranges"
                  required={widgetType !== 'text'}
                />
              </div>
              
              <div className="form-group">
                <label>Values (comma separated numbers)</label>
                <input
                  type="text"
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  placeholder="e.g., 30, 50, 20"
                  required={widgetType !== 'text'}
                />
              </div>
              
              <div className="form-group">
                <label>Colors (comma separated)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="e.g., red, #4CAF50, royalblue"
                />
              </div>
            </>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingWidget ? 'Update' : 'Add'} Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWidgetModel;