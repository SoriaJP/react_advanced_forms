import { ThemePicker, useTheme } from "@teishi/bulma_theme";
import ArticleForm from "./components/ArticleForm";

function App() {
    const { primary, secondary } = useTheme("state");
    return (
        <div>
            <h1 className={`title has-text-${primary}`}>Hello World!</h1>
            <ArticleForm />
        </div>
    );
}

export default App;
