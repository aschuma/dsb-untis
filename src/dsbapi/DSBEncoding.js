import { deflate } from 'pako';

function btoa(b) {
    return Buffer.from(b).toString('base64');
}

/**
 *
 * @private
 * @param {*} ObjectToEncode
 */
export default function Encode(ObjectToEncode) {
	let b = deflate(JSON.stringify(ObjectToEncode), {
		to: 'string',
		gzip: !0
	});
	return (b = btoa(b));
}

