export const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const APIHost = development ? 'https://api.gearfocus.div4.pgtest.co' : 'https://google.com';

export const ACCESS_TOKEN_KEY = 'token';

export const LABEL_COLUMN = 2.5