const utils = require("../utils.js");

async function run(appContext, allAvailableDb) {
    console.log("fetching all completed recurring tasks");
    let tasks = [];
    for(database of allAvailableDb) {
        let response = await utils.FetchAllItemsFromDatabase(appContext.notionClient, 
            {
                databaseId:database.id,
                filter: {
                    and: [
                        {
                            property : appContext.globals.COMPLETED_PROPERTY_NAME,
                            checkbox : {
                                equals : true
                            }
                        },
                        {
                            property : appContext.globals.INTERVAL_PROPERTY_NAME,
                            select : {
                                is_not_empty : true
                            }
                        },
                        {
                            property : appContext.globals.DUE_DATE_PROPERTY_NAME,
                            date : {
                                is_not_empty : true
                            }
                        }
                    ]
                }
            });
        tasks.push(...response);
    }
    return tasks;
}

module.exports = {run};