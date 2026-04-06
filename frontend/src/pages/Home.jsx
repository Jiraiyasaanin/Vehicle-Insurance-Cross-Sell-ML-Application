import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    { name: 'Gender', desc: 'Binary indicator (0 for Female, 1 for Male)' },
    { name: 'Age', desc: 'Age of the customer' },
    { name: 'Driving_License', desc: '1 if customer has DL, 0 otherwise' },
    { name: 'Region_Code', desc: 'Unique code for the region of the customer' },
    { name: 'Previously_Insured', desc: '1 if customer already has Vehicle Insurance, 0 otherwise' },
    { name: 'Vehicle_Age', desc: 'Age of the vehicle (0: <1 yr, 1: 1-2 yrs, 2: >2 yrs)' },
    { name: 'Vehicle_Damage', desc: '1 if vehicle got damaged in the past, 0 otherwise' },
    { name: 'Annual_Premium', desc: 'The amount customer needs to pay as premium in the year' },
    { name: 'Policy_Sales_Channel', desc: 'Anonymized code for the channel of outreach to the customer' },
    { name: 'Vintage', desc: 'Number of days customer has been associated with the company' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <h1 className="title" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '10px' }}>Vehicle Insurance Cross-Sell</h1>
      <p className="subtitle" style={{ textAlign: 'center', marginBottom: '40px' }}>
        Predicting whether a customer will be interested in Vehicle Insurance.
      </p>

      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h2 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Project Overview</h2>
          <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
            This application utilizes Machine Learning to predict whether past health insurance customers will also be interested
            in purchasing vehicle insurance provided by the company. Our goal is to optimize communication strategies and maximize 
            revenue through accurate propensity modeling.
          </p>
        </div>

        <div className="glass-panel">
          <h2 style={{ marginBottom: '16px', color: 'var(--accent)' }}>Models Trained</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ padding: '8px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border)' }}>🚀 <strong>XGBoost</strong></li>
            <li style={{ padding: '8px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border)' }}>🌳 <strong>Random Forest</strong></li>
            <li style={{ padding: '8px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border)' }}>📐 <strong>Decision Tree</strong></li>
            <li style={{ padding: '8px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border)' }}>📈 <strong>Logistic Regression</strong></li>
          </ul>
        </div>
        
        <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Exploratory Data Analysis</h2>
          <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Extensive statistical evaluation has been performed on the data. Key analyses include:
          </p>
          <ul style={{ listStyle: 'inside', paddingLeft: '10px', color: 'var(--text-main)', lineHeight: '1.8' }}>
            <li><strong>Demographics Distributions:</strong> Uncovering deep imbalances in target categories.</li>
            <li><strong>Correlation Matrices:</strong> Exploring multi-collinearity to identify redundant features.</li>
            <li><strong>Violin Plots:</strong> Identifying outliers and spread between continuous variables like Annual Premium and Categorical targets.</li>
            <li><strong>Receiver Operating Characteristics (ROC):</strong> Plotting False Positive metrics continuously to evaluate true algorithmic discriminative strength.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--accent)' }}>Dataset Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {features.map(f => (
              <div key={f.name} style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--text-main)' }}>{f.name}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
