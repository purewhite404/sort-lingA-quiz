// 問題文とページ数の組を作る
const makePagenumSentence = (sentence) => {
    let start = sentence.lastIndexOf('(p.'); // '(p.'を探して切り出すstart位置を決める
    let p = sentence.substr(start + 4, 3); // 数字部分からの3文字を切り出す
    let sentenceOnly = sentence.slice(0, start); // 問題文だけを取り出す
    let pagenum = Number(p.replace(/[^0-9]/g, '')); // 数字だけ取り出す
    return [sentenceOnly, pagenum];
};


// 問題、自分の解答、セーブボタンを一つのlist itemにまとめる
const addQA = (listItem, question, qNumber) => {
    // 問題
    let questionNode = document.createElement('p');
    questionNode.appendChild(document.createTextNode(question));
    questionNode.setAttribute('class', 'qa' + qNumber);

    // 自分の解答
    let answerElem = document.createElement('input');
    answerElem.setAttribute('size', 160)
    answerElem.setAttribute('id', 'answer' + qNumber);
    let answerNode = document.createElement('p');
    answerNode.appendChild(answerElem);
    answerNode.setAttribute('class', 'qa' + qNumber);

    listItem.appendChild(questionNode)
    listItem.appendChild(answerNode)
};

// 自分の解答をロードする
const loadAnswer = (list) => {
    for ( let qNumber in list ){
        let key = 'answer' + qNumber;
        let saveValue = localStorage.getItem(key);
        if (saveValue != 'undefined'){
            document.getElementById(key).value = saveValue;
        }
    }
};

// 一旦HTML内の li 要素をすべて取得
let allList = [...document.getElementsByTagName('li')];
let list = [];

// allList から3つまとめた li 要素を除いて問題文だけにする。
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

// もとのリストを消す
document.getElementsByTagName('ol')[0].remove();

// 再描画
let newListTable = document.createElement('ul');
let newLi = [];
for ( let i in questions ){
    newLi.push(document.createElement('li'));
    addQA(newLi[newLi.length - 1], questions[i], i); // 問題、自分の解答、セーブボタンを一つのlist itemにまとめる
}
for ( let v of newLi ){
    newListTable.appendChild(v);
}
let parentDiv = document.getElementsByTagName('font')[3]; // 3番目のfont tagが入れられるべきparentNode
parentDiv.appendChild(newListTable);
loadAnswer(list);

// 保存ボタンを追加
let button = document.createElement('button');
button.appendChild(document.createTextNode('save'));
button.setAttribute('onclick', 'saveAnswer(' + list.length + ')');
parentDiv.appendChild(button); // parentNodeは同じくfont tag(3)

// 保存するスクリプトを追加
let scriptTag = document.createElement('script');
let script = " const saveAnswer = (num) => { for (let i = 0; i < num; i++){ let key = 'answer' + i; let inputBox = document.getElementById(key); localStorage.setItem(key, inputBox.value); } }; ";
let scriptNode = document.createTextNode(script);
scriptTag.appendChild(scriptNode);
let htmlTag = document.getElementsByTagName('html');
htmlTag[0].appendChild(scriptTag);
/* 可読性のあるscript
const saveAnswer = (num) => {
    for (let i = 0; i < num; i++){
        let key = 'answer' + i;
        let inputBox = document.getElementById(key);
        localStorage.setItem(key, inputBox.value);
    }
};*/
