chrome.contextMenus.create({
    "title" : "選択範囲をモザイクで隠す",
    "type"  : "normal",
    "contexts" : ["selection"],
	"onclick": function(info) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {greeting: "hello"});
		});
	}
  });

console.log("Background activate");