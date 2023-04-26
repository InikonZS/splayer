import React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from './app';
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(App, {}, null));

/*const app = new App(document);
app.render();*/