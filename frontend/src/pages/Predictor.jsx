import React, { useState } from 'react';
import { predictResponse } from '../api';
import { motion } from 'framer-motion';

export default function Predictor() {
  const [formData, setFormData] = useState({
    model_name: 'Logistic Regression',
    Gender: 1,
    Age: 44,
    Driving_License: 1,
    Region_Code: 28.0,
    Previously_Insured: 0,
    Vehicle_Age: 2,
    Vehicle_Damage: 1,
    Annual_Premium: 40454.0,
    Policy_Sales_Channel: 26.0,
    Vintage: 217
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const data = await predictResponse(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="container"
      style={{ maxWidth: 800 }}
    >
      <h1 className="title">Model Predictor Setup</h1>
      <p className="subtitle">Select your curated model to predict insurance response.</p>
      
      <div className="glass-panel">
        <form onSubmit={handleSubmit} className="grid grid-cols-2">
          
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Select Model</label>
            <select name="model_name" className="form-select" value={formData.model_name} onChange={handleChange}>
              <option value="Logistic Regression">Logistic Regression</option>
              <option value="Decision Tree">Decision Tree</option>
              <option value="Random Forest">Random Forest</option>
              <option value="XGBoost">XGBoost</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Gender (0: Female, 1: Male)</label>
            <input type="number" min="0" max="1" name="Gender" className="form-input" value={formData.Gender} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input type="number" min="18" max="100" name="Age" className="form-input" value={formData.Age} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Driving License (0/1)</label>
            <input type="number" min="0" max="1" name="Driving_License" className="form-input" value={formData.Driving_License} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Region Code</label>
            <input type="number" min="0" step="0.1" name="Region_Code" className="form-input" value={formData.Region_Code} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Previously Insured (0/1)</label>
            <input type="number" min="0" max="1" name="Previously_Insured" className="form-input" value={formData.Previously_Insured} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Age (Categories 1, 2, 3)</label>
            <input type="number" min="0" max="2" name="Vehicle_Age" className="form-input" value={formData.Vehicle_Age} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Damage (0/1)</label>
            <input type="number" min="0" max="1" name="Vehicle_Damage" className="form-input" value={formData.Vehicle_Damage} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Annual Premium ($)</label>
            <input type="number" min="0" step="0.1" name="Annual_Premium" className="form-input" value={formData.Annual_Premium} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Policy Sales Channel</label>
            <input type="number" min="0" step="0.1" name="Policy_Sales_Channel" className="form-input" value={formData.Policy_Sales_Channel} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Vintage (Days)</label>
            <input type="number" min="0" name="Vintage" className="form-input" value={formData.Vintage} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Response'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div style={{ color: '#ef4444', marginTop: 20, textAlign: 'center' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`result-card ${result.prediction === 1 ? 'success' : 'danger'}`}
        >
          <div className="result-text">
            {result.prediction === 1 ? 'Positive Response' : 'No Response'}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Probability: {(result.probability * 100).toFixed(2)}% | Model executed successfully.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
