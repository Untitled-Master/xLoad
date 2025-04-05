
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundPaths from "./components/BackgroundPaths"
import ImageUploader from "./components/upload"




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BackgroundPaths />} />
        <Route path="/demo" element={<ImageUploader />} />

      </Routes>
    </Router>
  );
}

export default App;