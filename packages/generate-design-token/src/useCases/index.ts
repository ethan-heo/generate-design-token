import Token from "../Token";
import UseCase from "./UseCase.abstract";
import UseCase1 from "./UseCase1";
import UseCase2 from "./UseCase2";
import UseCase3 from "./UseCase3";
import UseCase4 from "./UseCase4";

class UseCases {
	#useCases: UseCase<any>[];
	constructor() {
		this.#useCases = [UseCase1, UseCase2, UseCase3, UseCase4].map(
			(UseCase) => new UseCase(),
		);
	}

	transform(baseToken: Token, tokens: Token[]) {
		this.#useCases.forEach((useCase) => useCase.transform(baseToken, tokens));
	}
}

export default UseCases;
