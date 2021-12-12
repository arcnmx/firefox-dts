// http://man.hubwiz.com/docset/JavaScript.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Using.html

export function exportSymbols(symbols: Record<string, any>): void {
	EXPORTED_SYMBOLS = new Array()
	for (const [key, value] of Object.entries(symbols)) {
		EXPORTED_SYMBOLS.push(key)
		;(globalThis as Record<string, any>)[key] = value
	}
}

/**
 * A class that makes it easier to implement simple xpcom interfaces.
 *
 * ```typescript
 * class Example extends nsObject implements Ci.nsIObserver {
 *   readonly _nsI: ReadonlyArray<Xp.nsIID> = [Ci.nsIObserver];
 *   observe(subject: EventTarget & Ci.nsISupports, topic: string, data: any) {
 *     // ...
 *   }
 * }
 * ```
 */
export abstract class nsObject implements Ci.nsISupports {
	/**
	 * List of `Ci` interfaces implemented by this class.
	 */
	protected abstract readonly _nsI: ReadonlyArray<Xp.nsIID>

	protected implementsInterface<I extends Xp.nsIID>(int: I): this is Xp.InterfaceOf<I> {
		if (int == Ci.nsISupports) {
			return true
		}
		return this._nsI.includes(int)
	}

	QueryInterface<I extends Xp.nsIID>(int: I): Xp.InterfaceOf<I> {
		if (this.implementsInterface(int)) {
			return this
		} else {
			throw `${int} not implemented on ${this}`
		}
	}
}

export const { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm')
export const { Management } = ChromeUtils.import('resource://gre/modules/Extension.jsm')
export const { AppConstants } = ChromeUtils.import('resource://gre/modules/AppConstants.jsm');
export const NS_APP_USER_CHROME_DIR = "UChrm";
