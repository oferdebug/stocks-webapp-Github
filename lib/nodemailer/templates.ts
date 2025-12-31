
const LOGO_URL = "https://ik.imagekit.io/a6fkjou7d/logo.png?updatedAt=1756378431634";
const APP_NAME = "NextTrade";
const DASHBOARD_URL = "https://next-trade-app.vercel.app/";

export const NEWS_SUMMARY_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Market Summary - ${APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
                    <tr>
                        <td align="left" style="padding: 40px;">
                            <img src="${LOGO_URL}" alt="${APP_NAME} Logo" width="150">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <h1 style="color: #FDD458; margin: 0 0 20px 0;">Your Daily Market Update</h1>
                            <div style="color: #CCDADC;">
                                {{newsContent}}
                            </div>
                            <br>
                            <a href="${DASHBOARD_URL}" style="display: block; background: #FDD458; color: #000; padding: 16px; text-align: center; border-radius: 8px; text-decoration: none; font-weight: bold;">Open Trading Dashboard</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
                    <tr>
                        <td align="left" style="padding: 40px;">
                            <img src="${LOGO_URL}" alt="${APP_NAME} Logo" width="150">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="color: #FDD458;">Welcome aboard {{name}}</h1>
                            <div style="color: #CCDADC;">{{intro}}</div>
                            <br>
                            <a href="${DASHBOARD_URL}" style="display: block; background: #FDD458; color: #000; padding: 16px; text-align: center; border-radius: 8px; text-decoration: none;">Open Dashboard</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;