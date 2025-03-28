// Included from utils.js
/*
Copyright 2023 Jonathan Kamens.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
*/

var utils = {
    perItemLimit: 8192,
    debugging: false,

    debug: function(...args) {
        if (utils.debugging)
            console.log.apply(null, ["LIJF"].concat(args));
    },

    valuesAreEqual: function(value1, value2) {
        if (Array.isArray(value1)) {
            if (!Array.isArray(value2)) return false;
            if (value1.length != value2.length) return false;
            for (var i = 0; i < value1.length; i++)
                if (! utils.valuesAreEqual(value1[i], value2[i])) return false;
            return true;
        }
        if (typeof(value1) == "object") {
            if (typeof(value2) != "object") return false;
            if (Object.keys(value1).length != Object.keys(value2).length)
                return false;
            for (var [key, value] of Object.entries(value1))
                if (! utils.valuesAreEqual(value, value2[key])) return false;
            return true;
        }
        return value1 == value2;
    },

    saveListToStorage: async function(name, items) {
        var oldOptions = await chrome.storage.sync.get();
        var perItemSize = utils.perItemLimit * 0.9;  // 10% slack
        var totalLength = JSON.stringify(items).length;
        var numberOfFragments = Math.ceil(totalLength / perItemSize);
        var itemsPerFragment = Math.ceil(items.length / numberOfFragments);
        var options = {};
        for (var i = 0; i < numberOfFragments; i++) {
            var key = `${name}${i}`;
            var start = itemsPerFragment * i;
            var end = start + itemsPerFragment;
            options[key] = items.slice(start, end);
        }
        await chrome.storage.sync.set(options);
        var toRemove = [];
        if (oldOptions[name] != undefined)
            toRemove.push(name);
        while (oldOptions[`${name}${i}`] != undefined) {
            toRemove.push(`${name}${i}`);
            i++;
        }
        if (toRemove.length)
            await chrome.storage.sync.remove(toRemove);
    },

    readListFromStorage: async function(name) {
        var options = await chrome.storage.sync.get();
        // Backward compatibility 2023-03-22
        if (options[name] != undefined)
            return options[name];
        var items = [];
        for (var i = 0; options[`${name}${i}`] != undefined; i++)
            items = items.concat(options[`${name}${i}`])
        return items;
    },

    id: undefined,

    regReg: /^\/(.*)\/([i]*)$/,

    compileRegexps: function(regexps) {
        utils.debug(`compileRegexps(${regexps})`);
        if (! regexps) return [];
        var compiled = [];
        for (var regexp of regexps) {
            var flags;
            var match = utils.regReg.exec(regexp);
            if (match) {
                regexp = match[1];
                flags = match[2];
            }
            else {
                flags = "";
            }
            try {
                regexp = new RegExp(regexp, flags);
            }
            catch (ex) {
                console.log(ex.message);
                continue;
            }
            compiled.push(regexp);
        }
        return compiled;
    },

    escapeHTML: function(unsafeText) {
        let div = document.createElement('div');
        div.innerText = unsafeText;
        return div.innerHTML;
    },

    unparseJobFilters: function(filters) {
        filters = filters.map(f => {
            var filter = `${f.title} // ${f.company} // ${f.location}`;
            if (f.private) {
                filter += " // private";
            }
            return filter;
        });
        return filters;
    },
};

// Borrowed from https://stackoverflow.com/a/1997811/937306
(function() {
    if ( typeof utils.id != "undefined" ) return;

    var _id = 0;

    utils.id = function(o) {
        if ( typeof o.__uniqueid != "undefined" ) {
            return o.__uniqueid;
        }

        Object.defineProperty(o, "__uniqueid", {
            value: `id${++_id}`,
            enumerable: false,
            writable: false
        });

        return o.__uniqueid;
    };
})();
// Original options.js.in
/*
Copyright 2023 Jonathan Kamens.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
*/

function getTextArea(id) {
    var elt = document.getElementById(id);
    var items = elt.value.split("\n");
    var new_items = [];
    for (var item of items) {
        item = item.trim();
        if (item != "") {
            new_items.push(item);
        }
    }
    return new_items;
}

function getTextAreas(id, results) {
    var ids = {t: "titles", c: "companies", l: "locations"};
    var elt = document.getElementById(id);
    var items = elt.value.split("\n");
    var diverted = false;
    for (var item of items) {
        var this_id, match;
        item = item.trim();
        if (item == "")
            continue;
        match = /^([tcl]):\s*(.*)/i.exec(item);
        if (match) {
            if (! match[2])
                continue;
            diverted = true;
            this_id = ids[match[1].toLowerCase()];
            results[this_id].unshift(match[2]);
        }
        else
            results[id].push(item);
    }
    return diverted;
}

function checkRegExps(regexps) {
    for (var regexp of regexps) {
        try {
            new RegExp(regexp);
        }
        catch (ex) {
            error(ex.message);
            return false;
        }
    }
    return true;
}

function parseJobFilters(specStrings) {
    var specArrays = specStrings.map(s=>s.split(/\s*\/\/\s*/))
    var specs = [];
    for (var specString of specStrings) {
        let specArray = specArrays.shift();
        if (specArray.length < 3) {
            error(`Too few fields in "${specString}"`);
            return false;
        }
        if (specArray.length > 4) {
            error(`Too many fields in "${specString}"`);
            return false;
        }
        var spec = {
            title: specArray[0],
            company: specArray[1],
            location: specArray[2]
        };
        if (specArray.length == 4 && specArray[3]) {
            var options = specArray[3];
            if (options != "private") {  // currently the only supported option
                error(`Unrecognized job filter options "${options}"`);
                return false;
            }
            // 1 instead of true because shorter stringificationx
            spec.private = 1;  
        }
        specs.push(spec);
    }
    return specs;
}

function error(msg) {
    var quoted = utils.escapeHTML(msg);
    document.getElementById("status").innerHTML =
        `<font color="red">${quoted}</font>`;
}

async function saveOptions() {
    var hide = document.getElementById("hideJobs").checked;
    var showChanges = document.getElementById("showChanges").checked;
    var results = {titles: [], companies: [], locations: []};
    var jobs = getTextArea("jobs");
    var diverted = getTextAreas("titles", results);
    diverted = getTextAreas("companies", results) || diverted;
    diverted = getTextAreas("locations", results) || diverted;

    if (! (checkRegExps(results["titles"]) &&
           checkRegExps(results["companies"]) &&
           checkRegExps(results["locations"]))) {
        return;
    }

    var jobFilters = parseJobFilters(jobs);
    if (jobFilters === false)
        return;

    // Only store what has changed, or we will too frequently run into the max
    // write per minute limit.
    var newOptions = {
        hideJobs: hide,
        showChanges: showChanges,
        titleRegexps: results["titles"],
        companyRegexps: results["companies"],
        locationRegexps: results["locations"],
        jobFilters: jobFilters
    };

    var oldOptions = await getAllOptions();
    await saveChanges(oldOptions, newOptions);
    if (diverted)
        await restoreOptions();
}

async function getAllOptions() {
    var options = await chrome.storage.sync.get(["hideJobs", "showChanges"]);
    options.titleRegexps = await utils.readListFromStorage("titleRegexps");
    options.companyRegexps = await utils.readListFromStorage("companyRegexps");
    options.locationRegexps =
        await utils.readListFromStorage("locationRegexps");
    options.jobFilters = await utils.readListFromStorage("jobFilters");
    return options;
}

async function saveChanges(oldOptions, newOptions) {
    var status = document.getElementById("status");
    var booleans = {};
    var lists = {}
    var changed = false;
    for (var [key, value] of Object.entries(newOptions)) {
        if (! utils.valuesAreEqual(value, oldOptions[key])) {
            if (typeof(value) == "boolean")
                booleans[key] = value;
            else
                lists[key] = value;
            changed = true;
        }
    }
    if (! changed) {
        status.innerHTML = "<font color='green'>No changes.</font>";
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
        return;
    }
    try {
        await chrome.storage.sync.set(booleans);
        for ([key, value] of Object.entries(lists)) {
            await utils.saveListToStorage(key, value);
        }
        status.innerHTML = "<font color='green'>Options saved.</font>";
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
    }
    catch (error) {
        var msg = utils.escapeHTML(error.message);
        status.innerHTML =
            `<font color='red'>Error saving options: ${msg}</font>`;
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
    }
}

function setTextArea(id, regexps) {
    var elt = document.getElementById(id);
    if (! regexps || ! regexps.length) {
        elt.value = "";
        return;
    }
    elt.value = regexps.join("\n") + (regexps.length ? "\n" : "");
}

function populateJobsArea(filters) {
    if (! filters) return;
    filters = utils.unparseJobFilters(filters);
    document.getElementById("jobs").value = filters.join("\n") +
        (filters.length ? "\n" : "");
    
}

function optionsChanged(changes, namespace) {
    if (namespace != "sync") return;
    restoreOptions();
}

async function restoreOptions() {
    var options = await getAllOptions();

    document.getElementById("hideJobs").checked = options["hideJobs"];

    var show;
    if (options["showChanges"] === undefined)
        show = true;
    else
        show = options["showChanges"];
    document.getElementById("showChanges").checked = show;

    setTextArea("titles", options.titleRegexps);
    setTextArea("companies", options.companyRegexps);
    setTextArea("locations", options.locationRegexps);
    populateJobsArea(options.jobFilters);
}

function checkForSaveKey(event) {
    if (event.isComposing || event.keyCode == 229 || !event.altKey)
        return;
    console.log(event.key);
    if (["s", "S"].includes(event.key))
        saveOptions();
}

async function DOMLoaded() {
    if (navigator.userAgent.includes("Firefox"))
        document.getElementById("alt-s").hidden = true;
    else
        document.addEventListener("keydown", checkForSaveKey);
    await restoreOptions();
}

chrome.storage.onChanged.addListener(optionsChanged);
document.addEventListener("DOMContentLoaded", DOMLoaded);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("hideJobs").addEventListener("change", saveOptions);
document.getElementById("showChanges").addEventListener("change", saveOptions);
