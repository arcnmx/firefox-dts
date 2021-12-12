namespace test_services {
	const { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm');
	const NS_APP_USER_CHROME_DIR = "UChrm";

	console.log(Services.dirsvc.get(NS_APP_USER_CHROME_DIR, Ci.nsIFile));

	const sss: Ci.nsIStyleSheetService = Cc["@mozilla.org/content/style-sheet-service;1"]
		.getService(Ci.nsIStyleSheetService);
	console.assert(sss.AGENT_SHEET == Ci.nsIStyleSheetService.AGENT_SHEET);
}
