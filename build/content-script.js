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
// Included from button.js
var buttonIconURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEO3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja1VddluwoCH53FbMEQRFdjvHnnNnBLH8+E/V2patu3+p+mUlOhEIE5EOSMu2fv7v5Cxfb4I0XjSGFYHH55BNnMNFeVz5Hsv4c5w+7mAe52RMMkQN1188Ypv6Sk32wRBmcfDAUy5w4HieSn/bjzdB05EZEDKZOQ2kacnxN0DSQr23ZkKJ+3MLRLlrXTuL1mDEE+xj2/bdXZK8K/Djm5shZjM7xFYAbjzMug3Hn6KGIkE9eMOKaxpCQZ3naV0JEfYTqnyo9oLI5ei43d7Q8TxV3S3LY9KnckDxH5Uz9B88+To4f5YUuU8besj+e3mvs556xi+wDUh3mptZWTg56B1wM19HAXrCKR2BCzzvhjqjqglKottgDd6FEDLg6eaqUqVM7aaGCED03wwqGubA7hdEpJy4nen7c1FldctVFgFxO2L3jHQudbpMt5vQW4bkSVJlgjLDk7du8u6D3cRSIbNy5QlzMI9kIYyA3RqgBEeozqXImeN33a+DqgKCMLI8jkpDY4zJxCP3qBO4E2kFRQK8zSFqnAaQIrgXBkAMCQI2cUCCrzEqEREYAlBE648wcQIBEuCJI9s4FYBN5uMYSpVOVhSE2kKOZAQlxwSmwSS4DLO8F9aM+ooayOPEiEkQlSpIcXPBBQggaRlPM6tQbFQ2qGjVpji76KDFEjTGmmBMnh6YpKSRNMaWUM3xmWM5YnaGQ88GHO/wh5giHHvFIRy4on+KLlFC0xJJKrlxdRf+ooWqNNdXcqKGUmm/SQtMWW2q5o9S6M9136aFrjz31vFGbsH6630CNJmp8IjUUdaMGqeoyQaOdyMAMgLHxBMR1QICC5oGZjeQ9D+QGZjah/TlhBCkDs0oDMSDoG7F0WtgZvhAdyP0IN6P+ATf+LnJmQPcmcp9xe4ZaHa+hciJ2ncKRVOtw+jDfYuaYx8vuEzWvJt6l/3VD/dhp6MltVlM+NSxO/5QdyQt5fCuIXHN4r5UhQZ8nn6dWXCZSmEwtyxQtpYOWKc5XRBZ1stSa0GZzXeyhk+OwGFnMUa8wDOp8BuQmY5cBXvapTuc8V1E6VjhL2fAKgdackk4uyHLS0spJiMvfIzVbgJa6crUyGlYAv3K8YqM7NZ+c99FLJqt9h6TLhIa+tpXnZuxAbTE/oQ6VYmapOF7CquFF2bUNfat8LxDz3WLOK/t6MeZMQJFXObxR5c1Jf5gzXy+m22GwLurOg83f3VrTzcWP7cn8blHcyaW1pvUXUJg/DqVHG3aTSMtFjeuI3GuCdx2kXSaH/7qgzHuVV3bddFkerz5kPhw/Km1xlerTo/maGnlvAaW628CDLzMC6euUV/um3V/U/GEgcfejets04thHZHwbfzOQTc0XgdC9pdIubN5vGa9vw99eTpmfNrX/kSHX8Wkz/qP+CwMgtrMjL9k/AAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV/TlopUHOwgopChOtlFRXSrVShChVArtOpgcukXNGlIWlwcBdeCgx+LVQcXZ10dXAVB8APE1cVJ0UVK/F9SaBHjwXE/3t173L0DhGaFaVYgDmh6zUwnE2I2tyqGXuFHAEHMYkRmljEnSSl4jq97+Ph6F+NZ3uf+HH1q3mKATySOM8OsEW8QT2/WDM77xBFWklXic+Jxky5I/Mh1xeU3zkWHBZ4ZMTPpeeIIsVjsYqWLWcnUiKeIo6qmU76QdVnlvMVZq9RZ+578heG8vrLMdZrDSGIRS5AgQkEdZVRQQ4xWnRQLadpPePiHHL9ELoVcZTByLKAKDbLjB/+D391ahckJNymcAIIvtv0xCoR2gVbDtr+Pbbt1AvifgSu94682gZlP0hsdLXoE9G8DF9cdTdkDLneAwSdDNmVH8tMUCgXg/Yy+KQcM3AK9a25v7X2cPgAZ6ip1AxwcAmNFyl73eHdPd2//nmn39wOPtHKyhzyyTwAADXhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6YmRhODZmZWQtM2ViMC00NTgyLWEzZGUtMzBlN2IyMDI1NmFlIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhlZjM4ZWIxLThjYTYtNDM1Yy04N2RlLWEyNjlmZjRkMmRkYiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmRhM2U0YWNkLTAyOWEtNDBmNy04ZTA5LWM3YTQxNWIyNTk0MyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iTGludXgiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjc3OTA5OTM2MDE0MDk4IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMzowMzowNFQwMTowNTozMy0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjM6MDM6MDRUMDE6MDU6MzMtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NjliODkyMi01NzRmLTQ1YjQtODE0OS03ZjBlNDBiZmViY2IiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTAzLTA0VDAxOjA1OjM2LTA1OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PpR6PJMAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAAJYEAACWBAb4S6uMAAAAHdElNRQfnAwQGBSRKrgA7AAABU0lEQVQ4y81SsU4CQRR8e9ndXAi0higJhQU2xk4aS2tJ7iP8Ahu+wW/AAiSxMaGyg+KMNHcFhRcSvAS6E0j2gsfekZfLrhWFhAOsdKqXzMwrZgbgr0EAAGq12mm9Xr8sFovn+Xy+HMdxxTRNHkXRWZqmjDGmSqWSFwQBmqb5HkXR0PM8x7KsV9LpdJ6r1arFOQfGGKxWK6CUAucclFJAKQXDMIAQAkIIKBQKgIiglALXdV+g1WqdhGE40RtARD2fz/V0OtWLxWKT1rPZ7I0QkgMAgF6vdyGllPpAhGE4aTabxz/C6Pf7N4i417xcLj8bjUZ5a6KDweBul1lKKbvd7tXOWnzff9hmRkRl2/b1/l4JyQVBYG8G6jjO7cHjaLfbR0mSfK0f+L7/+OuFCSHc9YPxeHyfpTOyiDiOcX1rrT+ydDSLSNP0SQhR0VqL0Wg0hH+Lb2bHWGh05R6PAAAAAElFTkSuQmCC';
// Original content-script.js.in
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

const cardClasses = ["jobs-search-results__list-item",
                     "jobs-job-board-list__item",
                     "discovery-templates-entity-item"];
const companyClasses = ["job-card-container__primary-description",
                        "job-card-container__company-name"];
const titleClasses = ["job-card-list__title"];
const locationClasses = ["job-card-container__metadata-item"];
const workplaceClasses = ["job-card-container__metadata-item--workplace-type"]
const privateButtonClass = "lijfhidebutton"
var titleRegexps, companyRegexps, locationRegexps, jobFilters, hideJobs;

function getButtonElement() {
    utils.debug("getButtonElement");
    var button = document.createElement("button");
    button.setAttribute("class", privateButtonClass);
    button.setAttribute("style", "background-color: #777;");
    var image = document.createElement("img");
    image.setAttribute("src", buttonIconURL);
    image.setAttribute("title", "Hide without telling LinkedIn");
    button.appendChild(image);
    return button;
}

function findPrivateButton(elt) {
    utils.debug(`findPrivateButton(${utils.id(elt)})`);
    var elts = elt.querySelectorAll(`.${privateButtonClass}`);
    if (elts.length) {
        return elts[0];
    }
    return undefined;
}

function findDismissButton(elt) {
    utils.debug(`findDismissButton(${utils.id(elt)})`);
    var elts = elt.getElementsByTagName("button");
    for (var button of elts) {
        var label = button.getAttribute("aria-label");
        if (label && (label.includes("Hide") || label.includes("Dismiss") ||
                      /^Mark .* with Not for me/.test(label))) {
            return button;
        }
    }
    return null;
}

function findUnhideButton(elt) {
    utils.debug(`findUnhideButton(${utils.id(elt)})`);
    var elts = elt.getElementsByTagName("button");
    for (elt of elts)
        if (elt.innerText == "Undo")
            return elt;
    return null;
}

function getLocation(elt) {
    utils.debug(`getLocation(${utils.id(elt)})`);
    var location = getClassValue(locationClasses, elt)
    if (! location)
        return false;
    var workplace = getClassValue(workplaceClasses, elt)
    if (workplace)
        location = `${location} (${workplace})`;
    return location;
}

function getJobSpec(elt) {
    utils.debug(`getJobspec(${utils.id(elt)})`);
    var spec = {
        title: getClassValue(titleClasses, elt),
        company: getClassValue(companyClasses, elt),
        location: getLocation(elt)
    };
    if (! (spec.title && spec.company && spec.location))
        return null;
    return spec;
}

/*
  State configurations:
  * initial
    * undetermined card visibility
    * undetermined job visibility
    * undetermined private hide button with listener
    * undetermined listener on LinkedIn hide button
    * undetermined undo button listener
  * filtering:
    * undetermined card visibility
    * undetermined job visibility
    * undetermined private hide button with listener
    * undetermined listener on LinkedIn hide button
    * undetermined undo button listener
  * visible-pending:
    * undetermined card visibility
    * undetermined job visibility
    * undetermined private hide button with listener
    * undetermined listener on LinkedIn hide button
    * undetermined undo button listener
  * visible
    * card is visible
    * job is visible 
    * private hide button with listener
    * listener on LinkedIn hide button
    * no undo button listener
  * private-hidden
    * card is hidden
    * job is visible on hidden card
    * no private hide button / listener
    * no listener on LinkedIn hide button
    * no listener on undo button
  * linkedin-hidden-pending
    * undetermined card visibility
    * undetermined job visibility
    * undetermined hide button / listener
    * undetermined on LinkedIn hide button
    * undetermined listener on undo button
  * linkedin-hidden
    * card is visible
    * job is not visible
    * no private hide button / listener
    * no listener on LinkedIn hide button
    * listener on undo button
  * linkedin-hidden-hidejobs
    * card is hidden
    * job is not visible on hidden card
    * no private hide button / listener
    * no listener on LinkedIn hide button
    * no listener on undo button
  State transitions:
  initial:
  * to filtering if jobSpec and dismiss button available
  filtering:
  * to visible-pending if no match and jobSpec and dismiss button available
  * to private-hidden if private hide match
  * to linkedin-hidden-pending if non-private hide match and not hideJobs
    * first click LinkedIn dismiss button
  * to linkedin-hidden-hidejobs if non-private hide match and hideJobs
    * first click LinkedIn dismiss button
  visible-pending:
  * to visible when dismiss button and job spec become available
  * remove job from job hide list if it's there
  visible:
  * to private-hidden if user clicks private hide button
    * add private hide to options
  * to linkedin-hidden-pending if user clicks LinkedIn hide button and not
    hideJobs
    * add non-private hide to options
  * to linkedin-hidden-hidejobs if user clicks LinkedIn hide button and hideJobs
    * add non-private hide to options
  private-hidden:
    None.
  linkedin-hidden-pending:
  * to linkedin-hidden when undo button becomes available
  linkedin-hidden:
  * to visible-pending if user clicks undo button
    * remove hide from options
  linkedin-hidden-hidejobs:
    None.
*/

/*
  Annoyingly, LinkedIn sometimes replaces a node when switching from
  dismissed to not dismissed or vice versa. Wen need to keep an
  internal cache to try to overcome these node changes.
*/

var cardCache = [];

function cardCacheMark() {
    utils.debug("cardCacheMark()");
    for (var i in cardCache)
        cardCache[i].mark = 1;
}

function cardCacheCollect() {
    utils.debug("cardCacheCollect()");
    for (var i = cardCache.length - 1; i >= 0; i--)
        if (cardCache[i].mark)
            cardCache.splice(i, 1);
}

function cardCacheSet(elt, state, jobSpec) {
    utils.debug(`cardCacheSet(${utils.id(elt)}, ${state}, ` +
                `${JSON.stringify(jobSpec)})`);
    var obj;
    for (obj of cardCache)
        if (obj.elt == elt) {
            delete obj.mark;
            obj.state = state;
            if (! obj.jobSpec)
                obj.jobSpec = jobSpec;
            return;
        }
    if (jobSpec)
        for (obj of cardCache)
            if (utils.valuesAreEqual(obj.jobSpec, jobSpec)) {
                delete obj.mark;
                obj.elt = elt;
                obj.state = state;
                return;
            }
    obj = {elt: elt, jobSpec: jobSpec, state: state};
    cardCache.push(obj);
}

function cardCacheGet(elt, jobSpec) {
    utils.debug(`cardCacheGet(${utils.id(elt)}, ${JSON.stringify(jobSpec)})`);
    var obj;
    for (obj of cardCache)
        if (obj.elt == elt) {
            delete obj.mark;
            return obj.state;
        }
    if (jobSpec) {
        for (obj of cardCache)
            if (obj.jobSpec && utils.valuesAreEqual(obj.jobSpec, jobSpec)) {
                delete obj.mark;
                obj.elt = elt;
                return obj.state;
            }
    }
    return undefined;
}            

function getState(elt, jobSpec) {
    utils.debug(`getState(${utils.id(elt)}, ${JSON.stringify(jobSpec)})`);
    var attr = elt.getAttribute("lijfState");
    var cache = cardCacheGet(elt, jobSpec);
    var retval = attr || cache;
    return retval;
}

function setState(elt, jobSpec, state) {
    utils.debug(`setState(${utils.id(elt)}, ${JSON.stringify(jobSpec)}, ` +
                `${state})`);
    cardCacheSet(elt, jobSpec, state);
    elt.setAttribute("lijfState", state);
}

function configureState(elt, jobSpec, state) {
    utils.debug(`configureState(${utils.id(elt)}, ` +
                `${JSON.stringify(jobSpec)}, ${state})`);
    var jobVisible;
    var cardVisible, privateButton, linkedinListener, undoListener;
    if (state == "initial") {
        cardVisible = undefined;
        jobVisible = undefined;
        privateButton = undefined;
        linkedinListener = undefined;
        undoListener = undefined;
    }
    else if (state == "filtering") {
        cardVisible = undefined;
        jobVisible = undefined;
        privateButton = undefined;
        linkedinListener = undefined;
        undoListener = undefined;
    }
    else if (state == "visible-pending") {
        cardVisible = undefined;
        jobVisible = undefined;
        privateButton = undefined;
        linkedinListener = undefined;
        undoListener = undefined;
    }
    else if (state == "visible") {
        cardVisible = true;
        jobVisible = true;
        privateButton = true;
        linkedinListener = true;
        undoListener = false;
    }
    else if (state == "private-hidden") {
        cardVisible = false;
        jobVisible = true;
        privateButton = false;
        linkedinListener = false;
        undoListener = false;
    }
    else if (state == "linkedin-hidden-pending") {
        cardVisible = undefined;
        jobVisible = undefined;
        privateButton = undefined;
        linkedinListener = undefined;
        undoListener = undefined;
    }
    else if (state == "linkedin-hidden") {
        cardVisible = true;
        jobVisible = false;
        privateButton = false;
        linkedinListener = false;
        undoListener = true;
    }
    else if (state == "linkedin-hidden-hidejobs") {
        cardVisible = false;
        // eslint-disable-next-line no-unused-vars
        jobVisible = false;
        privateButton = false;
        linkedinListener = false;
        undoListener = false;
    }
    else {
        throw `Unknown state ${state}`;
    }
    setCardVisible(elt, jobSpec, cardVisible);
    // LinkedIn handles job visibility, we don't touch it.
    setPrivateButton(elt, jobSpec, privateButton);
    setLinkedinListener(elt, jobSpec, linkedinListener);
    setUndoListener(elt, jobSpec, undoListener);
    setState(elt, jobSpec, state);
    return state;
}

function setCardVisible(elt, jobSpec, visible) {
    utils.debug(`setCardVisible(${utils.id(elt)}, ` +
                `${JSON.stringify(jobSpec)}, ${visible})`);
    if (visible == undefined)
        return;
    elt.hidden = !visible;
}

function setPrivateButton(elt, jobSpec, wanted) {
    utils.debug(`setPrivateButton(${utils.id(elt)}, ` +
                `${JSON.stringify(jobSpec)}, ${wanted})`);
    if (wanted == undefined)
        return;
    var oldButton, button, listener;
    oldButton = elt.lijfPrivateButton || undefined;
    if (oldButton) {
        listener = oldButton[1]
        oldButton = oldButton[0]
    }
    button = findPrivateButton(elt) || undefined;
    if (! wanted || (oldButton && oldButton != button)) {
        if (oldButton) {
            if (oldButton != button)
                console.log(`setPrivateButton: mismatch ` +
                            `oldButton=${oldButton} vs button=${button}`);
            oldButton.removeEventListener("click", listener);
            delete elt.lijfPrivateButton;
            oldButton = undefined;
        }
        if (button)
            button.remove();
    }

    if (! wanted)
        return;

    if (oldButton)
        return;

    button = getButtonElement();
    var reference = findDismissButton(elt);
    var parent = reference.parentNode;
    parent.insertBefore(button, reference.nextSibling);
    listener = (event) => {
        hideJob(jobSpec, true);
        event.stopPropagation();
        configureState(elt, jobSpec, "private-hidden");
    };
    button.addEventListener("click", listener);
    elt.lijfPrivateButton = [button, listener];
}

function setLinkedinListener(elt, jobSpec, wanted) {
    utils.debug(`setLinkedinListener(${utils.id(elt)}, ` +
                `${JSON.stringify(jobSpec)}, ${wanted})`);
    setListener(elt, jobSpec, wanted, "lijfDismissButton", findDismissButton,
                () => {
                    hideJob(jobSpec);
                    configureState(elt, jobSpec, hideJobs ?
                                   "linkedin-hidden-hidejobs" :
                                   "linkedin-hidden-pending");
                });
}

function setUndoListener(elt, jobSpec, wanted) {
    utils.debug(`setUndoListener(${utils.id(elt)}, ` +
                `${JSON.stringify(jobSpec)}, ${wanted})`);
    setListener(elt, jobSpec, wanted, "lijfUndoButton", findUnhideButton,
                () => configureState(elt, jobSpec, "visible-pending"));
}

function setListener(elt, jobSpec, wanted, property, finder, listener) {
    utils.debug(`setListener(${utils.id(elt)}, ${JSON.stringify(jobSpec)}, `+
                `${wanted}, ${property}, [finder], [listener])`);
    if (wanted == undefined)
        return;
    var oldButton, oldListener, button;
    oldButton = elt[property] || undefined;
    if (oldButton) {
        oldListener = oldButton[1]
        oldButton = oldButton[0]
    }
    button = finder(elt) || undefined;
    if (! wanted || (oldButton && oldButton != button)) {
        if (oldButton) {
            if (oldButton != button)
                console.log(`setListener: mismatch ` +
                            `oldButton=${oldButton} vs button=${button}`);
            oldButton.removeEventListener("click", oldListener);
            delete elt[property];
            oldButton = undefined;
        }
    }

    if (! wanted)
        return;

    if (oldButton)
        return;

    button.addEventListener("click", listener);
    elt[property] = [button, listener];
}

function filterOneJob(elt) {
    utils.debug(`filterOneJob(${utils.id(elt)})`);
    var jobSpec = getJobSpec(elt);
    var state = getState(elt, jobSpec);
    var button;

    if (! state) {
        /*
          We don't call configureState here because we don't want to put an
          "initial" state into the cache in case when we finally get the
          jobSpec it turns out this is a card LinkedIn replaced and we
          actually know what its state is.
        */
        button = findDismissButton(elt);
        if (! (jobSpec && button))
            return;
        state = configureState(elt, jobSpec, "filtering");
        // fall through
    }

    if (state == "filtering") {
        var result = (matches(jobSpec.title, titleRegexps) ||
                      matches(jobSpec.company, companyRegexps) ||
                      matches(jobSpec.location, locationRegexps) ||
                      jobMatches(jobSpec));
        if (! result) {
            state = configureState(elt, jobSpec, "visible-pending");
            // fall through
        }
        else {
            if (result == "private") {
                state = configureState(elt, jobSpec, "private-hidden")
                return;
            }
            findDismissButton(elt).click();
            state = configureState(elt, jobSpec, hideJobs ?
                                   "linkedin-hidden-hidejobs" :
                                   "linkedin-hidden-pending");
            return;
        }
    }
    
    if (state == "visible-pending") {
        button = findDismissButton(elt);
        if (! (jobSpec && button))  // not ready yet
            return;
        unhideJob(elt, jobSpec);
        state = configureState(elt, jobSpec, "visible");
        return;
    }

    if (state == "linkedin-hidden-pending") {
        button = findUnhideButton(elt)
        if (! button)
            return;
        state = configureState(elt, jobSpec, "linkedin-hidden");
        return;
    }
}

function matches(fieldValue, regexps) {
    utils.debug(`matches(${fieldValue}, ${regexps})`);
    if (! fieldValue) return false;
    return regexps.some(r => r.test(fieldValue));
}

function getClassValue(classes, elt) {
    utils.debug(`getClassValue(${classes}, ${utils.id(elt)})`);
    var selector = classes.map(c => `.${c}`).join(", ");
    var elts = elt.querySelectorAll(selector);
    if (elts.length == 0) return false;
    return elts[0].innerText;
}

function jobMatches(jobSpec) {
    utils.debug(`jobMatches(${JSON.stringify(jobSpec)})`);
    for (var filter of jobFilters) {
        if (filter.title != jobSpec.title ||
            filter.company != jobSpec.company ||
            filter.location != jobSpec.location)
            continue;
        return filter.private ? "private" : "linkedin";
    }
    return false;
}

function hideJob(jobSpec, isPrivate) {
    utils.debug(`hideJob(${JSON.stringify(jobSpec)}, ${isPrivate})`);
    // Don't list a job explicitly if it's already filtered by the regular
    // expressions, presumably because the user just edited them to include it,
    // or if it's already listed. This could happen if user hides a job and then
    // unhides it and then we detect the DOM change and scan the job again,
    // generating an artificial click event which causes this function to be
    // called. (This shouldn't happen anymore with recent code improvements but
    // I'm leaving this in as a precautionary measure.)
    if (matches(jobSpec.title, titleRegexps) ||
        matches(jobSpec.company, companyRegexps) ||
        matches(jobSpec.location, locationRegexps) ||
        jobMatches(jobSpec))
        return;
    if (isPrivate) {
        jobSpec = structuredClone(jobSpec);
        // 1 instead of true because shorter stringification
        jobSpec.private = 1;
    }
    jobFilters.unshift(jobSpec);
    utils.saveListToStorage("jobFilters", jobFilters).then();
}

function unhideJob(elt, jobSpec) {
    utils.debug(`unhideJob(${utils.id(elt)}, ${JSON.stringify(jobSpec)})`);
    // Find the job details, check if they're in jobFilters, and remove them
    // if so.
    var changed = false;
    for (var i = jobFilters.length - 1; i >= 0; i--)
        if (utils.valuesAreEqual(jobFilters[i], jobSpec)) {
            changed = true;
            jobFilters.splice(i, 1);
        }
    if (changed)
        utils.saveListToStorage("jobFilters", jobFilters).then();
    return changed;
}

var filterTimeout;

function filterEverything() {
    utils.debug("filterEverything()");
    cardCacheMark();
    if (filterTimeout)
        clearTimeout(filterTimeout);
    filterTimeout = setTimeout(cardCacheCollect, 5000);
    var elts = document.querySelectorAll(
        cardClasses.map(c => `.${c}`).join(", "));
    for (var elt of elts) {
        filterOneJob(elt);
    }
}

async function loadOptions() {
    utils.debug("loadOptions()");
    titleRegexps = utils.compileRegexps(
        await utils.readListFromStorage("titleRegexps"));
    companyRegexps = utils.compileRegexps(
        await utils.readListFromStorage("companyRegexps"));
    locationRegexps = utils.compileRegexps(
        await utils.readListFromStorage("locationRegexps"));
    jobFilters = await utils.readListFromStorage("jobFilters");
    var options = await chrome.storage.sync.get(["hideJobs"]);
    hideJobs = options["hideJobs"];
}

var topObserver = null;

async function createTopObserver() {
    utils.debug("createTopObserver()");
    var config = {childList: true, subtree: true};
    // eslint-disable-next-line no-unused-vars
    var callback = (mutationList, observer) => {
        filterEverything();
    };
    topObserver = new MutationObserver(callback);
    topObserver.observe(document.body, config);
    filterEverything();
}

loadOptions()
    .then(() => createTopObserver());
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace != "sync") return;
    loadOptions();
});
