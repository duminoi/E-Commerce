import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<div className="text-3xl font-bold">Hello World</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
