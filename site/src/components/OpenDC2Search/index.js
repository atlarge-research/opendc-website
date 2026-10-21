import { useSyncExternalStore } from 'react'
import { processTreeStatusOfSearchResults } from '@easyops-cn/docusaurus-search-local/dist/client/client/utils/processTreeStatusOfSearchResults'
import styles from './styles.module.css'

// The search index contains every page, including the OpenDC2 documentation. The search bar and the search page
// (src/theme/SearchBar and src/theme/SearchPage) leave out OpenDC2 results unless the visitor ticks "Include OpenDC2
// results". The migration guide is always included, as it is useful to everyone who still has OpenDC2 experiments.
const OPENDC2_PATH = 'learn/opendc-2/'
const MIGRATION_GUIDE_PATH = 'learn/opendc-2/migrating-to-opendc-3'
const STORAGE_KEY = 'opendc.search.includeOpenDC2'

// The search page URL parameter that passes the choice of the search bar on to the search page.
export const OPENDC2_SEARCH_PARAM = 'opendc2'

// How many results the search bar asks the search worker for, before leaving out the OpenDC2 results. This is the same
// limit as the search page, so both count the same number of hidden OpenDC2 results.
export const OPENDC2_SEARCH_LIMIT = 100

export function isOpenDC2Url(url, baseUrl) {
    return url.startsWith(baseUrl + OPENDC2_PATH) && !url.startsWith(baseUrl + MIGRATION_GUIDE_PATH)
}

// The choice of the visitor is kept in localStorage: true, false, or null when the visitor has not chosen yet.
const listeners = new Set()
let stored

function getStored() {
    if (stored === undefined) {
        try {
            const value = window.localStorage.getItem(STORAGE_KEY)
            stored = value === null ? null : value === 'true'
        } catch (e) {
            stored = null
        }
    }
    return stored
}

function subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

export function setIncludeOpenDC2(value) {
    stored = value
    try {
        window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch (e) {
        // Without storage, the choice still holds until the page is reloaded.
    }
    listeners.forEach((listener) => listener())
}

/**
 * Whether OpenDC2 results are included. When the visitor has not chosen yet, `fallback` is used: the search bar
 * includes OpenDC2 results on OpenDC2 pages, and the search page follows the search bar it was opened from.
 */
export function useIncludeOpenDC2(fallback) {
    const value = useSyncExternalStore(subscribe, getStored, () => null)
    return value === null ? fallback : value
}

/** The number of OpenDC2 results that are left out when `includeOpenDC2` is not set. */
export function countHiddenOpenDC2Results(results, includeOpenDC2, baseUrl) {
    return includeOpenDC2 ? 0 : results.filter((result) => isOpenDC2Url(result.document.u, baseUrl)).length
}

/**
 * Leaves out the OpenDC2 results unless `includeOpenDC2` is set, keeps at most `limit` results, and recomputes which
 * results are grouped under the same page.
 */
export function filterSearchResults(results, includeOpenDC2, baseUrl, limit = Infinity) {
    const kept = (includeOpenDC2 ? results : results.filter((result) => !isOpenDC2Url(result.document.u, baseUrl)))
        .slice(0, limit)
    for (const result of kept) {
        delete result.isInterOfTree
        delete result.isLastOfTree
    }
    processTreeStatusOfSearchResults(kept)
    return kept
}

export const openDC2BadgeClassName = styles.badge

/**
 * Adds an "OpenDC2" label to the HTML of a search bar suggestion of an OpenDC2 page, just before its action icon.
 */
export function withOpenDC2Badge(html, suggestion, baseUrl, actionClassName) {
    if (!isOpenDC2Url(suggestion.document.u, baseUrl)) {
        return html
    }
    const badge = `<span class="${styles.badge}">OpenDC2</span>`
    const action = html.lastIndexOf(`<span class="${actionClassName}"`)
    return action === -1 ? html + badge : html.slice(0, action) + badge + html.slice(action)
}

/**
 * The "Include OpenDC2 results" checkbox at the top of the search bar suggestions, with the number of OpenDC2 results
 * it hides. The suggestions are plain DOM, rendered by autocomplete.js, so this is not a React component.
 */
export function createOpenDC2Toggle(checked, hiddenCount, onChange) {
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.checked = checked
    input.addEventListener('change', () => onChange(input.checked))

    const label = document.createElement('label')
    label.className = styles.toggle
    label.append(input, hiddenCount > 0 ? `Include OpenDC2 results (${hiddenCount} hidden)` : 'Include OpenDC2 results')
    return label
}

export const openDC2ToggleClassName = styles.toggle

export const openDC2HiddenResultsClassName = styles.hiddenResults
