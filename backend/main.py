import os
import joblib
import pickle
import pandas as pd
import numpy as np
import warnings
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from sklearn.metrics import roc_curve, auc
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

warnings.filterwarnings("ignore")

app = FastAPI(title="Health Insurance ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store models and data
models = {}
metrics_cache = {}

class PredictionInput(BaseModel):
    Gender: int
    Age: int
    Driving_License: int
    Region_Code: float
    Previously_Insured: int
    Vehicle_Age: int
    Vehicle_Damage: int
    Annual_Premium: float
    Policy_Sales_Channel: float
    Vintage: int
    model_name: str

def safe_load_model(path):
    try:
        return joblib.load(path)
    except Exception as e:
        try:
            with open(path, 'rb') as f:
                return pickle.load(f)
        except Exception as e2:
            print(f"Failed to load {path}: {e2}")
            return None

@app.on_event("startup")
async def startup_event():
    # Load Models
    base_dir = os.path.dirname(os.path.dirname(__file__))
    model_files = {
        'Decision Tree': os.path.join(base_dir, 'decision_tree.pkl'),
        'Logistic Regression': os.path.join(base_dir, 'logistic.pkl'),
        'Random Forest': os.path.join(base_dir, 'random_forest.pkl'),
        'XGBoost': os.path.join(base_dir, 'xgboost.pkl')
    }
    
    for name, path in model_files.items():
        if os.path.exists(path):
            models[name] = safe_load_model(path)
            print(f"Loaded {name}")
            
    # Load Data and Precompute Metrics
    data_path = os.path.join(base_dir, 'processed_train_data.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        
        # Responses
        responses = df['Response'].value_counts().to_dict()
        metrics_cache['target_distribution'] = [
            {"name": "No Response", "value": responses.get(0, 0)},
            {"name": "Positive Response", "value": responses.get(1, 0)}
        ]
        
        # Gender
        gender = df['Gender'].value_counts().to_dict()
        metrics_cache['gender_distribution'] = [
            {"name": f"Gender {k}", "value": v} for k, v in gender.items()
        ]
        
        # Age Distribution
        hist, bin_edges = np.histogram(df['Age'], bins=30)
        metrics_cache['age_distribution'] = [
            {"age": int((bin_edges[i] + bin_edges[i+1])/2), "count": int(hist[i])}
            for i in range(len(hist))
        ]
        
        # Driving License & Prev Insured
        metrics_cache['driving_license'] = [
            {"status": str(k), "count": v} for k, v in df['Driving_License'].value_counts().to_dict().items()
        ]
        metrics_cache['previously_insured'] = [
            {"status": str(k), "count": v} for k, v in df['Previously_Insured'].value_counts().to_dict().items()
        ]
        
        # Response Rate by Age
        age_resp = df.groupby('Age')['Response'].mean().reset_index()
        metrics_cache['response_by_age'] = age_resp.rename(columns={"Response": "response_rate"}).to_dict(orient='records')
        
        # Precompute ROC for all models (using subset of data if large to avoid slow startup)
        # Using 5000 random samples to make startup fast
        print("Precomputing ROC curves...")
        if len(df) > 5000:
            df_sample = df.sample(5000, random_state=42)
        else:
            df_sample = df
            
        X_sample = df_sample[['Gender', 'Age', 'Driving_License', 'Region_Code', 
                              'Previously_Insured', 'Vehicle_Age', 'Vehicle_Damage', 
                              'Annual_Premium', 'Policy_Sales_Channel', 'Vintage']]
        X_sample_xgb = df_sample[['id', 'Gender', 'Age', 'Driving_License', 'Region_Code', 
                              'Previously_Insured', 'Vehicle_Age', 'Vehicle_Damage', 
                              'Annual_Premium', 'Policy_Sales_Channel', 'Vintage']]
        y_sample = df_sample['Response']
        
        roc_data = {}
        for name, model in models.items():
            if model is not None:
                try:
                    current_X = X_sample_xgb
                    
                    if hasattr(model, "predict_proba"):
                        y_scores = model.predict_proba(current_X)[:, 1]
                    else:
                        # Some models might not have predict_proba
                        y_scores = model.predict(current_X)
                        
                    fpr, tpr, thresholds = roc_curve(y_sample, y_scores)
                    roc_auc = auc(fpr, tpr)
                    
                    # Reduce points to ~100 for frontend rendering efficiency
                    indices = np.linspace(0, len(fpr)-1, 100, dtype=int)
                    
                    roc_data[name] = {
                        "auc": float(roc_auc),
                        "data": [
                            {"fpr": float(fpr[i]), "tpr": float(tpr[i])}
                            for i in indices
                        ]
                    }
                except Exception as e:
                    print(f"ROC calculation failed for {name}: {e}")
        metrics_cache['roc_curves'] = roc_data
        
        # Generate Correlation Matrix Heatmap
        try:
            print("Generating Correlation Matrix...")
            correlation_matrix = df.corr()
            plt.figure(figsize=(20, 10))
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".1f", linewidths=0.1)
            plt.title('Correlation Matrix')
            
            buf = io.BytesIO()
            plt.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            metrics_cache['correlation_matrix_img'] = "data:image/png;base64," + base64.b64encode(buf.read()).decode('utf-8')
            plt.close()
        except Exception as e:
            print(f"Error generating correlation matrix: {e}")

        # Generate Violin Plot
        try:
            print("Generating Violin Plot...")
            plt.figure(figsize=(12, 8))
            sns.violinplot(x='Vehicle_Age', y='Annual_Premium', data=df, hue='Response', split=True, palette='Set2', inner='quartile')
            plt.ylim(0, 80000)
            plt.title('Violin Plot of Annual Premium by Vehicle Age and Response')
            plt.xlabel('Vehicle Age')
            plt.ylabel('Annual Premium')
            
            buf = io.BytesIO()
            plt.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            metrics_cache['violin_plot_img'] = "data:image/png;base64," + base64.b64encode(buf.read()).decode('utf-8')
            plt.close()
        except Exception as e:
            print(f"Error generating violin plot: {e}")

        print("Startup complete.")

@app.get("/api/metrics")
async def get_metrics():
    return metrics_cache

@app.post("/api/predict")
async def predict(data: PredictionInput):
    model_name = data.model_name
    if model_name not in models or models[model_name] is None:
        raise HTTPException(status_code=400, detail="Model not loaded or invalid")
        
    model = models[model_name]
    # All models now expect 11 columns (including 'id') as they were trained on the same X dataframe
    df_features = pd.DataFrame([{
        'id': 0, 'Gender': data.Gender, 'Age': data.Age, 'Driving_License': data.Driving_License, 
        'Region_Code': data.Region_Code, 'Previously_Insured': data.Previously_Insured, 
        'Vehicle_Age': data.Vehicle_Age, 'Vehicle_Damage': data.Vehicle_Damage, 
        'Annual_Premium': data.Annual_Premium, 'Policy_Sales_Channel': data.Policy_Sales_Channel, 
        'Vintage': data.Vintage
    }])
    
    try:
        prediction = model.predict(df_features)[0]
        probability = 0.0
        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(df_features)[0][1])
            
        return {
            "prediction": int(prediction),
            "probability": probability,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
