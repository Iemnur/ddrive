const https = require('https')
const path = require('path')
const debugError = require('debug')('error')

class Util {
    /**
     * Pretty print error
     * @param error
     * @param extra
     */
    static errorPrint(error, extra = {}) {
        let err = `${'=== Begin Error ===\n---\n'
        + 'Error: '}${error.message}\n`
        const extraArray = Object.keys(extra).map((e) => `${e} : ${extra[e]}`).join('\n')
        err += extraArray
        err += `\nStack: ${error.stack}\n---\n=== End Error ===`

        debugError(err)
    }

    /**
     *  Format bytes as human-readable text.
     * @param bytes Number of bytes.
     * @param si True to use metric (SI) units, aka powers of 1000. False to use
     *           binary (IEC), aka powers of 1024.
     * @param dp Number of decimal places to display.
     * @returns {string} Formatted string.
     */
    static humanReadableSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024

        if (Math.abs(bytes) < thresh) {
            return `${bytes} B`
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        let u = -1
        const r = 10 ** dp

        do {
            // eslint-disable-next-line no-param-reassign
            bytes /= thresh
            u += 1
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

        return `${bytes.toFixed(dp)} ${units[u]}`
    }

    /**
     * Download file using native https library
     * @param {String} url
     * @return {Promise<Buffer>}
     */
    static downloadFile(url) {
        return new Promise((resolve, reject) => {
            const chunks = []
            https.get(url, (res) => {
                res.on('data', (data) => chunks.push(data))
                res.on('error', (err) => reject(err))
                res.on('end', () => resolve(Buffer.concat(chunks)))
            })
        })
    }

    /**
     * Normalize path
     * @param {String} p
     * @return {string}
     */
    static normalizePath(p) {
        let r = path.posix.normalize(p.replace(/\\/g, '/'))
        if (r.endsWith('/') && r !== '/') r = r.slice(0, -1)

        return r.startsWith('/') ? r : `/${r}`
    }

    /**
     * Safe parse JSON string
     * @param {String} string
     * @return {undefined|any}
     */
    static safeParse(string) {
        try {
            return JSON.parse(string)
        } catch (err) {
            return undefined
        }
    }

    /**
     * Explode path with sub directories
     * @param {String} p
     * @return {string[]}
     */
    static explodePath(p) {
        const pathArray = Util.normalizePath(p).split('/').filter((pe) => pe !== '')

        const explodedArray = pathArray
            .map((pe, index) => pathArray.slice(0, index + 1).join('/'))
            .map((pe) => `/${pe}`)
        explodedArray.unshift('/')

        return explodedArray
    }

    /**
     * Convert bytes to human readable format
     * @param bytes
     * @param si
     * @param dp
     * @return {string}
     */
    static humanFileSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024

        if (Math.abs(bytes) < thresh) {
            return `${bytes} B`
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        let u = -1
        const r = 10 ** dp

        do {
            // eslint-disable-next-line no-param-reassign
            bytes /= thresh
            u += 1
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

        return `${bytes.toFixed(dp)} ${units[u]}`
    }
}

module.exports = Util

