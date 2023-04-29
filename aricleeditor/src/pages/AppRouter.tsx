import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Article } from "./Article";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
        </Routes>
    );
};
