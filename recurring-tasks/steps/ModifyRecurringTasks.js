const moment = require("moment");
let appContext;
const DATE_TIME_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{3})?(-[0-9]{2}:[0-9]{2})?$/

function run(_appContext, allTasks) {
    console.log("modify recurring tasks");
    appContext = _appContext;
    let modifiedTasks = [];
    const currentDate = moment();
    for(const task of allTasks) {
        let patch = { properties:{} };
        patch = MarkTaskAsNotComplete(patch);
        if((temp = AdvanceTaskDueDateStartByInterval(patch, currentDate)) != undefined) patch = temp;
        if((temp = AdvanceTaskDueDateEndByInterval(patch, currentDate)) != undefined) patch = temp;
        patch = AdvanceTaskDueDateStartByInterval(patch, currentDate);
        patch = AdvanceTaskDueDateEndByInterval(patch, currentDate);
        modifiedTasks.push({
            pageId:task.id,
            patch:patch
        });
        console.log(JSON.stringify(patch));
    }
    return modifiedTasks;
}

function MarkTaskAsNotComplete(task) {
    return task.properties[appContext.globals.COMPLETED_PROPERTY_NAME] = { checkbox:false };
}

function AdvanceTaskDueDateStartByInterval(task, currentDate) {
    console.log("");
    let dueStartDate = task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.start ?
        moment.parseZone(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.start) :
        null;
    if(!(task.properties[appContext.globals.INTERVAL_PROPERTY_NAME].select.name in appContext.globals.INTERVALS)) return undefined;
    do {
        dueStartDate.add(...appContext.globals.INTERVALS[appContext.globals.INTERVAL_PROPERTY_NAME].select.name);
    } while (currentDate > dueStartDate);
    let dueStartDateFormat = DATE_TIME_REGEX.test(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.start) ? "YYYY-MM-DDtHH:mm:ss.SSSZ" : "YYYY-MM-DD";
    task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.start = dueStartDate.format(dueStartDateFormat);
    return task;
}

function AdvanceTaskDueDateEndByInterval(task, currentDate) {
    if(!task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end) return undefined;
    let dueEndDate = task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end ?
        moment.parseZone(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end) :
        null;
    do {
        dueEndDate.add(...appContext.globals.INTERVALS[appContext.globals.INTERVAL_PROPERTY_NAME].select.name);
    } while (currentDate > dueEndDate);
    let dueEndDateFormat = DATE_TIME_REGEX.test(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end) ? "YYYY-MM-DDtHH:mm:ss.SSSZ" : "YYYY-MM-DD";
    task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end = dueEndDate.format(dueEndDateFormat);
    return task;
}

module.exports = {run};