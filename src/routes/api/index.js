require('dotenv').config()
const { Router } = require('express');
const router = Router();

// ping route for testing
router.get(`/ping`, (req, res) => {
    res.status(200).json({
        "success": true
    });
});






module.exports = router;