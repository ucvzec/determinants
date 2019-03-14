const prime_numbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

const debugging = false;

function simplify_list(numbers) {
	let simplify_coefficient = 1;
	if(debugging)
		console.log(`Attempting to simplify ${numbers}`);
	//creates a copy of the prime numbers array
	let relevant_primes = prime_numbers.slice().reverse();
	for(let n = 0; relevant_primes.length > 0; ++n) {
		let simplified_numbers = numbers.map((item)=>item/relevant_primes[n]);
		if(simplified_numbers.every((item)=>Number.isInteger(item))) {
			numbers = simplified_numbers;
			if(debugging)
				console.log(`${relevant_primes[n]} is a relevant prime`);
			simplify_coefficient *= relevant_primes[n];
			--n;
		} else {
			//This removes the irrelevant prime number, and moves our counter back so we don't skip numbers
			if(debugging)
				console.log(`${relevant_primes[n]} is an irrelevant prime (n=${n})`);
			relevant_primes.splice(n, 1);
			if(debugging)
				console.log(`Remaining primes are ${relevant_primes} (L=${relevant_primes.length})`);
			--n;
		}
	}
	return [numbers, simplify_coefficient];
}

module.exports = {
	simplify_list,
}