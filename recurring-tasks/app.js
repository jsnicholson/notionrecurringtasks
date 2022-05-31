const notion = require("node_modules/@notionhq/client");
const FindAllAvailableDb = require("steps/FindAllAvailableDb.js");
const FetchAllCompletedRecurringTasks = require("steps/FetchAllCompletedRecurringTasks.js");
const ModifyRecurringTasks = require("steps/ModifyRecurringTasks.js");
const PushRecurringTasks = require("steps/PushRecurringTasks.js");

async function Main(envContext) {
    const notionApiKey = await GetNotionApiKey();
    notionClient = new notion.Client({auth:notionApiKey});
    const appContext = {
        notionClient,
        envContext,
        globals: {
            "COMPLETED_PROPERTY_NAME":"Done?",
            "DUE_DATE_PROPERTY_NAME":"Due",
            "INTERVAL_PROPERTY_NAME":"Recurrence Interval",
            "INTERVALS": {
                "Daily": [1, "days"],
                "Weekly": [1, "weeks"],
                "Biweekly": [2, "weeks"],
                "Monthly": [1, "months"],
                "Quaterly": [1, "quarters"],
                "Biannually": [6, "months"],
                "Annually": [1, "years"]
            }
        }
    };

    const allAvailableDb = await FindAllAvailableDb.run(appContext);
    const allRecurringTasks = await FetchAllCompletedRecurringTasks.run(appContext, allAvailableDb);
    const modifiedTasks = ModifyRecurringTasks.run(appContext, allRecurringTasks);
    await PushRecurringTasks.run(appContext, modifiedTasks);
}

async function GetNotionApiKey() {
    var AWS = require('aws-sdk');
    let secretManager = new AWS.SecretsManager({region:process.env.SECRET_REGION});
    const data = await secretManager.getSecretValue({SecretId:process.env.SECRET_ARN}).promise();
    const key = JSON.parse(data.SecretString).api_key;
    return key;
}

module.exports = {Main};