/**
 * getArchMirror
 * @param {string} country
 * @returns Promise<string>
 */
export async function getArchMirror(country) {
    const src = await fetch('https://archlinux.org/mirrorlist/?ip_version=4', {
		  cf: {
				cacheTtl: 3600, // 1 hour
				cacheEverything: true
			}
		}).then(r => r.text())
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

/**
 * getDebianMirror
 * @param {string} country
 * @returns Promise<string>
 */
export function getUbuntuMirror(country) {
  return Promise.resolve(`https://${country.toLowerCase()}.archive.ubuntu.com`)
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
    const pathname =url.pathname.split('/').slice(2).join('/')
    if (url.pathname.startsWith('/archlinux')) {
      const redirect = `${await getArchMirror(country)}/${pathname}`
      return Response.redirect(redirect);
    }
    if (url.pathname.startsWith('/ubuntu')) {
      const redirect = `${await getUbuntuMirror(country)}/${pathname}`
      return Response.redirect(redirect)
    }
    if (url.pathname.startsWith('/debian')) {
      const redirect = `${await getDebianMirror(country)}/${pathname}`
      return Response.redirect(redirect);
    }
		return Response.redirect('https://github.com/tani/geo-mirror')
  }
};
