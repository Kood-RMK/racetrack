declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      RECEPTIONIST_KEY: string;
      OBSERVER_KEY: string;
      SAFETY_KEY: string;
      JWT_SECRET: string;
      RACE_DURATION_SECONDS: number; // in seconds.
      STOPWATCH_TICK : number; // in milliseconds.
    }
  }