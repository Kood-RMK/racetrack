import {Express} from 'express';
import { Logger } from 'pino';
import jwt from 'jsonwebtoken';
import { AuthenicationRequest, RACETRACK_AUTH_COOKIE, RACETRACK_AUTH_HEADER, RacetrackClientRole, SignedToken } from 'racetrack-shared/types';
import { IncomingMessage, ServerResponse } from 'node:http';
import { UrlWithParsedQuery } from 'node:url';

export class AuthService {

    private readonly logger: Logger;

    constructor(parentLogger: Logger) {
        const logger = parentLogger.child({ serviceName: this.constructor.name });
        this.logger = logger;
    }

    public handle(req: IncomingMessage, res: ServerResponse, url: UrlWithParsedQuery) {
        if (req.method === 'POST' && url.pathname === '/auth') {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                try {
                    const { token } = JSON.parse(body) as AuthenicationRequest;

                    if (!token) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Token is required');
                        return;
                    }

                    const jwtToken = this.authenticate(token);
                    if (jwtToken) {
                        // Set cookie
                        res.setHeader('Set-Cookie', `${RACETRACK_AUTH_COOKIE}=${jwtToken}; Path=/`);
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader(RACETRACK_AUTH_HEADER, jwtToken);
                        res.setHeader('Access-Control-Expose-Headers', RACETRACK_AUTH_HEADER);
                        res.statusCode = 200;
                        res.end(JSON.stringify({ message: 'Authenticated' }));
                    } else {
                        setTimeout(() => {
                            res.statusCode = 401;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end('Authentication failed');
                        }, 500);
                    }
                } catch (err) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Invalid request body');
                }
            });
            return;
        }
    }
    
    private authenticate(token: string): SignedToken | null {

        function signToken(token: string, role : RacetrackClientRole): SignedToken {
            const payload = {
                token: token,
                role: role,
            };

            return jwt.sign(payload, String(process.env.JWT_SECRET));
        }

        if (token === process.env.OBSERVER_KEY) {
            this.logger.info(`${token} authenticated as OBSERVER.`);
            return signToken(token, RacetrackClientRole.OBSERVER);
        } 
        else if (token === process.env.RECEPTIONIST_KEY) {
            this.logger.info(`${token} authenticated as RECEPTIONIST.`);
            return signToken(token, RacetrackClientRole.RECEPTIONIST);
        }
        else if (token === process.env.SAFETY_KEY) {
            this.logger.info(`${token} authenticated as SAFETY.`);
            return signToken(token, RacetrackClientRole.SAFETY);
        } 

        this.logger.error('Client authentication failed. Invalid token.');
        return null;
    }
}