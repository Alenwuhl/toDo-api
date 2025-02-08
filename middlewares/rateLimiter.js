import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15min
    max: 100, // 100 requests max
    message: { error: "Too many requests. Please try again later." },
    headers: true, 
});

export default limiter;
