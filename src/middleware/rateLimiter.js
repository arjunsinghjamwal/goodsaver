import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        //this is just an example, within a real world application you will put userID or IPAddress as your key
        const {success} = await ratelimit.limit('my-rate-limit');

        if (!success) {
            return res.status(429).json({message: 'Too many requests, please try again later'})
        }
        next();

    } catch (error) {
        console.log('Rate Limit Error', error)
        next(error)
    }
}

export default ratelimiter;