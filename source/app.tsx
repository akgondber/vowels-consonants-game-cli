import React, {useState, useEffect} from 'react';
import {Text, Box, useInput} from 'ink';
import Gradient from 'ink-gradient';
import TextInput from 'ink-text-input';
import figures from './figures.js';

type Props = {
	isBannerDisabled?: boolean;
	words?: string[];
	speed?: number;
	hasExtraComplication?: boolean;
};
type Subject = 'VOWELS' | 'CONSONANTS';
type InputState = 'WAITING' | 'WRONG' | 'CORRECT';

const wordsSuite = [
	[
		'coal',
		'attention',
		'deliberation',
		'exposition',
		'relation',
		'vagary',
		'drain',
		'moisture',
		'surprise',
	],
	[
		'glove',
		'fatherhood',
		'testimony',
		'attention',
		'affliction',
		'evasion',
		'absence',
		'instructor',
		'statement',
	],
	[
		'toolbox',
		'paintbrush',
		'screw',
		'screwdriver',
		'wrench',
		'bolt',
		'shovel',
		'rake',
		'hammer',
	],
	[
		'cotton',
		'silk',
		'chiffon',
		'crepe',
		'denim',
		'lace',
		'leather',
		'linen',
		'satin',
		'velvet',
		'wool',
	],
	[
		'staple',
		'eraser',
		'highlighter',
		'pencil',
		'marker',
		'glue',
		'scissors',
		'paper',
		'notebook',
		'envelope',
		'clipboard',
	],
	[
		'ventilator',
		'mixer',
		'toaster',
		'iron',
		'laptop',
		'dishwasher',
		'camera',
		'refrigerator',
		'squeezer',
		'juicer',
	],
	['performance', 'score', 'tournament', 'umpire', 'arena', 'fitness'],
];

const defaultWords = wordsSuite[0];
const nextIterationDelay = 800;

const hideWord = (word: string): string => {
	let result = '';
	let i = 0;
	while (i < word.length) {
		result += '-';
		i++;
	}

	return result;
};

const charIsVowel = (char: string) => {
	const charLower = char.toLowerCase();
	return ['a', 'e', 'i', 'o', 'u', 'y'].includes(charLower);
};

const getVowelCount = (word: string): number => {
	let result = 0;

	for (const char of word) {
		if (
			((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) &&
			charIsVowel(char)
		) {
			result += 1;
		}
	}

	return result;
};

const getConsonantCount = (word: string): number => {
	let result = 0;

	for (const char of word) {
		if (
			((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) &&
			!charIsVowel(char)
		) {
			result += 1;
		}
	}

	return result;
};

const isNumeric = (value: string): boolean =>
	!Number.isNaN(value as any) && !Number.isNaN(Number.parseFloat(value));

const calculateSpeedInMs = (speed: number) => {
	return ((speed + 2) / 10) * 150;
};

const range = (start: number, stop: number): number[] => {
	const result = [];

	for (let i = start; i < stop; i++) {
		result.push(i);
	}

	return result;
};

const rand = (max: number): number => {
	return Math.floor(Math.random() * max);
};

export {isNumeric, hideWord};

export default function App({
	isBannerDisabled = false,
	words,
	speed = 3,
	hasExtraComplication = false,
}: Props) {
	const [vowelsAnswer, setVowelsAnswer] = useState('');
	const [consonantsAnswer, setConsonantsAnswer] = useState('');
	const [scores, setScores] = useState(0);
	const [padLeft, setPadLeft] = useState(0);
	const [gameOver, setGameOver] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [gameSpeed, setGameSpeed] = useState(calculateSpeedInMs(speed));
	const [isChangingSpeed, setIsChangingSpeed] = useState(false);
	const [addComplication, setAddComplication] = useState(hasExtraComplication);
	const [isRunning, setIsRunning] = useState(false);
	const [newChangingSpeedValue, setNewChangingSpeedValue] = useState(
		String(speed),
	);
	const [currentSubject, setCurrentSubject] = useState<Subject>('VOWELS');
	const [error, setError] = useState('');
	const gameRoundWords = words && words.length > 0 ? words : defaultWords!;
	const [roundWords, setRoundWords] = useState<string[]>(gameRoundWords);
	const [currentGameRound, setCurrentGameRound] = useState(0);

	const showBanner = !isBannerDisabled;
	const [freeIterationIndexes, setFreeIterationIndexes] = useState(
		range(0, wordsSuite.length),
	);
	const [vowelInputState, setVowelInputState] = useState<InputState>('WAITING');
	const [consonantInputState, setConsonantInputState] =
		useState<InputState>('WAITING');

	const startNewRound = () => {
		const newRoundIndex =
			freeIterationIndexes.length === 0
				? rand(wordsSuite.length)
				: Math.floor(Math.random() * freeIterationIndexes.length);

		setFreeIterationIndexes(previousFreeIterationIndexes => {
			if (freeIterationIndexes.length === 0) {
				return range(0, wordsSuite.length);
			}

			return previousFreeIterationIndexes.filter(
				value => value !== newRoundIndex,
			);
		});

		setIsRunning(true);
		setGameOver(false);
		setCurrentIndex(0);
		setCurrentSubject('VOWELS');
		setRoundWords(wordsSuite[newRoundIndex]!);
		setPadLeft(0);
		setScores(0);
		setVowelsAnswer('');
		setConsonantsAnswer('');
		setConsonantsAnswer('');
		setCurrentGameRound(newRoundIndex === 0 ? 1 : currentGameRound + 1);
	};

	const setIterationFields = () => {
		setPadLeft(0);
		setVowelsAnswer('');
		setConsonantsAnswer('');
		setCurrentSubject('VOWELS');
		setCurrentIndex(currentIndex + 1);
		setVowelInputState('WAITING');
		setConsonantInputState('WAITING');
	};

	useEffect(() => {
		if (isRunning) {
			const roundInterval = setInterval(() => {
				if (
					padLeft + roundWords[currentIndex]!.length + 3 >
					process.stdout.columns
				) {
					if (currentIndex >= roundWords.length - 1) {
						clearInterval(roundInterval);
						setGameOver(true);
						setIsRunning(false);
						return;
					}

					setVowelInputState('WAITING');
					setConsonantInputState('WAITING');
					setPadLeft(0);
					setVowelsAnswer('');
					setConsonantsAnswer('');
					setCurrentSubject('VOWELS');
					setCurrentIndex(currentIndex + 1);
					setVowelInputState('WAITING');
					setConsonantInputState('WAITING');
				} else {
					setPadLeft(previousPadLeft => previousPadLeft + 1);
				}
			}, gameSpeed);

			return () => {
				clearInterval(roundInterval);
			};
		}
	}, [
		padLeft,
		currentIndex,
		gameSpeed,
		isRunning,
		vowelsAnswer,
		consonantsAnswer,
		roundWords,
		vowelInputState,
		consonantInputState,
	]);

	useInput((input, key) => {
		if (gameOver) {
			switch (input) {
				case 'n': {
					startNewRound();

					break;
				}

				case 't': {
					setAddComplication(!addComplication);

					break;
				}

				case 's': {
					setIsChangingSpeed(true);

					break;
				}

				// No default
			}
		} else if (key.tab) {
			setCurrentSubject(isVowelSubject() ? 'CONSONANTS' : 'VOWELS');
		}
	});

	const hasError = () => error !== '';
	const getCurrentWord = (): string => {
		return roundWords[currentIndex]!;
	};

	const getCurrentWordUpper = (): string => {
		return getCurrentWord().toUpperCase();
	};

	const isVowelSubject = (): boolean => currentSubject === 'VOWELS';
	const allSubjectsAreCorrect = () => {
		return vowelInputState === 'CORRECT' && consonantInputState === 'CORRECT';
	};

	const SuccessIndicator = <Text color="green">{` ${figures.tick}`}</Text>;
	const ErrorIndicator = <Text color="red">{` ${figures.cross}`}</Text>;
	const PointerSymbol = <Text color="cyan">{figures.pointer} </Text>;

	function BannerComponent() {
		return (
			showBanner && (
				<Box flexDirection="column" alignItems="center" paddingBottom={1}>
					<Gradient name="summer">
						<Text>VOWELS-CONSONANTS-GAME</Text>
					</Gradient>
				</Box>
			)
		);
	}

	return (
		<>
			<BannerComponent />
			{gameOver ? (
				isChangingSpeed ? (
					<Box flexDirection="column">
						{hasError() && <Text color="red">{error}</Text>}
						<Box>
							<Text>New speed: </Text>
							<TextInput
								focus={isChangingSpeed}
								value={newChangingSpeedValue}
								onChange={value => {
									setNewChangingSpeedValue(value);
									if (hasError() && isNumeric(value)) {
										setError('');
									}
								}}
								onSubmit={value => {
									if (isNumeric(value)) {
										const newSpeed = Number(value);
										if (hasError()) {
											setError('');
										}

										setGameSpeed(calculateSpeedInMs(newSpeed));
										setIsChangingSpeed(false);
									} else {
										setError('Wrong speed value');
									}
								}}
							/>
						</Box>
					</Box>
				) : (
					<Box flexDirection="column">
						<Box flexDirection="column">
							{currentGameRound > 0 ? (
								<Text>
									<Text color="#c7d3d4" backgroundColor="#603f83">
										RESULT:
									</Text>
									<Text>
										{' '}
										{scores} of {roundWords.length}
									</Text>
								</Text>
							) : (
								<Text>
									Count up vowels and consonants of the escaping word.
								</Text>
							)}
						</Box>
						<Box flexDirection="column" paddingTop={1}>
							<Text>Press: </Text>
							<Box flexDirection="column">
								<Box>
									<Text bold color="green">
										n
									</Text>
									<Text> - start a new round</Text>
								</Box>
								<Box>
									<Text bold color="cyan">
										s
									</Text>
									<Text>
										{' '}
										- change game speed (the lower the value, the more difficult
										the passage; current: {newChangingSpeedValue})
									</Text>
								</Box>
								<Box>
									<Text bold color="magenta">
										t
									</Text>
									<Text>
										{' '}
										- toggle `complicate` setting (current:{' '}
										{addComplication ? 'enabled' : 'disabled'})
									</Text>
								</Box>
							</Box>
						</Box>
					</Box>
				)
			) : (
				<Box flexDirection="column">
					<Box paddingLeft={padLeft} flexDirection="column">
						<Text>
							{addComplication
								? padLeft % 5 === 0 ||
								  (padLeft % 3 === 0 && padLeft % 2 === 0) ||
								  (padLeft % 4 === 0 && padLeft % 5 === 0)
									? hideWord(getCurrentWord())
									: getCurrentWordUpper()
								: getCurrentWordUpper()}
						</Text>
					</Box>
					<Box
						width={process.stdout.columns}
						alignItems="center"
						justifyContent="space-around"
						paddingTop={2}
					>
						<Box>
							<Text>
								<Text color="#d7c49e">VOWELS</Text>:{' '}
								{isVowelSubject() && PointerSymbol}
							</Text>
							<TextInput
								focus={currentSubject === 'VOWELS'}
								value={vowelsAnswer}
								onChange={value => {
									if (allSubjectsAreCorrect()) {
										return;
									}

									setVowelsAnswer(value);

									setVowelInputState('WAITING');
								}}
								onSubmit={value => {
									setVowelInputState('WAITING');

									const userAnswer = Number(value);
									const currentRoundWord = roundWords[currentIndex]!;
									const correctCount = getVowelCount(currentRoundWord);

									if (userAnswer === correctCount) {
										setVowelInputState('CORRECT');

										if (consonantInputState === 'CORRECT') {
											if (currentIndex >= roundWords.length - 1) {
												setTimeout(() => {
													setVowelInputState('WAITING');
													setConsonantInputState('WAITING');
													setGameOver(true);
												}, nextIterationDelay);

												return;
											}

											setScores(scores + 1);
											setTimeout(() => {
												setIterationFields();
											}, 100);
										} else {
											setCurrentSubject('CONSONANTS');
										}
									} else {
										setVowelInputState('WRONG');
									}
								}}
							/>
							{vowelInputState !== 'WAITING' &&
								(vowelInputState === 'WRONG'
									? ErrorIndicator
									: SuccessIndicator)}
						</Box>
						<Box>
							<Text>
								<Text color="#f2edd7">CONSONANTS</Text>:{' '}
								{!isVowelSubject() && PointerSymbol}
							</Text>
							<TextInput
								focus={currentSubject === 'CONSONANTS'}
								value={consonantsAnswer}
								onChange={value => {
									if (allSubjectsAreCorrect()) {
										return;
									}

									setConsonantsAnswer(value);
									setConsonantInputState('WAITING');
								}}
								onSubmit={value => {
									setConsonantInputState('WAITING');
									const userAnswer = Number(value);
									const currentRoundWord = roundWords[currentIndex]!;
									const correctCount = getConsonantCount(currentRoundWord);

									if (userAnswer === correctCount) {
										setConsonantInputState('CORRECT');

										if (vowelInputState === 'CORRECT') {
											if (currentIndex >= roundWords.length - 1) {
												setTimeout(() => {
													setConsonantInputState('WAITING');
													setVowelInputState('WAITING');
													setGameOver(true);
												}, 100);

												return;
											}

											setScores(scores + 1);
											setTimeout(() => {
												setIterationFields();
											}, nextIterationDelay);
										} else {
											setCurrentSubject('VOWELS');
										}
									} else {
										setConsonantInputState('WRONG');
									}
								}}
							/>
							{consonantInputState !== 'WAITING' &&
								(consonantInputState === 'WRONG'
									? ErrorIndicator
									: SuccessIndicator)}
						</Box>
						<Box alignItems="flex-end">
							<Text color="#adefd1" backgroundColor="#00203f">
								SCORE: {scores}
							</Text>
						</Box>
					</Box>
				</Box>
			)}
		</>
	);
}
