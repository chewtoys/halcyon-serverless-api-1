# Halcyon Serverless Api

A Serverless api project template.

[https://halcyon-serverless-api.chrispoulter.com](https://halcyon-serverless-api.chrispoulter.com)

**Technologies used:**

-   Serverless Framework
    [https://serverless.com](https://serverless.com)
-   TypeScript
    [https://www.typescriptlang.org](https://www.typescriptlang.org)
-   MongoDB
    [https://www.mongodb.com](https://www.mongodb.com)

**External authentication providers:**

-   Facebook
    [https://developers.facebook.com](https://developers.facebook.com)
-   Google
    [https://console.developers.google.com](https://console.developers.google.com)

#### Custom Settings

Create `.env` file in root directory.

```
MONGODB=mongodb://localhost:27017/halcyon

JWT_SECURITY_KEY=Z332RQz9Yjjd1IfRfv4W

SEED_EMAIL_ADDRESS=admin@chrispoulter.com
SEED_PASSWORD=Testing123

EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USERNAME=#REQUIRED#
EMAIL_PASSWORD=#REQUIRED#
EMAIL_NOREPLY=noreply@chrispoulter.com

FACEBOOK_APP_ID=#REQUIRED#
FACEBOOK_APP_SECRET=#REQUIRED#

GOOGLE_CLIENT_ID=#REQUIRED#
```
