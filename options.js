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

function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}

function checkRegExps(regexps) {
    for (var regexp of regexps) {
        try {
            var compiled = new RegExp(regexp);
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
        if (specArray.length > 3) {
            error(`Too many fields in "${specString}"`);
            return false;
        }
        specs.push({
            title: specArray[0],
            company: specArray[1],
            location: specArray[2]
        });
    }
    return specs;
}

function error(msg) {
    quoted = escapeHTML(msg);
    document.getElementById("status").innerHTML =
        `<font color="red">${quoted}</font>`;
}

function saveOptions() {
    var hide = document.getElementById("hideJobs").checked;
    var showChanges = document.getElementById("showChanges").checked;
    var titles = getTextArea("titles");
    var companies = getTextArea("companies");
    var locations = getTextArea("locations");
    var jobs = getTextArea("jobs");

    if (! (checkRegExps(titles) &&
           checkRegExps(companies) &&
           checkRegExps(locations))) {
        return;
    }

    var jobFilters = parseJobFilters(jobs);
    if (jobFilters === false)
        return;

    // Only store what has changed, or we will too frequently run into the max
    // write per minute limit.
    newOptions = {
        hideJobs: hide,
        showChanges: showChanges,
        titleRegexps: titles,
        companyRegexps: companies,
        locationRegexps: locations,
        jobFilters: jobFilters
    };

    chrome.storage.sync.get().then((oldOptions) => {
        saveChanges(oldOptions, newOptions);
    });
}

function valuesAreEqual(value1, value2) {
    if (Array.isArray(value1)) {
        if (!Array.isArray(value2)) return false;
        if (value1.length != value2.length) return false;
        for (var i = 0; i < value1.length; i++)
            if (! valuesAreEqual(value1[i], value2[i])) return false;
        return true;
    }
    if (typeof(value1) == "object") {
        if (typeof(value2) != "object") return false;
        if (Object.keys(value1).length != Object.keys(value2).length)
            return false;
        for (var [key, value] of Object.entries(value1))
            if (! valuesAreEqual(value, value2[key])) return false;
        return true;
    }
    return value1 == value2;
}

function saveChanges(oldOptions, newOptions) {
    var changes = {};
    var changed = false;
    for (var [key, value] of Object.entries(newOptions)) {
        if (! valuesAreEqual(value, oldOptions[key])) {
            changes[key] = value;
            changed = true;
            console.log(`Saving ${key}=${value}`);
        }
    }
    if (! changed) {
        var status = document.getElementById("status");
        status.innerHTML = "<font color='green'>No changes.</font>";
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
        return;
    }
    chrome.storage.sync.set(changes).then(() => {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.innerHTML = "<font color='green'>Options saved.</font>";
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
    }).catch((error) => {
        var status = document.getElementById("status");
        var msg = escapeHTML(error.message);
        status.innerHTML =
            `<font color='red'>Error saving options: ${msg}</font>`;
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
    });
}

function setTextArea(id, regexps) {
    var elt = document.getElementById(id);
    if (! regexps || ! regexps.length) {
        elt.value = "";
        return;
    }
    elt.value = regexps.join("\n") + "\n";
}

function populateJobsArea(filters) {
    if (! filters) return;
    filters = filters.map(f => `${f.title} // ${f.company} // ${f.location}`)
    document.getElementById("jobs").value = filters.join("\n") + "\n";
}

function optionsChanged(changes, namespace) {
    if (namespace != "sync") return;
    if (changes.jobFilters?.newValue === undefined) return;
    populateJobsArea(changes.jobFilters.newValue)
}

function restoreOptions() {
    chrome.storage.onChanged.addListener(optionsChanged);
    chrome.storage.sync.get().then((options) => {
        // Backward compatibility, remove eventually
        if (options["jobRegexps"] && !options["titleRegexps"])
            options["titleRegexps"] = options["jobRegexps"];
        document.getElementById("hideJobs").checked = options["hideJobs"];
        if (options["showChanges"] === undefined)
            show = true;
        else
            show = options["showChanges"];
        document.getElementById("showChanges").checked = show;
        setTextArea("titles", options["titleRegexps"]);
        setTextArea("companies", options["companyRegexps"]);
        setTextArea("locations", options["locationRegexps"]);
        populateJobsArea(options["jobFilters"]);
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("hideJobs").addEventListener("change", saveOptions);
document.getElementById("showChanges").addEventListener("change", saveOptions);
