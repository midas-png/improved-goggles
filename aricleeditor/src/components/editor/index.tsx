import { useState, useEffect, FC, ChangeEvent } from "react";
import { AiOutlineCode } from "react-icons/ai";
import { Articles, IArticles } from "data";
import { useParams } from "react-router-dom";
import "./editor.scss";

export const Editor: FC = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<IArticles>({
        id: Number(id),
        title: "",
        text: "",
        picture: undefined,
        document: undefined,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleArticleChange = (): void => {
        // Имитация запроса на сервер.
        // После изменения полей статьи и отправки мокового запроса новые данные не будут присвоены
        setLoading(true);

        setTimeout(async () => {
            await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
                () => setLoading(false)
            );
        }, 1000);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setArticle({ ...article, picture: e.target.files[0] });
        }
    };

    const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setArticle({ ...article, document: e.target.files[0] });
        }
    };

    const addMarkdown = (): void => {
        const appendedText = article.text.concat(`
    ***
        
    ***`);
        setArticle({ ...article, text: appendedText });
    };

    useEffect(() => {
        const foundArticle = Articles.find(
            (article) => article.id === Number(id)
        );
        foundArticle && setArticle(foundArticle);
    }, [id]);

    return (
        <div className="editor__wrapper">
            <div className="form__wrapper">
                <div className="editable__wrapper">
                    <label>Title</label>
                    <input
                        type="text"
                        value={article.title}
                        onChange={(e) =>
                            setArticle({ ...article, title: e.target.value })
                        }
                    />
                </div>
                <div className="editable__wrapper">
                    <label>Text</label>
                    <div className="text__wrapper">
                        <div className="formatting__wrapper">
                            <div
                                className="formatting__icons"
                                onClick={addMarkdown}
                            >
                                <AiOutlineCode />
                            </div>
                        </div>
                        <textarea
                            className="form__text"
                            value={article.text}
                            onChange={(e) =>
                                setArticle({
                                    ...article,
                                    text: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="editable__wrapper">
                    <label>Picture</label>
                    <input
                        type="file"
                        className="form__file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="editable__wrapper">
                    <label>Documents</label>
                    <input
                        type="file"
                        className="form__file"
                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleDocumentChange}
                    />
                </div>
                <button
                    className="form__button"
                    disabled={loading}
                    onClick={handleArticleChange}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </div>
        </div>
    );
};
