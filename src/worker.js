/**
 * getArchMirror
 * @param {string} country
 * @returns Promise<string>
 */
export async function getArchMirror(country) {
    const src = await fetch('https://archlinux.org/mirrorlist/?ip_version=4').then(r => r.text())
    const re = /Server = (https?:\/\/.*)\/\$repo\/os\/\$arch/g
    const mirrors = {}
    let match
    while (match = re.exec(src)) {
        const url = new URL(match[1])
        const tld = url.hostname.split('.').pop()
        mirrors[tld] = url.toString()
    }
    if (country.toLowerCase() in mirrors) {
      return mirrors[country.toLowerCase()]
    } else {
      return 'https://geo.mirror.pkgbuild.com'
    }
}


/**
 * getDebianMirror
 * @param {string} country
 * @returns Promise<string>
 */
export function getDebianMirror(country) {
    return Promise.resolve(`https://ftp.${country.toLowerCase()}.debian.org`)
}


export default {
  /**
   * fetch
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async fetch(request) {
    const url = new URL(request.url);
    const country = /** @type {string} */ (request.cf.country);
    if (url.pathname.startsWith('/archlinux')) {
      const pathname =url.pathname.split('/').slice(2).join('/')
      const redirect = `${await getArchMirror(country)}/${pathname}`
      return Response.redirect(redirect);
    }
    if (url.pathname.startsWith('/debian')) {
      const pathname =url.pathname.split('/').slice(2).join('/')
      const redirect = `${await getDebianMirror(country)}/${pathname}`
      return Response.redirect(await getDebianMirror(country));
    }
  }
};
