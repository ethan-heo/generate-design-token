import Token from "../Token";
import UseCase from "./UseCase.abstract";
import UseCase1 from "./UseCase1";

class UseCases {
	#useCases: UseCase[];
	constructor() {
		this.#useCases = [UseCase1].map((UseCase) => new UseCase());
	}

	transform(baseToken: Token, tokens: Token[]) {
		this.#useCases.forEach((useCase) => useCase.transform(baseToken, tokens));
	}
}

export default UseCases;
