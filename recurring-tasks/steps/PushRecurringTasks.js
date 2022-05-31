async function run(appContext, modifiedTasks) {
    console.log("push recurring tasks");
    for(const task of modifiedTasks) {
        const response = await appContext.notionClient.pages.update({
            page_id:task.pageId,
            properties:task.properties
        });
    }
}

module.exports = {run};