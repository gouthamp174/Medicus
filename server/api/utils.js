import "express"
import RateLimit from "express-rate-limit" // Limits allowed calls for x amount of ms
import SlowDown from "express-slow-down" // Slows each following request if spammed


export const limiter = RateLimit({
	windowMs: 30 * 1000,
	max: 10,
});

export const speedLimiter = SlowDown({
	windowMs: 30 * 1000,
	delayAfter: 1,
	delayMs: 500
});
