const readline = require("readline");

var debug = false;

class DeterminantMatrix {
	constructor(matrixValues, matrixCoefficent=1) {
		this.rowCount = matrixValues.length;
		this.columnCount = matrixValues[0].length;
		this.matrixValues = matrixValues;
		this.matrixCoefficent = matrixCoefficent;
	}

	// for now we will always try to find the determinet using cofactor expansion on the first row
	calculateDeterminant() {
		if(debug) {
			console.log(`Trying to calculate determinant of ${this.rowCount}x${this.columnCount} matrix.`);
		}

		if(this.rowCount == 1 && this.columnCount == 1) {
			return this.matrixValues[0] * this.matrixCoefficent;
		} else {
			// This will produce the determine matrixes for the given matrix
			let newMatrixes = [];
			for (let matrixNumber = 0; matrixNumber < this.columnCount; ++matrixNumber) {
				let matrixValues = [];
				let matrixCoefficent = Math.pow(-1, 1+(matrixNumber+1)) * this.matrixValues[0][matrixNumber];
				for (let row = 1; row < this.rowCount; ++row) {
					let rowValues = [];
					for (let column = 0; column < matrixNumber; ++column) {
						rowValues.push(this.matrixValues[row][column]);
					}
					for (let column = matrixNumber+1; column < this.columnCount; ++column) {
						rowValues.push(this.matrixValues[row][column]);
					}
					matrixValues.push(rowValues);
				}
				newMatrixes.push(new DeterminantMatrix(matrixValues, matrixCoefficent));
			}
			return this.matrixCoefficent * newMatrixes.reduce((accumulation, matrix)=>{
				let matrixDeterminantValue = matrix.calculateDeterminant();
				if (debug) {
					console.log(`${matrixDeterminantValue}`);
				}
				return accumulation + matrixDeterminantValue;
			}, 0);
		}
	}
}
let matrixValues = [];

const userInput = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log(`Input an n x n matrix.`);

userInput.on('line', (input)=>{
	matrixValues.push(input.trim().split(` `));

	if (matrixValues.length > 0 && matrixValues.length == matrixValues[0].length) {
		if (debug) {
			console.log(`Calculating the determinant of:`);
			matrixValues.forEach((row)=>{
				console.log(row);
			});
			console.log(matrixValues);
		}
		let matrix = new DeterminantMatrix(matrixValues);
		console.log(`Determinant: ${matrix.calculateDeterminant()}`);
		matrixValues = [];
	}
});


/*
matrixValues = [
	[1, 2, 3],
	[2, 3, 4],
	[3, 4, 5],
];
*/
/*
*/