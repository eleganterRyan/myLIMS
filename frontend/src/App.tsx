import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthProvider from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import SafetyInspection from './pages/safety/SafetyInspection';
import SafetyRecords from './pages/safety/SafetyRecords';
import SafetyReports from './pages/safety/SafetyReports';
import UserManagement from './pages/users/UserManagement';
import ResearchGroupManagement from './pages/research/ResearchGroupManagement';
import LaboratoryManagement from './pages/laboratory/LaboratoryManagement';
import LabInfo from './pages/laboratory/LabInfo';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/experiments" element={<div>实验管理</div>} />
                      <Route path="/equipment" element={<div>设备管理</div>} />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/schedule" element={<div>预约管理</div>} />
                      <Route path="/safety/inspection" element={<SafetyInspection />} />
                      <Route path="/safety/records" element={<SafetyRecords />} />
                      <Route path="/safety/reports" element={<SafetyReports />} />
                      <Route path="/research-groups" element={<ResearchGroupManagement />} />
                      <Route path="/laboratories" element={<LaboratoryManagement />} />
                      <Route path="/lab-info/:info" element={<LabInfo />} />
                    </Routes>
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
