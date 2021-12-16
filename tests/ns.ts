import { nsObject } from "xpcom"

class Example extends nsObject implements Ci.nsIObserver {
	readonly _nsI: ReadonlyArray<Xp.nsIID> = [Ci.nsIObserver];
	observe(subject: EventTarget & Ci.nsISupports, topic: string, data: any) {
		// ...
	}
}
