import {Express} from 'express';
import { Logger } from 'pino';
import jwt from 'jsonwebtoken';


export type RacetrackRole = 'OBSERVER' | 'RECEPTIONIST' | 'SAFETY';
export type SignedToken = string;

export class AuthService {

    private readonly logger: Logger;

    constructor(app: Express, parentLogger: Logger) {
        const logger = parentLogger.child({ serviceName: this.constructor.name });
        this.logger = logger;

        app.post('/auth', (req, res) => {
            const { token } = req.body;

            if (!token) {
                res.status(400).send('Token is required');
                return;
            }

            const jwt = this.authenticate(token);
            if (jwt) {
                res.cookie('Authorization', jwt);
                res.status(200).send('Authenticated');
            } else {
                res.status(401).send('Authentication failed');
            }
        });
    }
    
    private authenticate(token: string): SignedToken | null {

        function signToken(token: string, role : RacetrackRole): SignedToken {
            const payload = {
                token: token,
                role: role,
            };

            return jwt.sign(payload, process.env.JWT_SECRET);
        }

        if (token === process.env.OBSERVER_KEY) {
            this.logger.info('Authenticated as OBSERVER');
            return signToken(token, 'OBSERVER');
        } else if (token === process.env.RECEPTIONIST_KEY) {
            this.logger.info('Authenticated as RECEPTIONIST');
            return signToken(token, 'RECEPTIONIST');
        }
        else if (token === process.env.SAFETY_KEY) {
            this.logger.info('Authenticated as SAFETY');
            return signToken(token, 'SAFETY');
        }

        this.logger.error('Authentication failed');
        return null;
    }
}