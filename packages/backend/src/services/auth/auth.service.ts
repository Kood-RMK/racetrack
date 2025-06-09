import {Express} from 'express';
import { Logger } from 'pino';
import jwt from 'jsonwebtoken';
import { AuthenicationRequest, RACETRACK_AUTH_COOKIE, RACETRACK_AUTH_HEADER, RacetrackClientRole, SignedToken } from 'racetrack-shared/types';

export class AuthService {

    private readonly logger: Logger;

    constructor(app: Express, parentLogger: Logger) {
        const logger = parentLogger.child({ serviceName: this.constructor.name });
        this.logger = logger;

        app.post('/auth', async (req, res) => {
            const { token } = req.body as AuthenicationRequest;

            if (!token) {
                res.status(400).send('Token is required');
                return;
            }

            const jwt = this.authenticate(token);
            if (jwt) {
                res.cookie(RACETRACK_AUTH_COOKIE, jwt);
                res.contentType('application/json');
                res.header(RACETRACK_AUTH_HEADER, jwt);
                res.header('Access-Control-Expose-Headers', RACETRACK_AUTH_HEADER);
                res.status(200).send('Authenticated');
            } else {

                setTimeout(() => {
                    res.status(401).send('Authentication failed');
                }, 500)
            }
        });
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