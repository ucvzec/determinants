const prime_numbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
//http://www.math.odu.edu/~bogacki/cgi-bin/lat.cgi
class MatrixRow {
	constructor(rowData, rowNumber){
		this.rowData = rowData;
		this.rowNumber = rowNumber;
	}
	getEntry(columnPosition) {
		return this.rowData[columnPosition];
	}
	getRowData() {
		return this.rowData;
	}
	rowOperation(manipulatorRow, targetRowCoefficient=1, manipulatorCoefficient=1) {
		for(let columnPos = 0; columnPos < this.rowData.length; ++columnPos) {
			this.rowData[columnPos] *= targetRowCoefficient;
			this.rowData[columnPos] -= manipulatorRow.getEntry(columnPos)*manipulatorCoefficient;
		}
	}
	rowOperationCompadible(candidateRow) {
		//This means that the row is looking at itself.
		if(this === candidateRow) {
			console.log(`Row ${candidateRow.toString()} was rejected for being equal to this row.`);
			return false;
		}
		if(candidateRow.getRowData().reduce((accum, entry)=>entry==0)) {
			console.log(`Row ${candidateRow.toString()} was rejected for being all zero.`);
			return false;
		}
		for(let i = 0; i < Math.min(this.rowData.length, this.rowNumber); ++i) {
			if(this.rowData[i] == 0 && candidateRow.getEntry(i) != 0) {
			console.log(`Row ${candidateRow.toString()} was rejected because entry ${i} was zero in target row but not manipulator row.`);
				return false;
			}
		}
		return true;
	}
	//Continuously tries to reduce the numbers until it can't anymore
	simplifyRow() {
		let simplifyCoefficient = 1;
		console.log(`Attempting to simplify row ${this.rowData}`);
		//creates a copy of the prime numbers array
		let relevant_primes = prime_numbers.slice().reverse();
		for(let n = 0; relevant_primes.length > 0; ++n) {
			let rowData = this.rowData.map((item)=>item/relevant_primes[n]);
			if(rowData.every((item)=>Number.isInteger(item))) {
				this.rowData = rowData;
				console.log(`${relevant_primes[n]} is a relevant prime`);
				simplifyCoefficient *= relevant_primes[n];
				--n;
			} else {
				//This removes the irrelevant prime number, and moves our counter back so we don't skip numbers
				console.log(`${relevant_primes[n]} is an irrelevant prime (n=${n})`);
				relevant_primes.splice(n, 1);
				console.log(`Remaining primes are ${relevant_primes} (L=${relevant_primes.length})`);
				--n;
			}
		}
		return simplifyCoefficient;
	}
	length() {
		return this.rowData.length;
	}
	toString() {
		return this.rowData;
	}
}

class Matrix {
	constructor(matrixData) {
		this.matrixData = matrixData;
	}
	//Target Row is the row we're going to change, while manipulator row is the row we're using to change it
	rowOperation(targetRow, manipulatorRow, targetRowCoefficient=1, manipulatorCoefficient=1) {
		console.log(`RR Operation on ${targetRow+1} using ${targetRowCoefficient} coefficient and ${manipulatorRow+1} as the manipulator row with ${manipulatorCoefficient} coefficient.`);
		this.matrixData[targetRow].rowOperation(this.matrixData[manipulatorRow], targetRowCoefficient, manipulatorCoefficient);
	}
	deepCopy() {
		return new Matrix(this.matrixData);
	}
	printDump() {
		for(let rowPos = 0; rowPos < this.matrixData.length; ++rowPos) {
			console.log(this.matrixData[rowPos].toString());
		}
	}
	getEntry(rowNumber, columNumber){
		return this.matrixData[rowNumber].getEntry(columNumber);
	}
	rowLength() {
		return this.matrixData.length;
	}
	columnLength() {
		return this.matrixData[0].length();
	}
	getRow(rowPos) {
		return this.matrixData[rowPos];
	}
	simplifyMatrix() {
		let simplifyCoefficientAggregate = 1;
		console.log(`Attempting to simplify the matrix.`);
		this.matrixData.forEach((row)=>{
			simplifyCoefficientAggregate *= row.simplifyRow();
		});
		return simplifyCoefficientAggregate;
	}
}
function zeroRowEntry(matrix, targetRowPos, columnPos) {

	let targetRow = matrix.getRow(targetRowPos);
	if(targetRow.getEntry(columnPos) != 0) {
		let manipulatorRowPos = 0;
		while(manipulatorRowPos < matrix.rowLength() && !targetRow.rowOperationCompadible(matrix.getRow(manipulatorRowPos))) {
			console.log(`Unsuccessfully tested row ${manipulatorRowPos} for being operation rowOperationCompadible.`);
			++manipulatorRowPos;
		}
		let manipulatorRow = matrix.getRow(manipulatorRowPos);
		if(typeof manipulatorRow == 'undefined') {
			console.log(`Unable to row reduce column ${columnPos} for ${targetRow.toString()}.`);
			return;
		}
		matrix.rowOperation(targetRowPos, manipulatorRowPos, manipulatorRow.getEntry(columnPos), targetRow.getEntry(columnPos));
		
		console.log(`After Zeroing Entry ${targetRowPos+1}, ${columnPos+1}:`);
		matrix.printDump();
	} else {
		return;
	}
}
function diagonalReduce(originalMatrix) {
	let matrix = originalMatrix.deepCopy();
	//it should actually be n(n-1), but we're just going to assume a bit higher of a value instead
	let expectedOperationsMax = Math.pow(matrix.length,2);
	for(let columnPos = 0; columnPos < matrix.columnLength(); ++columnPos) {
		for(let rowPos = 0; rowPos < matrix.rowLength(); ++rowPos) {
			if(rowPos == columnPos) {
				continue;
			}
			zeroRowEntry(matrix, rowPos, columnPos);
		}
	}
	return matrix;
}
function upperTriangularReduce(originalMatrix) {
	let matrix = originalMatrix.deepCopy();
	for(let rowPos = 1; rowPos < matrix.rowLength(); ++rowPos) {
		console.log(`Starting Row Operations for row ${rowPos}. Expecting to perform ${rowPos} row operations.`);
		for(let columnPos = 0; columnPos < rowPos; ++columnPos) {
			zeroRowEntry(matrix, rowPos, columnPos);
		}
	}
	return matrix;
}
function calculateDeterminant(matrix) {
	let triangularReducedMatrix = upperTriangularReduce(matrix);
	let partialDeterminant = 1;
	partialDeterminant *= triangularReducedMatrix.simplifyMatrix();
	triangularReducedMatrix.printDump();
	for(let i = 0; i < triangularReducedMatrix.columnLength(); ++i) {
		console.log(`Triangular Reduced Matrix ${i}, ${i} is ${triangularReducedMatrix.getEntry(i, i)}`);
		partialDeterminant *= triangularReducedMatrix.getEntry(i, i);
	}
	return partialDeterminant;
}
/*
let matrix = new Matrix(
	[
		new MatrixRow([1, 2, 3]),
		new MatrixRow([4, 5, 6]),
		new MatrixRow([7, 8, 9]),
	]
);
*/
let matrix = new Matrix(
	[
		new MatrixRow([1, 2, 3, 4], 0),
		new MatrixRow([5, 6, 7, 8], 1),
		new MatrixRow([2, 6, 4, 8], 2),
		new MatrixRow([3, 1, 1, 2], 3),
	]
);

matrix.printDump();
console.log(`Determinat of the matrix is ${calculateDeterminant(matrix)}.`);
/*
console.log(`Performing Matrix Row Operations`);
matrix = upperTriangularReduce(matrix);
console.log(`Printing Upper Triangular Matrix`);
matrix.printDump();
*/