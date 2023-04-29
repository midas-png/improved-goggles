import { useState, useEffect, FC } from "react";
import { Articles, IArticles } from "data";
import { Link } from "react-router-dom";
import "./catalog.scss";

export const Catalog: FC = () => {
    const [articles, setArticles] = useState<IArticles[]>([]);

    const parse = (text: string) => {
        let quotes: any[] = text.split(/[***]/gi);
        for (var i = 1; i < quotes.length; i += 2) {
            if (quotes[i].length !== 0) {
                quotes[i] = (
                    <div className="markdown__wrapper" key={i}>
                        <span className="markdown">{quotes[i]}</span>
                    </div>
                );
            }
        }
        return <div className="text__wrapper">{quotes}</div>;
    };

    useEffect(() => {
        setArticles(Articles);
    }, []);

    return (
        <div className="catalog__wrapper">
            <div className="articles__wrapper">
                {articles.map(({ id, title, text }) => (
                    <div key={id} className={"article__wrapper"}>
                        <h3>{title}</h3>
                        {parse(text)}
                        <div className="article__button__wrapper">
                            <Link to={`article/${id}`}>
                                <button className="article__button">
                                    Edit
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
