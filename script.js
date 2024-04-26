async function loadBingoSentences() {
	try {
		const response = await fetch('bingoPhrases.json');
    	const text = await response.json();
    	return text.bingoPhrases;
	} catch (error) {
		console.error('Failed to laoad bingo sentences', error);
		return []
	}
}

function shuffleArray(arr) {
	for (let i = arr.length-1; i>0; i--){
		const j = Math.floor(Math.random()*(i+1));
		temp = arr[j]
		arr[j] = arr[i]
		arr[i] = temp	
	}
	return arr;
}

async function getSentences(){
	const sentences = await loadBingoSentences();
	const shuffledSentences = shuffleArray(sentences);
	return shuffledSentences;
}

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('bingoGrid');
	grid.innerHTML = '';
    const message = document.getElementById('message');
    let squares = new Array(5).fill(null).map(()=> Array(5).fill(null));

    async function populateGrid() {
		var sentences =  await getSentences();
		sentences.splice(12, 0, '')
        for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
			const square = document.createElement('div');
			square.textContent = sentences[i*5+j];
			square.addEventListener('click', function() {toggleMark(square)});
			grid.appendChild(square);
			squares[i][j] = square;
        	}
    	}
		grid.childNodes[12].classList.toggle('marked');
		grid.childNodes[12].classList.add('middle');
		

	}

    function toggleMark(square) {
        square.classList.toggle('marked');
        checkBingo();
    }
	function allMarked(arr){
		return arr.every(sq => sq.classList.contains('marked'))
	}
    function checkBingo() {
        let hasBingo = false;
		const bingoColumn = (n, arr=squares) => arr.map(x=>x[n])
        // Check rows
        for(const row of squares){
			if (allMarked(row)) hasBingo =  true
		}
		// Check columns and diag		
		var diag1 = []
		var diag2 = []
		for(i=0;i<5;i++){
			if (allMarked(bingoColumn(i))) hasBingo =  true
			diag1.push(squares[i][i])
			diag2.push(squares[i][4-i])
    	}
		if (allMarked(diag1) || allMarked(diag2)) hasBingo = true
		message.textContent = hasBingo ? 'Bingo!' : '';
	}
    populateGrid();
});

function resetBingo(){
	const grid = document.getElementById('bingoGrid')
	grid.childNodes.forEach(a => a.classList.remove('marked'))
	grid.childNodes[12].classList.toggle('marked');
	document.getElementById('message').textContent = '';
}
const btn = document.getElementById('button')
btn.addEventListener('click', resetBingo)