import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import App from './App';
import CreateItem from './routes/create-Item'
import MyAssets from './routes/my-assets';
import CreatorDashboard from './routes/creator-dashboard';
import Home from './routes/home';

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
        <Route path="create-item" element={<CreateItem />} />
        <Route path="my-assets" element={<MyAssets />} />
        <Route path="creator-dashboard" element={<CreatorDashboard />} />
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);