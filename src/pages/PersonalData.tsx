import ReactMarkdown from "react-markdown";
import personal from "../assets/personal.md?raw";

export default function PersonalData() {
    return (
        <div className="prose">
            <ReactMarkdown>{personal}</ReactMarkdown>
        </div>
    );
}