const moment = require("moment");
let appContext;
const DATE_TIME_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{3})?(-[0-9]{2}:[0-9]{2})?$/

function run(_appContext, allTasks) {
    console.log("modify recurring tasks");
    appContext = _appContext;
    let modifiedTasks = [];
    const currentDate = moment();
    for(const task of allTasks) {
        let props = {};
        props = { ...props, ...MarkTaskAsNotComplete() };
        if(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.start != undefined) 
            props = { ...props, ...AdvanceTaskDueDateStartByInterval(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.start, currentDate, task.properties[appContext.globals.INTERVAL_PROPERTY_NAME].select.name) };
        if(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end != undefined)
            props = { ...props, ...AdvanceTaskDueDateEndByInterval(task.properties[appContext.globals.DUE_DATE_PROPERTY_NAME].date.end, currentDate, task.properties[appContext.globals.INTERVAL_PROPERTY_NAME].select.name) };
        modifiedTasks.push({
            pageId:task.id,
            properties:props
        });
    }
    return modifiedTasks;
}

function MarkTaskAsNotComplete() {
    let prop = {};
    prop[appContext.globals.COMPLETED_PROPERTY_NAME] = { checkbox:false };
    return prop;
}

function AdvanceTaskDueDateStartByInterval(dateStart, currentDate, interval) {
    if(!dateStart || dateStart == undefined || dateStart == null) return undefined;
    let parsedDate = moment.parseZone(dateStart);
    do {
        parsedDate.add(...appContext.globals.INTERVALS[interval]);
    } while (currentDate > parsedDate);
    let format = DATE_TIME_REGEX.test(dateStart) ? "YYYY-MM-DDTHH:mm:ss.SSSZ" : "YYYY-MM-DD";
    return JSON.parse(`{"${appContext.globals.DUE_DATE_PROPERTY_NAME}":{"date":{"start":"${parsedDate.format(format)}"}}}`);
}

function AdvanceTaskDueDateEndByInterval(dateEnd, currentDate, interval) {
    if(!dateEnd || dateEnd == undefined || dateEnd == null) return undefined;
    let parsedDate = moment.parseZone(dateEnd);
    do {
        parsedDate.add(...appContext.globals.INTERVALS[interval]);
    } while (currentDate > parsedDate);
    let format = DATE_TIME_REGEX.test(dateStart) ? "YYYY-MM-DDTHH:mm:ss.SSSZ" : "YYYY-MM-DD";
    return JSON.parse(`{"${appContext.globals.DUE_DATE_PROPERTY_NAME}":{"date":{"end":"${parsedDate.format(format)}"}}}`);
}

module.exports = {run};