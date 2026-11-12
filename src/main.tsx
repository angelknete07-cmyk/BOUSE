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
import "./finish.css";
import "./fusion.css";
import "./console.css";
import "./comfort.css";
import "./guide.css";
import "./skill-tree.css";
import "./catalogue.css";
import "./missions.css";
import "./traps.css";
import "./phone.css";
import "./rail.css";
import { restoreEasyReading } from "./components/Comfort";

restoreEasyReading();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Offline reading once installed. Production only: the dev server must never
// be shadowed by a cached copy.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  addEventListener("load", () => {
    void navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .catch(() => {
        // Without a service worker the app still works online.
      });
  });
}
