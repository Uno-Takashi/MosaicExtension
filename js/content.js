function GenerateString() {
    var LENGTH = 10;
    var WORDS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var r = "";
    for(var i = 0; i < LENGTH; i++){
      r += WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    return r;
}
function sanitize(range){
    // 開始点がテキストノードの中だったら
    if(range.startContainer.nodeType == Node.TEXT_NODE){
      // テキストノードをRangeの開始点の位置で2つに分ける
      var latter = range.startContainer.splitText(range.startOffset);
      // Rangeの開始点をテキストノードの外側にする
      range.setStartBefore(latter);
    }
    // 終了点にも同様の処理
    if(range.endContainer.nodeType == Node.TEXT_NODE){
      var latter = range.endContainer.splitText(range.endOffset);
      range.setEndBefore(latter);
    }
}
function checkNode(node, range){
    // 新しいRangeを作る
    var nodeRange = new Range();
    // nodeRangeの範囲をnodeを囲むように設定
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 &&
       range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
      // nodeRangeはrangeに囲まれている
      // → このノード全体を着色して終わり
      if(node.nodeType == Node.TEXT_NODE){
        // テキストノードの場合はspanで囲む
        var cname=GenerateString()
        var span = document.createElement(cname);
        // まずspanをテキストノードの直前に設置
        node.parentNode.insertBefore(span, node);
        // テキストノードをspanの中に移す
        span.appendChild(node);
        spoilerAlert(cname);
      }else{
        // テキストノードでない場合は普通に着色
        console.log(node.tagName)
        var cname=GenerateString();

        //node.setAttribute('style',"pointer-events: none;");
        node.setAttribute('class',cname);
        spoilerAlert("."+cname);
      }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 ||
              range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
      // nodeRangeとrangeは重なっていない
      // →このノードをこれ以上調べる必要はない
      return;
    }else{
      // このノードは一部rangeに含まれている
      for(var i=0; i<node.childNodes.length; i++){
        // 子ノードをひとつずつ調べる
        checkNode(node.childNodes[i], range);
      }
    }
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        console.log("Mosaic activate");
        // mosaic process
        // 選択範囲のオブジェクト取得
        var sel = window.getSelection();
        if(!sel.rangeCount) {
            console.log("Not Selected");
         } //範囲選択されている箇所がない場合は何もせず終了
      
         if(sel.rangeCount > 0){
           var range = sel.getRangeAt(0);
 
           sanitize(range);
           checkNode(document.body, range);
         }

/*         var cname=GenerateString()
        var newNode = document.createElement(cname);
        newNode.setAttribute('class',"sp")
        newNode.innerHTML = sel.toString();
        range.deleteContents();    // 範囲選択箇所を一旦削除
        range.insertNode(newNode); // 範囲選択箇所の先頭から、修飾したspanを挿入
        spoilerAlert(cname);
        console.log("Eed Prosess"); */
    }
  );