import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ComponentsPage } from "./pages/ComponentsPage";
import { FoundationsPage } from "./pages/FoundationsPage";
import { ExecutionPage } from "./pages/ExecutionPage";
import { HomePage } from "./pages/HomePage";
import { PatternsPage } from "./pages/PatternsPage";
import { StartPage } from "./pages/StartPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="foundations" element={<FoundationsPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="execution" element={<ExecutionPage />} />
        <Route path="patterns" element={<PatternsPage />} />
        <Route path="start" element={<StartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
