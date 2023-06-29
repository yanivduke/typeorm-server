
import * as Mustache from 'mustache';

let render = (template: any, data: any) => {
    if(!template) template = "";
    Mustache.parse(template, ['{{','}}']); 
    return Mustache.render(template, data)
}

export default render
