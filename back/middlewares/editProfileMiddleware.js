function editProfileMiddleware(req, res, next) {
    const allowedFields = ["email", "password", "firstName", "lastName", "phoneNumber", "description", "classLevel"];
    const updateData = req.body;

    for (let key of Object.keys(updateData)) {
        if (!allowedFields.includes(key)) {
            return res.status(400).json({ message: `Field ${key} cannot be updated.` });
        }
    }

    next();
}

module.exports = editProfileMiddleware;
