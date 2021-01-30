// ページ番号を取り出す
// 複数ページの場合一番最初のページ
const sliceFirst = (allpage) => {
    let p = allpage.slice(4); // '(p. 'を除く
    let result = '';
    while ( !isNaN(p[0]) && p[0] != ' '){
        result += p[0];
        p = p.slice(1); // pから最初の文字を消す
    }
    return result;
};

// 問題文と最初のページ数と全ページ数の組(sentence, pagenum(num), allpage(num-num))を作る
const separatePage = (sentence) => {
    const start = sentence.lastIndexOf('(p.'); // '(p.'を探して切り出すstart位置を決める
    const allpage = sentence.slice(start); //全ページを取り出す（特に複数にまたがるページ）
    const sentenceOnly = sentence.slice(0, start-1); // 問題文だけを取り出す
    const pagenum = Number(sliceFirst(allpage));
    return [sentenceOnly, pagenum, allpage];
};


// 問題、自分の解答を一つのlist itemにまとめる
const addQA = (listItem, question) => {
    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', 'check' + question);

    // 問題
    const questionNode = document.createElement('p');
    questionNode.appendChild(checkbox)
    questionNode.appendChild(document.createTextNode(question));

    // 自分の解答
    const answerElem = document.createElement('input');
    answerElem.setAttribute('size', 160);
    answerElem.setAttribute('id', 'answer' + question);
    const answerNode = document.createElement('p');
    answerNode.appendChild(answerElem);

    listItem.appendChild(questionNode);
    listItem.appendChild(answerNode);
};

// 自分の解答をロードする
const loadAnswer = (qKey) => {
    const key = 'answer' + qKey;
    const saveValue = localStorage.getItem(key);
    document.getElementById(key).value = saveValue;
};

// 自分のチェックボックスをロードする
const loadChecked = (qKey) => {
    const key = 'check' + qKey;
    const saveValue = localStorage.getItem(key);
    document.getElementById(key).checked = JSON.parse(saveValue);
};

// 自分の解答をセーブする
const saveAnswer = (qKey) => {
    const key = 'answer' + qKey;
    const inputBox = document.getElementById(key).value;
    localStorage.setItem(key, inputBox);
};

// 自分のチェックボックスをセーブする
const saveChecked = (qKey) => {
    const key = 'check' + qKey;
    const checkBox = document.getElementById(key).checked;
    localStorage.setItem(key, checkBox);
};

// 一旦HTML内の li 要素をすべて取得
const allList = [...document.getElementsByTagName('li')];
let list = [];

// allList から3つまとめた li 要素を除いて問題文だけにする。（生徒はちょうど3つだけ問題を作るから）
for ( let i in allList ){
    if ( i % 4 !== 0 ){
        list.push(allList[i].innerText);
    }
}

// 問題文(key)とページ(value)の連想配列を作成
let dict = {};
for ( let i in list ){
    const [ s, p, a ] = separatePage(list[i]);
    dict[a + s] = p;
}

// 問題文をページ順にソート
let questions = [];
for(let q in dict)questions.push(q);
questions.sort((a,b) => dict[a]-dict[b]);

// もとのリストを消す
document.getElementsByTagName('ol')[0].remove();

// 再描画
const newListTable = document.createElement('ol');
let newLi = [];
for ( let i in questions ){
    newLi.push(document.createElement('li'));
    addQA(newLi[newLi.length - 1], questions[i]); // 問題、自分の解答を一つのlist itemにまとめる
}
for ( let v of newLi ){
    newListTable.appendChild(v);
}
const parentDiv = document.getElementsByTagName('font')[3]; // 3番目のfont tagが入れられるべきparentNode
parentDiv.appendChild(newListTable);

// 答えが入力されている場合、localStorageからロードする
for (let qKey of questions){
    loadAnswer(qKey);
    loadChecked(qKey);
}

// inputされた都度localStorageに保存するようなイベントリスナーを設定する
for ( let qKey of questions ){
    const answerNode = document.getElementById('answer' + qKey);
    const checkboxNode = document.getElementById('check' + qKey);
    answerNode.addEventListener('input',() => saveAnswer(qKey), false);
    checkboxNode.addEventListener('click',() => saveChecked(qKey), false);
}
