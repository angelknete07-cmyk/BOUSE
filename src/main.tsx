import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import "./shell.css";
// Screen styles stay in the main stylesheet, in their historical cascade order,
// so lazy-loaded screens never reorder rules against art-direction.css.
import "./dashboard-experience.css";
import "./knowledge-map.css";
import "./lesson-scene.css";
import "./lesson-experience.css";
import "./reviews.css";
import "./project-learning-plan.css";
import "./project-workbench.css";
import "./simulation-lab.css";
import "./learning-portfolio.css";
import "./glossary.css";
import App from "./App";
import "./art-direction.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
