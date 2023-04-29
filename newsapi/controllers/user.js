const { User } = require("../models/users");
const ApiError = require("../errorApi/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "48h" }
    );
};

class UserController {
    /**
     * Creating user.
     * @name post/signup
     * @function
     * @param {string} email
     * @param {string} password
     * @return {{ message: string }}.
     */
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(
                    ApiError.badRequest("Some parameter/-s was not provided")
                );
            }

            const candidate = await User.findOne({
                email,
            });

            if (candidate) {
                return next(ApiError.badRequest("Already in use"));
            }

            const hashPassword = await bcrypt.hash(password, 5);

            await User.create({ email, password: hashPassword });

            return res.json({ message: "User was created" });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    /**
     * Login user.
     * @name post/signin
     * @function
     * @param {string} email
     * @param {string} password
     * @return {{token: string}}.
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return next(ApiError.badRequest("User was not found"));
            }

            const comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(
                    ApiError.badRequest("Invalid login or/-and password")
                );
            }
            const token = generateJwt(user.id);
            return res.json({ token });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    /**
     * Controller JWT check by auth middleware.
     * @name get/auth
     * @function
     * @return {{token: string}}.
     */
    async check(req, res, next) {
        const token = generateJwt(req.user.id);
        return res.json({ token });
    }

    /**
     * Get all users.
     * @name get/getAll
     * @param {number} limit - max users shown per page
     * @param {number} page - page number
     * @function
     * @return {{id: number, email: string, password: string}[]}.
     */
    async getAll(req, res, next) {
        try {
            const users = await User.find({});
            return res.json(users);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    /**
     * Get user by id.
     * @name get/getOne/:id
     * @param {number} id - user id from request params
     * @function
     * @return {{id: number, email: string, password: string}}.
     */
    async getOne(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return next(ApiError.badRequest("No ID was passed"));
        }

        try {
            const user = await User.findById(id);

            return res.json(user);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new UserController();
