// 問題文とページ数の組を作る
const separatePage = (sentence) => {
    let start = sentence.lastIndexOf('(p.'); // '(p.'を探して切り出すstart位置を決める
    let p = sentence.substr(start + 4, 3); // 数字部分からの3文字を切り出す
    let sentenceOnly = sentence.slice(0, start); // 問題文だけを取り出す
    let pagenum = Number(p.replace(/[^0-9]/g, '')); // 数字だけ取り出す
    return [sentenceOnly, pagenum];
};


// 問題、自分の解答を一つのlist itemにまとめる
const addQA = (listItem, question) => {
    // 問題
    let questionNode = document.createElement('p');
    questionNode.appendChild(document.createTextNode(question));

    // 自分の解答
    let answerElem = document.createElement('input');
    answerElem.setAttribute('size', 160)
    answerElem.setAttribute('id', 'answer' + question);
    let answerNode = document.createElement('p');
    answerNode.appendChild(answerElem);

    listItem.appendChild(questionNode);
    listItem.appendChild(answerNode);
};

// 自分の解答をロードする
const loadAnswer = (qs) => {
    for ( let qKey of qs ){
        let key = 'answer' + qKey;
        let saveValue = localStorage.getItem(key);
        if (saveValue != 'undefined' && saveValue != null){
            document.getElementById(key).value = saveValue;
        }
    }
};

// 自分の解答をセーブする
const saveAnswer = (qKey) => {
    let key = 'answer' + qKey;
    let inputBox = document.getElementById(key);
    localStorage.setItem(key, inputBox.value);
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

// 問題文(key)とページ(value)の連想配列を作成
let dict = {};
for ( let i in list ){
    let [ s , p ] = separatePage(list[i]);
    dict['(p.' + p + ') ' + s] = p;
}

// 問題文をページ順にソート
let questions = [];
for(let q in dict)questions.push(q);
questions.sort((a,b) => dict[a]-dict[b]);

// もとのリストを消す
document.getElementsByTagName('ol')[0].remove();

// 再描画
let newListTable = document.createElement('ul');
let newLi = [];
for ( let i in questions ){
    newLi.push(document.createElement('li'));
    addQA(newLi[newLi.length - 1], questions[i]); // 問題、自分の解答を一つのlist itemにまとめる
}
for ( let v of newLi ){
    newListTable.appendChild(v);
}
let parentDiv = document.getElementsByTagName('font')[3]; // 3番目のfont tagが入れられるべきparentNode
parentDiv.appendChild(newListTable);

// 答えが入力されている場合、localStorageからロードする
loadAnswer(questions);

// inputされた都度localStorageに保存するようなイベントリスナーを設定する
for ( let qKey of questions ){
    let answerNode = document.getElementById('answer' + qKey);
    answerNode.addEventListener('input',() => {
        saveAnswer(qKey);
    }, false);
}
