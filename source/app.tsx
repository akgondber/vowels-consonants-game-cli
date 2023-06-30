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
];

const defaultWords = wordsSuite[0];

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
	return (speed / 10) * 150;
};

export {isNumeric, hideWord};

/* eslint-disable complexity */
export default function App({
	isBannerDisabled = false,
	words,
	speed = 3,
	hasExtraComplication = false,
}: Props) {
	const [answer, setAnswer] = useState('');
	const [consonantsAnswer, setConsonantsAnswer] = useState('');
	const [scores, setScores] = useState(0);
	const [padLeft, setPadLeft] = useState(0);
	const [gameOver, setGameOver] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [gameSpeed, setGameSpeed] = useState(calculateSpeedInMs(speed));
	const [isChangingSpeed, setIsChangingSpeed] = useState(false);
	const [addComplication, setAddComplication] = useState(hasExtraComplication);
	const [vowelCountIsCorrect, setVowelCountIsCorrect] = useState(false);
	const [vowelsIsSubmitted, setVowelsIsSubmitted] = useState(false);
	const [consonantCountIsCorrect, setConsonantCountIsCorrect] = useState(false);
	const [consonantsIsSubmitted, setConsonantsIsSubmitted] = useState(false);
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
	const [passedRounds, setPassedRounds] = useState(0);

	const startNewRound = () => {
		const newRoundIndex =
			passedRounds === wordsSuite.length - 1 ? 0 : passedRounds + 1;

		setPassedRounds(newRoundIndex);
		setIsRunning(true);
		setGameOver(false);
		setCurrentIndex(0);
		setCurrentSubject('VOWELS');
		setRoundWords(wordsSuite[newRoundIndex]!);
		setPadLeft(0);
		setScores(0);
		setAnswer('');
		setVowelCountIsCorrect(false);
		setVowelsIsSubmitted(false);
		setConsonantCountIsCorrect(false);
		setConsonantsIsSubmitted(false);
		setConsonantsAnswer('');
		setCurrentGameRound(newRoundIndex === 0 ? 1 : currentGameRound + 1);
	};

	const resetIterationFields = () => {
		setCurrentIndex(previousIndex => previousIndex + 1);
		setVowelCountIsCorrect(false);
		setPadLeft(0);
		setAnswer('');
		setConsonantsAnswer('');
		setConsonantCountIsCorrect(false);
		setVowelsIsSubmitted(false);
		setConsonantsIsSubmitted(false);
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

					resetIterationFields();

					setCurrentSubject('VOWELS');
				} else {
					setPadLeft(previousPadLeft => previousPadLeft + 1);
				}
			}, gameSpeed);

			return () => {
				clearInterval(roundInterval);
			};
		}
	}, [padLeft, currentIndex, gameSpeed, isRunning, roundWords]);

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
							{currentGameRound > -1 ? (
								<Text>
									<Text color="#c7d3d4" backgroundColor="#603f83">
										Result:
									</Text>
									<Text>
										{' '}
										{scores} of {roundWords.length}
									</Text>
								</Text>
							) : (
								<Text>
									Count up vowels and consonants in the escaping word.
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
									<Text> - change game speed</Text>
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
								<Text color={isVowelSubject() ? 'cyan' : ''}>VOWELS</Text>:{' '}
								{isVowelSubject() && PointerSymbol}
							</Text>
							<TextInput
								focus={currentSubject === 'VOWELS'}
								value={answer}
								onChange={setAnswer}
								onSubmit={va => {
									setVowelsIsSubmitted(true);
									const userAnswer = Number(va);
									const currentRoundWord = roundWords[currentIndex]!;
									const correctCount = getVowelCount(currentRoundWord);

									if (userAnswer === correctCount) {
										if (consonantCountIsCorrect) {
											if (currentIndex >= roundWords.length - 1) {
												setGameOver(true);
												setConsonantsAnswer('');
												setIsRunning(false);
												return;
											}

											setScores(scores + 1);
											resetIterationFields();
										} else {
											setCurrentSubject('CONSONANTS');
											setVowelCountIsCorrect(true);
										}
									}
								}}
							/>
							{vowelCountIsCorrect
								? SuccessIndicator
								: vowelsIsSubmitted && ErrorIndicator}
						</Box>
						<Box>
							<Text>
								<Text color={isVowelSubject() ? '' : 'cyan'}>CONSONANTS</Text>:{' '}
								{!isVowelSubject() && PointerSymbol}
							</Text>
							<TextInput
								focus={currentSubject === 'CONSONANTS'}
								value={consonantsAnswer}
								onChange={setConsonantsAnswer}
								onSubmit={value => {
									setConsonantsIsSubmitted(true);
									const userAnswer = Number(value);
									const currentRoundWord = roundWords[currentIndex]!;
									const correctCount = getConsonantCount(currentRoundWord);

									if (userAnswer === correctCount) {
										if (vowelCountIsCorrect) {
											if (currentIndex >= roundWords.length - 1) {
												setGameOver(true);
												setConsonantsAnswer('');
												setIsRunning(false);
												return;
											}

											setScores(scores + 1);
											resetIterationFields();
										} else {
											setConsonantCountIsCorrect(true);
										}

										setCurrentSubject('VOWELS');
									}
								}}
							/>
							{consonantCountIsCorrect
								? SuccessIndicator
								: consonantsIsSubmitted && ErrorIndicator}
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
/* eslint-enable complexity */
