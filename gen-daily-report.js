const { CONFIG } = require('../src/config/index');
const Logger = require('bunyan-logger');
const { omniNonShelbyCardsDailyReport } = require('./omni-non-shelby-daily-cash-report');
const { omniShelbyCardsDailyReport } = require('./omni-shelby-daily-cash-report');
const { omniMoneyPlatformDailyReport } = require('./omni-moneyplatform-daily-cash-report');
const {
    stripeCardsDailyReport,
    stripePayoutDailyReport,
} = require('./stripe-daily-cash-report');
const { initSentry, reportError } = require('./libs/sentry');
const logger = new Logger({
    name: 'daily-report-index',
    stream: 'debug',
});
initSentry();

omniNonShelbyCardsDailyReport({}).catch((err) => {
    logger.error('omniNonShelbyCardsDailyReport error', err);
    reportError(err);
});
omniMoneyPlatformDailyReport({}).catch((err) => {
    logger.error('omniMoneyPlatformDailyReport error', err);
    reportError(err);
});

if (CONFIG.OMNI_ENV !== "prod") {
    omniShelbyCardsDailyReport({}).catch((err) => {
        logger.error('omniShelbyCardsDailyReport error', err);
        reportError(err);
    });
}

stripeCardsDailyReport({}).catch((err) => {
    logger.error('stripeCardsDailyReport error', err);
    reportError(err);
});
stripePayoutDailyReport({}).catch((err) => {
    logger.error('stripePayoutDailyReport error', err);
    reportError(err);
});

