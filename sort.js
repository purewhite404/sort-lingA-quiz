const makePagenumSentence = (sentence) => {
    let start = sentence.lastIndexOf('(p.'); // '(p.'を探して切り出すstart位置を決める
    let p = sentence.substr(start + 4, 3); // 数字部分からの3文字を切り出す
    let sentenceOnly = sentence.slice(0, start); // 問題文だけを取り出す
    let pagenum = Number(p.replace(/[^0-9]/g, '')); // 数字だけ取り出す
    return [sentenceOnly, pagenum];
}

let allList = [...document.getElementsByTagName('li')];
let list = [];

// 3つまとめた li 要素を除いて問題文だけにする。
for ( let i in allList ){
    if ( i % 4 != 0 ){
        list.push(allList[i].innerText);
    }
}

let dict = {};

// 問題文(key)とページ(value)の連想配列を作成
for ( let v of list ){
    let [ s , p ] = makePagenumSentence(v);
    s = '(p.' + p + ') ' + s;
    dict[s] = p;
}

// 問題文をページ順にソート
let questions=[];
for(let q in dict)questions.push(q);
questions.sort((a,b) => dict[a]-dict[b]);

// 一旦消す
document.getElementsByTagName('ol')[0].remove();

// 再描画
let newListTable = document.createElement('ul');
let newLi = [];
for ( let v of questions ){
    newLi.push(document.createElement('li'));
    newLi[newLi.length - 1].appendChild(document.createTextNode(v));
}
for ( let v of newLi ){
    newListTable.appendChild(v);
}
let parentDiv = document.getElementsByTagName('font')[3]; // 3番目のfont tagが入れられるべきparentNode
parentDiv.insertBefore(newListTable, null);
