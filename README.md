# FoodCart - Online Food Ordering App

Online food ordering app deployed on Azure Kubernetes Service using Azure DevOps CI/CD.

## Tech Stack
- Frontend: React.js
- Backend: Python Flask
- Database: MongoDB
- Container: Docker
- Orchestration: Kubernetes (AKS)
- CI/CD: Azure DevOps Pipelines
- Registry: Azure Container Registry

## Live App
http://57.162.160.199

## Architecture
Developer pushes code to Azure Repos
Pipeline builds Docker images and pushes to ACR
Pipeline deploys to AKS cluster
App goes live via LoadBalancer public IP

## Kubernetes Services
- frontend-service: LoadBalancer 57.162.160.199:80
- backend-service:  LoadBalancer 52.226.194.79:5000
- mongodb-service:  ClusterIP (internal)

## Project Structure
backend/app.py - Flask REST API
backend/Dockerfile - Backend container
frontend/src/App.js - React UI
frontend/Dockerfile - Frontend nginx container
k8s/mongodb.yaml - MongoDB deployment
k8s/backend.yaml - Backend deployment
k8s/frontend.yaml - Frontend deployment
azure-pipelines.yml - CI/CD pipeline

## Setup
az group create --name foodcart-rg --location eastus
az acr create --resource-group foodcart-rg --name foodcartacr7330 --sku Basic --admin-enabled true
az aks create --resource-group foodcart-rg --name foodcart-aks --node-count 1 --node-vm-size Standard_B2s --attach-acr foodcartacr7330 --generate-ssh-keys
az aks get-credentials --resource-group foodcart-rg --name foodcart-aks

## Cost Saving
az aks scale --resource-group foodcart-rg --name foodcart-aks --node-count 0
az aks scale --resource-group foodcart-rg --name foodcart-aks --node-count 1

## Author
ddprasad | Azure DevOps Learning Project | June 2026
