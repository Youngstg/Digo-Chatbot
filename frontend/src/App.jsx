import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./store/ChatContext";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </ChatProvider>
    </Router>
  );
}

export default App;
