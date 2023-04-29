const { News } = require("../models/news");
const ApiError = require("../errorApi/ApiError");
const uuid = require("uuid");
const path = require("path");

class NewsController {
    /**
     * Creating news.
     * @name post/create
     * @function
     * @param {string} title
     * @param {string} text
     * @param {string} publishAt
     * @return {{ message: string }}.
     */
    async createNews(req, res, next) {
        try {
            const { title, text, publishAt } = req.body;
            const { image } = req.files;
            if (!title || !text || !image) {
                return next(
                    ApiError.badRequest("Some parameter/-s was not provided")
                );
            }

            const imageName = uuid.v4() + ".jpg";

            await News.create({
                title,
                text,
                image: imageName,
                publishAt: publishAt,
                userId: req.user.id
            });
            image.mv(path.resolve(__dirname, "..", "static", imageName));

            return res.json({ message: "News was created" });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    /**
     * Get all news.
     * @name get/getAll
     * @param {number} limit - max news shown per page
     * @param {number} page - page number
     * @function
     * @return {{id: number, title: string, text: string, publishAt: string}[]}.
     */
    async getAll(req, res, next) {
        try {
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 9;
            const offset = page * limit - limit;

            let news = await News.find({})
            
            news = news.filter(({ publishAt }) => {
                let publishDate = new Date(publishAt);
                publishDate.toISOString().split("T")[0];
                const offsetDate = publishDate.getTimezoneOffset();
                publishDate = new Date(
                    publishDate.getTime() - offsetDate * 60 * 1000
                );
                publishDate = publishDate.toISOString().split("T")[0];
                const now = new Date();

                return new Date(publishDate) <= now;
            });

            return res.json(news);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    /**
     * Get user by id.
     * @name get/getOne/:id
     * @param {number} id - news id from request params
     * @function
     * @return {{id: number, title: string, text: string, publishAt: string}[]}.
     */
    async getOne(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return next(ApiError.badRequest("No ID was passed"));
        }

        try {
            const news = await News.findById(id);

            const newsPublishDate = new Date(mnews.publishAt);
            const now = new Date();

            if (newsPublishDate < now) {
                return res.json(news);
            }
            return res.send(null);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    /**
     * Update news by id.
     * @name patch/news/:id
     * @param {number} id - news id from request params
     * @param {string} title - new news title
     * @param {string} text - new news text
     * @function
     * @return {{id: number, email: string, password: string}}.
     */
    async update(req, res, next) {
        const { id } = req.params;
        const { title, text } = req.body;

        if (!id) {
            return next(ApiError.badRequest("No ID was passed"));
        }

        try {
            const news = await News.findByIdAndUpdate(
                id,
                {
                    title,
                    text,
                },
                { new: true }
            );

            return res.json(news);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    /**
     * Delete news by id.
     * @name delete/news/:id
     * @param {number} id - news id from request params
     * @function
     * @return {{message: string}}.
     */
    async delete(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return next(ApiError.badRequest("No ID was passed"));
        }

        try {
            await News.deleteOne({ _id: id });
            return res.json({ message: "News deleted" });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new NewsController();
