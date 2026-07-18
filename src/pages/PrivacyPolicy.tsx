import ReactMarkdown from "react-markdown";
import privacy from "../assets/privacy.md?raw";

export default function PrivacyPolicy() {
    return (
        <div className="prose">
            <ReactMarkdown>{privacy}</ReactMarkdown>
        </div>
    );
}