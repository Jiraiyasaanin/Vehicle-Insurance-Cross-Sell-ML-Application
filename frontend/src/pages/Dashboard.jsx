import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics()
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container" style={{textAlign: 'center', marginTop: '100px'}}>Loading amazing metrics...</div>;
  }

  if (!metrics) {
    return <div className="container" style={{textAlign: 'center', marginTop: '100px'}}>Failed to load metrics. Is the backend running?</div>;
  }

  const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#3b82f6'];

  const pieLabel = ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`;

  const mappedGender = metrics.gender_distribution.map(item => {
    // Backend returns "Gender 0" or "Gender 1"
    let newName = item.name;
    if (newName.includes('0')) newName = 'Female';
    else if (newName.includes('1')) newName = 'Male';
    return { ...item, name: newName };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <h1 className="title">Model & Data Analyses</h1>
      <p className="subtitle">Exploratory Data Analysis and Model Performances</p>
      
      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h2 className="subtitle">Target Distribution (Response)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={metrics.target_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={pieLabel}>
                  {metrics.target_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="subtitle">Gender Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mappedGender} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label={pieLabel} labelLine={true}>
                  {mappedGender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="subtitle">Response Rate by Age</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={metrics.response_by_age}>
                <XAxis dataKey="Age" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)' }}/>
                <Bar dataKey="response_rate" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {metrics.correlation_matrix_img && (
          <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
            <h2 className="subtitle">Correlation Matrix</h2>
            <img src={metrics.correlation_matrix_img} alt="Correlation Matrix Heatmap" style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
          </div>
        )}

        {metrics.violin_plot_img && (
          <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
            <h2 className="subtitle">Violin Plot: Annual Premium by Vehicle Age</h2>
            <img src={metrics.violin_plot_img} alt="Violin Plot" style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
          </div>
        )}

        <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="subtitle">ROC Curves (4 Models)</h2>
          <p className="form-label" style={{marginBottom: 10}}>Receiver Operating Characteristic comparing Decision Tree, Logistic Regression, Random Forest, and XGBoost.</p>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="fpr" type="number" stroke="#94a3b8" domain={[0, 1]} tickCount={11} label={{ value: 'False Positive Rate', position: 'insideBottomRight', offset: 0, fill: '#94a3b8' }} />
                <YAxis type="number" stroke="#94a3b8" domain={[0, 1]} tickCount={11} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
                {metrics.roc_curves && Object.keys(metrics.roc_curves).map((modelName, index) => (
                  <Line 
                    key={modelName}
                    data={metrics.roc_curves[modelName].data} 
                    type="monotone" 
                    dataKey="tpr" 
                    name={`${modelName} (AUC: ${metrics.roc_curves[modelName].auc.toFixed(3)})`} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={3}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
