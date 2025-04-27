import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Widget = ({ widget, onRemove, onEdit }) => {
  const renderContent = () => {
    switch(widget.type) {
      case 'donut':
      case 'pie':
        const data = {
          labels: widget.data.labels,
          datasets: [{
            data: widget.data.values,
            backgroundColor: widget.data.colors,
            borderWidth: 1
          }]
        };

        const options = {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20
              }
            }
          },
          cutout: widget.type === 'donut' ? '70%' : 0,
          maintainAspectRatio: false
        };

        return (
          <div className="chart-container">
            <Pie data={data} options={options} />
          </div>
        );
      
      default:
        return <p className="widget-text">{widget.content || 'Text Widget'}</p>;
    }
  };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3>{widget.name}</h3>
        <div className="widget-actions">
          
          <button onClick={onRemove} className="remove-btn">
            ×
          </button>
        </div>
      </div>
      <div className="widget-content">
        {renderContent()}
      </div>
      <button onClick={() => onEdit(widget)} className="edit-btn">
            Edit
          </button>
    </div>
  );
};

export default Widget;