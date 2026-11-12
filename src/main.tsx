import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyBrandToDocument } from './lib/brand.ts'

applyBrandToDocument()
createRoot(document.getElementById("root")!).render(<App />);
