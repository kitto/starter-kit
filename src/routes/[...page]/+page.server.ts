import { mail } from 'postboi/kit'

// postboi owns the FormData parsing, the HTML table, the escaping and the honeypot. The
// recipient comes from POSTBOI_TO, and mail goes out from the Postboi project's sending address.
export const actions = {
	contact: mail
}
