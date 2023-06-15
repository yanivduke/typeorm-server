import {createLogger, transports, format} from "winston";
import 'winston-daily-rotate-file';
import { getLocation } from './location';
import * as uuid from "uuid";
import { configApp } from "../configApp";

const consoleFormat = format.printf(({ level, message }) => {
    return `${level},${message}`;
});

const jsonFormat = format.printf(({ level, message }) => {
    // return `{"timestemp": "${timestamp}", "level": "${level}", "message": "${message}" }`;
    return `{"level": "${level}", ${message} }`;
});

const transportDailyRotate = new (transports.DailyRotateFile)({
    level: 'info',
    handleExceptions: true,
    filename: configApp.LOG_FILE_PATH,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine (
        format.json(),
        format.timestamp(),
        jsonFormat,
        
    ),
});

const transportConsole = new (transports.Console)({
    level: 'debug',
    handleExceptions: true,
    format: format.combine (
        format.simple(),
        format.timestamp(),
        consoleFormat
    ),
});

transportDailyRotate.on('rotate', function(oldFilename, newFilename) {
    // save to cloud or do something fun
});

const classicLogger = createLogger({
    level: 'debug',
    transports: [
        transportDailyRotate,
        transportConsole
    ],
    exitOnError: false
});


const Logger = (level: string, msgTemplate: string, msgParams: any) => {
    msgParams["location"] = getLocation(2)
    msgParams["id"] = uuid.v4();
    msgTemplate  = '"id": "${id}", "location": "${location}", {' + msgTemplate + '}'
    let template = generateTemplateString(msgTemplate);
    let msg = template(msgParams);
    classicLogger.log({
        level: level,
        message: msg
    });

    return msgParams["id"];
};

 /**
 * Produces a function which uses template strings to do simple interpolation from objects.
 * 
 * Usage:
 *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
 * 
 *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
 *    // Logs 'Bryan is now the king of Scotland!'
 */
var generateTemplateString = (function(){
    var cache: any = {};

    function generateTemplate(template: any){
        var fn = cache[template];
        if (!fn){
            // Replace ${expressions} (etc) with ${map.expressions}.

            var sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_: any, match: string){
                    return `\$\{map.${match.trim()}\}`;
                })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

            fn = cache[template] = Function('map', `return \`${sanitized}\``);
        }

        return fn;
    };

    return generateTemplate;
})();

export { Logger };
  