async function run(appContext) {
    console.log("finding all available databases");
    let response = await appContext.notionClient.search({
        filter: {
            property:'object',
            value:'database'
        }
    });

    // if(response.status != 200)
    //     throw response;

    let allDbs = [];
    for(const db of response.results) {
        if(db.id != process.env.NOTION_DATABASE_DESTINATION)
            allDbs.push({
                id:db.id,
                name:db.title[0].plain_text,
            })
    }
    return allDbs;
}

module.exports = {run};