declare global {
    namespace jest {
        interface Matchers<R> {}
    }
}

declare module "express-session" {
    interface SessionData {
        user: UniqueId;
    }
}

export {};
