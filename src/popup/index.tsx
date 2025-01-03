import { createRoot } from "react-dom/client";
import Root from "./root.jsx";

const container = document.createElement("div");

const root = createRoot(container);

root.render(<Root />);

document.body.append(container);