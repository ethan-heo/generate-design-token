import * as Types from "./types";
import Token from "./Token";
import UseCases from "./useCases";

const generateDesignToken = (base: Types.Token, ...raws: Types.Token[]) => {
	const baseToken = new Token(base);
	const tokens = raws.map((raw) => new Token(raw));

	// transform to cases
	// 1. 케이스 구조 설계
	// 	- 케이스는 토큰 구조 객체 및 토큰 객체에서 다른 토큰 구조를 참조하는 형태로 구성된다.
	//	- 케이스 자체는 토큰을 순회하며 해당 케이스를 찾고 변환하는 과정을 거친다.
	//  - 만약 토큰 클래스 내부에서 이 케이스를 처리한다고 하면 다른 토큰 클래스와 의존성이 생겨남.
	//  - 이 과정은 응집도를 높이기 보다 결합도를 높이는 케이스라고 보임. 이유는 외부 컨텍스트(토큰 클래스)와 1:N의 관계가만들어지며 여러 클래스를 사용할 때 N:M의 관계가 될 수 있기 때문
	//  - 케이스와 토큰을 사용할 때 구조적으로 응집도를 높이고 결합도를 낮출 수 있는 방법이 무엇이있을까?
	//  - 케이스가 토큰을 의존해야할까? 토큰이 케이스를 의존해야할까?
	//  - 케이스가 토큰을 의존하는 경우
	//    - 케이스가 토큰을 의존하면 토큰은 변경점이 없음. 케이스가 토큰의 인터페이스를 사용하기만 하면 됨.
	//  - 토큰이 케이스를 의존하는 경우
	//	  - 토큰에 케이스 변경에 대한 인터페이스를 추가해야 하는 상황이 발생함. 토큰 클래스의 목적성이 불분명해짐.
	const useCases = new UseCases();

	useCases.transform(baseToken, tokens);

	// parse token
};

export default generateDesignToken;
