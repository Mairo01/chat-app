const catchErrors = func =>
    (req, res, next) =>
        func(req, res, next)
            .catch((e) =>
                typeof e === "string"
                    ? res.status(400).json({ message: e })
                    : next(e)
            )

export default catchErrors
